import usersService from "../services/users.service.js";
import logger from "../utils/winston.js";
import { comparePasswords, generateToken, hashPassword } from "../utils.js";
import { UsersModel } from "../daos/mongoDao/models/usersModel.js";
import { TokensModel } from "../daos/mongoDao/models/tokensModel.js";
import transporter from "../utils/nodemailer.js";

class UsersController {
  createUser = async (req, res) => {
    const user = req.body;
    try {
      const createUser = await usersService.createUser(user);
      logger.info(createUser);
      res.redirect("/");
    } catch (error) {
      logger.error(error.message);
      res.redirect("/errorRegister");
    }
  };

  getUsers = async (req, res) => {
    try {
      const users = await usersService.getUser();
      res.send(users);
    } catch (error) {
      logger.error(error.message);
    }
  };

  getById = async (req, res) => {
    const { uid } = req.params;
    try {
      const user = await usersService.getById(uid);
      res.json({message:'Usuario encontrado', user})
    } catch (error) {
      logger.error(error.message);
    }
  };

  deleteById = async (req, res) => {
    const {uid} = req.params
    try {
      const deletedUser = await usersService.deleteById(uid)
      res.json({message:'Usuario eliminado', deletedUser})
    } catch (error) {
      logger.error(error.message);
    }
  };

  updateUser = async (req, res) => {
    const { uid } = req.params;
    const { obj } = req.body;
    try {
      const updatedUser = await usersService.updateUser(id, obj);
      res.send(updatedUser);
    } catch (error) {
      logger.error(error.message);
    }
  };

  loginUser = async (req, res) => {
    const obj = req.body;
    try {
      const user = await usersService.loginUser(obj);
      if (user) {
        const token = await TokensModel.create({
          userId: user._id,
          token: generateToken(user),
        });
        res.cookie("login", token);
        logger.info(token)
        res.redirect("/products");
      } else {
        res.redirect("/errorLogin");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await UsersModel.findOne({ email: email });
      if (!user)
        return logger.error(
          "No se encontro un usuario con el email ingresado."
        );
      let token = await TokensModel.findOne({ userId: user._id });
      if (!token) {
        token = await TokensModel.create({
          userId: user._id,
          token: generateToken(user),
        });
      }
      const url = `http://localhost:2022/new-password/${user._id}/${token.token}`;
      transporter.sendMail({
        from: "Ecommerce",
        to: "lorenzonm01@gmail.com",
        subject: "Recuperar contraseña",
        html: `<a href=${url}>Reestablecé tu contraseña</a>`,
      });
      res.send(
        "El enlace para poder recuperar su contraseña ya ha sido enviado a su correo electronico."
      );
    } catch (error) {
      logger.error(error.message);
    }
  };

  createNewPassword = async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;
    try {
      const user = await usersService.getById(userId);
      const tokenDB = await TokensModel.create({
        userId: user._id,
        token: generateToken(user),
      });
      if (!tokenDB) return logger.error("Token invalido o expirado.");

      const passwords = await comparePasswords(password, user.password);
      if (passwords) {
        res.send("La contraseña debe ser distinta a la que ya tenías.");
      } else {
        user.password = await hashPassword(password);
        await user.save();
        await TokensModel.deleteOne({ token: token });
        res.send("Contraseña reestablecida.");
      }
    } catch (error) {
      logger.error(error);
    }
  };

  logOut = async (req, res) => {
    res.cookie("login", "", { maxAge: 1 });
    logger.info("Cookie eliminada. Se cerro sesion.");
    res.redirect("/");
  };

  changeRole = async (req, res) => {
    const { uid } = req.params;
    try {
      const user = await UsersModel.findById(uid);
      const userRole = user.role;
      switch (userRole) {
        case "User":
          await UsersModel.findByIdAndUpdate(uid, {
            $set: { role: "Premium" },
          });
          res.json({
            message: `El usuario ${user.first_name} ha cambiado su rol a Premium`,
          });
          break;
        case "Premium":
          await UsersModel.findByIdAndUpdate(uid, { $set: { role: "User" } });
          res.json({
            message: `El usuario ${user.first_name} ha cambiado rol a User`,
          });
          break;
      }
    } catch (error) {
      logger.error(error.message);
    }
  };

  deleteInactiveUsers = async (req, res) => {
    try {
      const currentDate = new Date();
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(currentDate.getDate() - 2);

      const inactiveUser = await UsersModel.find({
        last_connection: { $lt: twoDaysAgo },
      });
      await UsersModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
      inactiveUser.forEach((user) => {
        transporter.sendMail({
          from: "Ecommerce",
          to: "lorenzonm01@gmail",
          subject: "Tu cuenta fue eliminada por inactividad.",
        });
      });
      res.send(
        `Se han eliminado ${inactiveUser.length} cuentas procedentes de usuarios inactivos.`
      );
    } catch (error) {
      logger.error(error.message);
    }
  };
}

export default new UsersController();
