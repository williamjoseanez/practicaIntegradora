const express = require("express");
const router = express.Router();
const passport = require("passport"); // Importa Passport.js
const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
const products = new ProductManager();
const ImagenModel = require("../dao/mongoDb/modelsDB/image.models");
const path = require("path");
const ProductModel = require("../dao/mongoDb/modelsDB/products.model");
const fs = require("fs").promises;
const CartManager = require("../dao/mongoDb/controllsDB/cart-manager-db");
const cartManager = new CartManager();

// Configura Passport.js - Asegúrate de que passport esté correctamente configurado en tu aplicación
require("../config/passport.config")(passport);

// POST - Agregar un nuevo producto
router.post("/upload", async (req, res) => {
  try {
    const imagen = new ImagenModel();
    imagen.title = req.body.title;
    imagen.description = req.body.description;
    imagen.filename = req.file.filename;
    imagen.path = "/uploads/" + req.file.filename; // Carpeta donde se guardan las imágenes

    // Guardar la imagen en la base de datos
    await imagen.save();

    // Redireccionar a home con mensaje de éxito
    res.redirect("upload");
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).send("Error al subir la imagen");
  }
});

// delet imagen rutinng

router.get("/image/:id/delete", async (req, res) => {
  const { id } = req.params;
  const imagen = await ImagenModel.findByIdAndDelete(id);
  await fs.unlink(path.resolve("./src/public" + imagen.path));
  res.redirect("/upload");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;

    const productsList = await products.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const productsResult = productsList.docs.map((product) => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    // console.log(productsResult);
    res.render("products", {
      status: "success",
      products: productsResult,
      hasPrevPage: productsList.hasPrevPage,
      hasNextPage: productsList.hasNextPage,
      prevPage: productsList.prevPage,
      nextPage: productsList.nextPage,
      currentPage: productsList.page,
      totalPages: productsList.totalPages,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos." });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsInTheCart = cart.products.map((item) => ({
      product: item.product.toObject(),
      //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
      quantity: item.quantity,
    }));

    res.render("carts", { products: productsInTheCart });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para mostrar los detalles del producto
router.get("/productsdetail/:_id", async (req, res) => {
  try {
    const productId = req.params._id;
    // Buscar el producto en la base de datos por su ID
    const product = await ProductModel.findById(productId);

    if (!product) {
      // Si no se encuentra el producto, redirigir a una página de error o mostrar un mensaje
      res.status(404).send("Producto no encontrado");
      return;
    }

    // Renderizar la plantilla de detalles del producto y pasar los datos del producto
    res.render("detalle", { product });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la búsqueda del producto
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//Login
router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }
  res.render("login");
});

// Registro
router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

//Perfil
router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

// //////////current
// router.get("/current", async (req, res) => {
//   if (!req.user)
//     return res
//       .status(404)
//       .send({ status: "error", message: "sin sesion activa" });

//   res.json(req.user);
// });

// Ruta para obtener el usuario actualmente autenticado
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Si se llega a este punto, el usuario está autenticado y puedo acceder a req.user
    res.json(req.user);
  }
);

module.exports = router;
