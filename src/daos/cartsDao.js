import productsService from "../services/products.service.js";
import { CartsModel } from "./mongoDao/models/cartsModel.js";
import logger from "../utils/winston.js";

class CartsDao {
  constructor(model) {
    this.model = model;
  }

  async createCart(obj) {
    try {
      const cart = await this.model.create(obj);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.model.findById(id);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async getCarts() {
    try {
      const carts = await this.model.find();
      return carts;
    } catch (error) {
      return error;
    }
  }

  async deleteCartById(id) {
    try {
      const cart = await this.model.findByIdAndDelete(id);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async deleteProductInCart(id, prodId) {
    try {
      const cart = await this.model.findById(id);
      if (cart) {
        const deleteItemInCart = await this.model.findOne(
          { _id: id },
          {
            $pull: {
              products: {
                _id: prodId,
              },
            },
          }
        );
        return deleteItemInCart;
      } else {
        return cart;
      }
    } catch (error) {
      return error;
    }
  }

  async updateQuantity(id, prodId, quantity) {
    try {
      const cart = await this.model.findById(id);
      if (cart) {
        const updateQuantity = await this.model.findOne(
          { _id: id },
          {
            $set: {
              "products.$.quantity": quantity,
            },
          },
          { new: true }
        );
        return updateQuantity;
      } else {
        return cart;
      }
    } catch (error) {
      return error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await this.model.findById(cid)
      const product = await productsService.getById(pid)
      const {_id, title,price,category,code,quantity} = product
      let result = await this.model.findOne({_id : cart._id, 'products._id' : pid})
      if(result === null){
        cart.products.push({ _id,title,price,category,code, quantity:1 })
      }else{
        const update = await this.model.updateOne({_id: cart._id, 'products._id': pid},{
          $inc:{
            'products.$.quantity':1
          }
        })
        return update
      }
      const updateCart = await this.model.findByIdAndUpdate(cid, cart);
      return updateCart
    } catch (error) {
      return error;
    }
  }
}

export default new CartsDao(CartsModel);
