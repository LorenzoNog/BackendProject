import cartsService from "../services/carts.service.js";
import ticketsService from "../services/tickets.service.js";
import transporter from "../utils/nodemailer.js";
import { verifyToken } from "../utils.js";
import logger from "../utils/winston.js";
import { CartsModel } from "../daos/mongoDao/models/cartsModel.js";
import CartDTO from "../dto/cartsDto/cartDto.js";
import usersService from "../services/users.service.js";

const date = new Date();
class CartsController {
  createCart = async (req, res) => {
    const { cart } = req.body;
    try {
      const cartDto = new CartDTO(cart);
      const newCart = await cartsService.createCart(cartDto);
      res.send(newCart);
    } catch (error) {
      logger.error(error.message);
    }
  };

  getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await cartsService.getById(cid);
      res.send(cart);
    } catch (error) {
      logger.error(error.message);
    }
  };

  getCarts = async (req, res) => {
    try {
      const carts = await cartsService.getCarts();
      res.send(carts);
    } catch (error) {
      logger.error(error.message);
    }
  };

  deleteCartById = async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await cartsService.deleteById(id);
      res.send(cart);
    } catch (error) {
      logger.error(error.message);
    }
  };

  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const addProd = await cartsService.addProductToCart(cid, pid);
      res.json({ message: "producto agregado con exito al carrito", addProd });
    } catch (error) {
      logger.error(error);
    }
  };

  emptyCartById = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await cartsService.getById(cid);
      if (cart) {
        const emptyCart = await CartsModel.updateOne(
          { _id: cid },
          {
            $set: {
              products: [],
            },
          }
        );
        res.send({ message: "Carrito vaciado", emptyCart });
      } else {
        logger.error("No se encontro un carrito con el id solicitado.");
      }
    } catch (error) {
      logger.error(error.message);
    }
  };

  deleteProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const updateCart = await cartsService.deleteProductInCart(cid, pid);
      res.send(updateCart);
    } catch (error) {
      logger.error(error.message);
    }
  };

  updateQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const updateCart = await cartsService.updateQuantity(cid, pid, quantity);
      res.send(updateCart);
    } catch (error) {
      logger.error(error.message);
    }
  };

  purchase = async (req, res) => {
    try {
      const token = req.cookies.login.token;
      const tokenData = await verifyToken(token);
      const user = tokenData.user;
      const email = tokenData.user.email;
      const cartId = tokenData.user.cart;
      const cart = await cartsService.getById(cartId);
      const total = cart.products.reduce((acc, prod) => {
        const productTotal = prod.quantity * prod.price;
        return acc + productTotal;
      }, 0);
      const purchaseDate = date.toLocaleString("es-ES");
      const ticketCode = Date.now() + Math.floor(Math.random() * 10000 + 1);
      const ticket = {
        code: ticketCode,
        purchase_datetime: purchaseDate,
        purchaser: email,
        amount: total,
        order: cart.products,
      };
      const purchaseTicket = await ticketsService.createTicket(ticket);
      user.tickets.push(purchaseTicket._id);
      await usersService.updateUser(user._id, user);
      transporter.sendMail({
        from: "Ecommerce",
        to: email,
        subject: "Tu ticket de compra.",
        html: `
        <div>
          <h1>Gracias por tu compra!</h1>
          <h2>Tu ticket:</h2>
          <div >
            <p >Código de ticket: ${ticket.code}</p>
            <p>Fecha de compra: ${ticket.purchase_datetime}</p>
            <p>Monto abonado: $ ${ticket.amount}</p>
            <p>Productos: ${ticket.order.length}</p>
          </div>
        </div>
        `,
      });
      await CartsModel.updateOne(
        { _id: cartId },
        {
          $set: {
            products: [],
          },
        }
      );
      res.send(purchaseTicket);
    } catch (error) {
      logger.error("el error esta por aqui");
    }
  };
}

export default new CartsController();
