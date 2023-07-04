import express from "express";
import { __dirname } from "./utils.js";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import path from 'path'
//routers
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
//handlebars config
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import handlebars from "express-handlebars";
//import swaggerUI from 'swagger-ui-express'

//conectando a mongo
import "./config/configMongo.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//static files
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath));

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/users", usersRouter);
app.use("/", viewsRouter);

//tests
app.use("/loggertest", (req, res) => {
  logger.info("logger info");
  logger.fatal("logger fatal");
  logger.error("logger error");
  logger.warning("logger warning");
  logger.http("logger http");
  logger.debug("logger debug");
  res.send("loggers");
});

//handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    extname: "handlebars",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.listen(config.PORT, (req, res) => {
  console.log(`Escuchando al puerto ${config.PORT}`);
});
