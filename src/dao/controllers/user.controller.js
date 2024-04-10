// const UserModel = require("../../dao/mongoDb/modelsDB/user.model.js");
// const CartModel = require("../../dao/mongoDb/modelsDB/cart.models.js");
// const jwt = require("jsonwebtoken");
// const { createHash, isValidPassword } = require("../../utils/hashBcrypt.js");
// const UserDTO = require("../../dto/user.dto.js");

class UserController {
  async passportRegister(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales Invalidas" });
    res.redirect("/login");
  }

  async failedregister(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales invalidas" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,
    };

    req.session.login = true;

    res.redirect("/profile");
  }

  async registeFailed(req, res) {
    res.send({ error: "Registro fallido" });
  }
}

// Instancia la clase UserController y exporta una instancia
module.exports = UserController;
