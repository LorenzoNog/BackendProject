import { TokensModel } from "../daos/mongoDao/models/tokensModel.js";
import { UsersModel } from "../daos/mongoDao/models/usersModel.js";
import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";
import ticketsService from "../services/tickets.service.js";
import logger from "../utils/winston.js";
import { verifyToken } from "../utils.js";
import usersService from "../services/users.service.js";

class ViewsController {
  login = async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      logger.error(error.message);
    }
  };

  products = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, ...query } = req.query;
      const options = {
        limit: limit,
        page: page,
        sort: sort ? { price: sort } : {},
        lean: true,
      };
      const token = req.cookies.login.token;
      if (token) {
        const tokenData = await verifyToken(token);
        const user = await usersService.getById(tokenData.user._id);
        const products = await productsService.getProducts(query, options);
        res.render("products", {
          hasProducts: products.payload.length > 0,
          products: products.payload,
          cart: user.cart,
          user,
        });
      } else {
        res.render("login");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  productDetail = async (req, res) => {
    const { prodId } = req.params;
    const token = req.cookies.login.token;
    if (token) {
      try {
        const tokenData = await verifyToken(token);
        const user = await usersService.getById(tokenData.user._id);
        const { cart } = user;
        const product = await productsService.getById(prodId);
        res.render("productDetail", {
          product: product,
          cart: cart,
          user,
        });
      } catch (error) {
        logger.error(error);
      }
    } else {
      logger.error("Error en el getProductDetail");
    }
  };

  register = async (req, res) => {
    try {
      res.render("register");
    } catch (error) {
      logger.error(error.message);
    }
  };

  profile = async (req, res) => {
    try {
      const token = req.cookies.login.token;
      if (token) {
        const tokenData = await verifyToken(token);
        const user = await usersService.getById(tokenData.user._id);
        const { _id, first_name, last_name, email, role, age, cart } = user;
        res.render("profile", {
          id: _id,
          full_name: `${first_name} ${last_name}`,
          email: email,
          role: role,
          age: age,
          cart: cart,
        });
      } else {
        res.send("Error al intentar acceder a tu perfil.");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  cart = async (req, res) => {
    const token = req.cookies.login.token;
    if (token) {
      try {
        const tokenData = await verifyToken(token);
        const user = await usersService.getById(tokenData.user._id);
        const cart = await cartsService.getById(user.cart);
        res.render("cart", {
          hasProducts: cart.products.length > 0,
          products: cart.products,
          cart: cart,
          user,
        });
      } catch (error) {
        return error;
      }
    } else {
      logger.error("Error al intentar renderizar el carrito");
    }
  };

  loginError = async (req, res) => {
    try {
      res.render("errorLogin");
    } catch (error) {
      logger.error(error.message);
    }
  };

  registerError = async (req, res) => {
    try {
      res.render(errorRegister);
    } catch (error) {
      logger.error(error.message);
    }
  };

  resetPasswordMail = async (req, res) => {
    try {
      res.render("resetPassword");
    } catch (error) {
      logger.error(error);
    }
  };

  createNewPassword = async (req, res) => {
    try {
      const { userId, token } = req.params;
      const tokenDb = await TokensModel.create({
        userId: userId,
        token: token,
      });
      if (!tokenDb) {
        res.send(
          "Lo sentimos! el link para reestablecer su contraseña ha expirado :("
        );
      } else {
        res.render("newPassword", {
          userId: userId,
          token: token,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  createProduct = async (req, res) => {
    try {
      res.render("createProduct");
    } catch (error) {
      logger.error(error);
    }
  };

  getUsers = async (req, res) => {
    try {
      const result = await UsersModel.find().lean();
      const filter = result.filter((user) => user.role !== "Admin");
      const token = req.cookies.login.token;
      const tokenData = await verifyToken(token);
      const user = await usersService.getById(tokenData.user._id);
      if (user.role === "Admin") {
        res.render("users", {
          users: filter,
          cart: user.cart,
        });
      } else {
        res.send("No autorizado.");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  checkout = async (req, res) => {
    try {
      res.render("checkout");

      //obtener ticket a partir del id pasado por params.

      /* const ticketById = await ticketsService.getTicketById(ticketId)
      const user = await UsersModel.findOne({email : ticketById.purchaser})
      const {cart} = user
      const cartById = await cartsService.getById(cart)
      res.render('checkout',{
        ticket: ticketById,
        cart: cartById,
      }) */
    } catch (error) {
      logger.error(error.message);
    }
  };

  errorDeleteProduct = async (req, res) => {
    try {
      res.render("errorDeleteProduct");
    } catch (error) {
      logger.error(error);
    }
  };
}
export default new ViewsController();
