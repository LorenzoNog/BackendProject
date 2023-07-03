import winston from "winston";
import config from "../config/config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "green",
    info: "blue",
    http: "green",
    debug: "yellow",
  },
};

let logger;

if (config.DEV_ENV === "development") {
  logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevels.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.simple(),
          winston.format.colorize({ colors: customLevels.colors })
        ),
      }),

      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.prettyPrint(),
          winston.format.colorize({ colors: customLevels.colors })
        ),
      }),
    ],
  });
}

export default logger;
