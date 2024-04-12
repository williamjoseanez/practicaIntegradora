const UserModel = require("..//mongoDb/modelsDB/user.model.js");
const { isValidPassword } = require("../../utils/hashBcrypt.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class SessionController {
  async login(req, res) {
    
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Verifico si las credenciales coinciden con el administrador
    if (email === adminEmail && password === adminPassword) {
      // Si las credenciales son correctas para el administrador, configuro la sesión del usuario como administrador
      const usuario = {
        first_name: "admin",
        last_name: "admin",
        email: email,
        role: "admin",
        cart: false,
      };
      req.session.user = usuario;
      req.session.login = true;

      const token = jwt.sign({ user: usuario }, "coderhouse", {
        expiresIn: "12h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 36000000,
        httpOnly: true,
      });

      return res.redirect("/products"); // Redirecciono al administrador a la página de productos
    } else {
      // Busco al usuario en la base de datos
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        // Si el usuario no existe, enviar un mensaje de error
        return res
          .status(400)
          .send({ status: "error", message: "Usuario no encontrado" });
      }

      // Verifico si la contraseña es válida
      const isValid = isValidPassword(password, user);
      if (!isValid) {
        // Si la contraseña es inválida, envio un mensaje de error
        return res
          .status(400)
          .send({ status: "error", message: "Credenciales Inválidas" });
      }

      // Configuro la sesión del usuario y redirigir a la página de productos

      const usuario = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        cart: user.cart,
      };
      req.session.user = usuario;
      req.session.login = true;

      const token = jwt.sign({ user: usuario }, "coderhouse", {
        expiresIn: "12h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 36000000,
        httpOnly: true,
      });
      return res.redirect("/products"); // Redirecciono al usuario a la página de productos
    }
  }
  
 //////////current
 async current(req, res) {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ status: "error", message: "sin sesion activa" });
  }
}
  //Logout - GET
  async logout(req, res) {
    try {
      if (req.session.login) {
        req.session.destroy();
      }
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async faillogin(req, res) {
    res.json({ message: "fallo la estrategia" });
  }

 
}

module.exports = SessionController;
