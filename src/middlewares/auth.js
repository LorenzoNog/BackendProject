import usersService from "../services/users.service.js";
import logger from "../utils/winston.js";
import { verifyToken } from "../utils.js";


export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    if (token) {
      next();
    } else {
      res.send({ error: "No estas registrado." });
    }
  } catch (error) {
    logger.error("el error esta aqui");
  }
};

export const checkRoleAuth = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop()
    const tokenData = await verifyToken(token);
    const user = await usersService.getById(tokenData.user._id);
    if ([].concat(role).includes(user.role)) {
      next();
    } else {
      res.send("No tienes permiso para realizar esto.");
    }
  } catch (error) {
    logger.error("El error esta en checkRoleAuth");
  }
};
