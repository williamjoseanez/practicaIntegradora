const UserModel = require("../../dao/mongoDb/modelsDB/user.model.js");
const CartModel = require("../../dao/mongoDb/modelsDB/cart.models.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../../utils/hashBcrypt.js");
const UserDTO = require("../../dto/user.dto.js");
require("dotenv").config();

class UserController {
  async register(req, res) {
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

    res.redirect("/api/users/profile");
  }
  // ////////////////////////////////////////////////////////////
  async login(req, res) {
    const { email, password } = req.body;
    try {
      // Verificar si las credenciales coinciden con el administrador
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        // Si las credenciales coinciden con el administrador, configurar la sesión del administrador
        const adminUser = {
          first_name: "admin",
          last_name: "admin",
          email: email,
          role: "admin",
          cart: false,
        };

        const token = jwt.sign({ user: adminUser }, "coderhouse", {
          expiresIn: "15h",
        });

        res.cookie("coderCookieToken", token, {
          maxAge: 360000000,
          httpOnly: true,
        });

        return res.redirect("/api/users/profile"); // Redirigir al perfil del administrador
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).send("Usuario no válido");
      }

      const isValid = isValidPassword(password, user);
      if (!isValid) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign({ user: user }, "coderhouse", {
        expiresIn: "15h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 360000000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
  // ////////////////////////////////////////////////////////
  //Perfil dto
  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
  }
  // //////////////////////////////////////////////////////////
  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }
  // //////////////////////////////////////////////////////
  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
  // //////////////////////////////////////////////////////////
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
  // ///////////////////////////////////////////////////////////
  async registeFailed(req, res) {
    res.send({ error: "Registro fallido" });
  }
}

// Instancia la clase UserController y exporta una instancia
module.exports = UserController;
