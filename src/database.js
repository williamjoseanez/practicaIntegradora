const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

class DataBase {
  static #instancia;

  constructor() {
    mongoose.connect(mongo_url);
  }

  static getInstancia() {
    if (this.#instancia) {
      // req.logger.debug("Conexion previa");
      return this.#instancia;
    }

    this.#instancia = new DataBase();
    // req.logger.debug("Conexión exitosa!!");
    return this.#instancia;
  }
}

module.exports = DataBase.getInstancia();
