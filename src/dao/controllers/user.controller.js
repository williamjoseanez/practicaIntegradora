const UserModel = require("../../dao/mongoDb/modelsDB/user.model.js");
const CartModel = require("../../dao/mongoDb/modelsDB/cart.models.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../../utils/hashBcrypt.js");
const UserDTO = require("../../dto/user.dto.js");

class UserController {
  async register(req, res) {
    if (!req.user)
    return res
      .status(400)
      .send({ status: 'error', message: 'Credenciales invalidas' });

  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart,
  };

  req.session.login = true;

  res.redirect('/profile');
}
   
  
  // async register(req, res) {
  //   const { first_name, last_name, email, password, age } = req.body;
  //   try {
  //     // Verificar si el usuario ya está registrado
  //     const existUser = await UserModel.findOne({ email });
  //     if (existUser) {
  //       return res
  //         .status(400)
  //         .send({ status: "error", message: "El usuario ya está registrado"});
  //     }

  //     // Si el usuario no está registrado, continuar con el proceso de registro
  //     //new cart:
  //     const newCart = new CartModel();
  //     await newCart.save();

  //     const newUser = new UserModel({
  //       first_name,
  //       last_name,
  //       email,
  //       cart: newCart._id,
  //       password: createHash(password),
  //       age,
  //     });

  //     await newUser.save();

  //     const token = jwt.sign({ user: newUser }, "coderhouse", {
  //       expiresIn: "12h",
  //     });

  //     res.cookie("coderCookieToken", token, {
  //       maxAge: 36000000,
  //       httpOnly: true,
  //     });

  //     res.redirect("/profile");
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Error interno del servidor");
  //   }
  // }

  async login(req, res) {
    const { email, password } = req.body;
    try {
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

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
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
