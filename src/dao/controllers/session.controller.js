const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../../utils/hashBcrypt.js");

class SessionController {
  async login(req, res) {
    const { email, password } = req.body;

    // Verifico si las credenciales coinciden con el administrador
    if (email === "adminCoder@coder.com" && password === "12345") {
      // Si las credenciales son correctas para el administrador, configuro la sesión del usuario como administrador
      req.session.user = {
        first_name: "Admin",
        last_name: "Admin",
        email: email,
        role: "admin",
      };
      req.session.login = true;
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
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      };
      req.session.login = true;
      return res.redirect("/products"); // Redirecciono al usuario a la página de productos
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

  //////////current
  async current(req, res) {
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ status: "error", message: "sin sesion activa" });
    }
  }
}

module.exports = SessionController;
