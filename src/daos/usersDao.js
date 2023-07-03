import UserDto from "../dto/usersDto/userDto.js";
import { UsersModel } from "./mongoDao/models/usersModel.js";
import { hashPassword, comparePasswords } from "../utils.js";
import config from "../config/config.js";
import logger from "../utils/winston.js";
import CartDTO from "../dto/cartsDto/cartDto.js";
import { CartsModel } from "./mongoDao/models/cartsModel.js";

class UserDao {
  constructor(model) {
    this.model = model;
  };

  async createUser(user) {
    const { email, password, first_name, last_name, age, role, cart } = user;
    const carrito = new CartDTO();
    const userCart = await CartsModel.create(carrito);
    try {
      const existUser = await this.model.find({ email });
      if (existUser.length === 0) {
        const newUser = {
          first_name,
          last_name,
          age,
          email,
          role,
          cart: userCart._id,
          password: await hashPassword(password),
        };
        if (
          user.email.includes("@coder.com") &&
          user.password === config.ADMIN_PASSWORD
        ) {
          (newUser.role = "Admin");
        }
        if (user.email.includes("@premium.com")) {
          newUser.role = "Premium";
        }
        await this.model.create(newUser);
        logger.info(
          `Nuevo usuario: ${newUser.first_name} ${newUser.last_name}`
        );
      } else {
        return logger.error("error en el create user");
      }
    } catch (error) {
      return error;
    }
  };

  async getById(id) {
    try {
      const response = await this.model.findOne({ _id: id });
      return response;
    } catch (error) {
      return error;
    }
  };

  async getUsers() {
    try {
      const response = await this.model.find();
      const users = response.map((user) => {
        user = new UserDto(user);
      });
      return users;
    } catch (error) {
      return error;
    }
  };

  async deleteById(uid) {
    try {
      const response = await UsersModel.findByIdAndRemove(uid);
      return response
    } catch (error) {
      return error;
    }
  };

  async updateUser(id, obj) {
    try {
      const response = await this.model.findByIdAndUpdate(id, obj);
      return response;
    } catch (error) {
      return error;
    }
  };

  async loginUser(user) {
    const { email, password } = user;
    try {
      if (!email || !password) {
        logger.error("No se ingresaron los datos correspondientes.");
      } else {
        const userLogged = await this.model.findOne({ email: email });
        if (userLogged) {
          const passwords = await comparePasswords(
            password,
            userLogged.password
          );
          passwords &&
            logger.info(`Usuario logueado exitosamente: ${userLogged.email}`);
          return userLogged;
        } else {
          logger.error("La contraña no coincide con el email ingresado.");
        }
      }
    } catch (error) {
      return error;
    }
  };
}

export default new UserDao(UsersModel);
