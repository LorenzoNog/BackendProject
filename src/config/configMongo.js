import mongoose from "mongoose";
import config from "./config.js";
import logger from "../utils/winston.js";
const URL = config.MONGO_URI

mongoose.connect(URL)
.then(() => {
    logger.info('Conectado correctamente a la base de datos.')
})
.catch(() => {
    logger.error('Error al intentar conectar con la base de datos.')
})