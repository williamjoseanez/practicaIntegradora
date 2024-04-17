const winston = require("winston");


const niveles = {
  nivel: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colores: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

const logger = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "http", 
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}), 
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errores.log", 
            level: "warning",
            format: winston.format.simple()
        })
    ]
})

const loggerProduction = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "http", 
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}), 
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errores.log", 
            level: "info",
            format: winston.format.simple()
        })
    ]
})

const loggerDevelopment = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "http", 
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}), 
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errores.log", 
            level: "debug",
            format: winston.format.simple()
        })
    ]
})

const addLogger = (req, res, next) => {
    // Selecciona el logger correspondiente según el entorno
    req.logger = process.env.NODE_ENV === "production" ? loggerProduction : loggerDevelopment;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
  };

module.exports = addLogger;
