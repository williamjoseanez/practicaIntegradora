const express = require("express");
const router = express.Router();
const passport = require("passport"); // Importa Passport.js
const ViewsControllers = require("../dao/controllers/views.controller.js");
const viewsController = new ViewsControllers();
const checkUserRole = require("../middleware/checckrole.js");

// Configura Passport.js - Asegúrate de que passport esté correctamente configurado en tu aplicación
require("../config/passport.config")(passport);

router.get("/carts/:cid", viewsController.Cart);
// POST - Agregar un nuevo producto
router.post("/upload", viewsController.upload);
// ///////////////////GET OBTENER PRODUCTOS
router.get("/upload", viewsController.upload);
// delet imagen rutinng
router.get("/image/:id/delete", viewsController.delete);
// Ruta para mostrar los detalles del producto
router.get("/productsdetail/:_id", viewsController.productsdetail);

router.get("/finishPurchase/:cid/ticket/:tid", viewsController.Purchase);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  viewsController.products
);
//Login
router.get("/login", viewsController.login);
// Registro
router.get("/register", viewsController.register);
//Perfil
// router.get("/profile", viewsController.profile);
// ///////////////////////////////// Ruta para la vista en tiempo real
router.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.realtimeproducts
);
// //////////////////////////// chat
router.get("/chat", checkUserRole(["user"]), viewsController.chat);
// ////////////////////// multer, fomulario de imagnes
router.get("/multer", viewsController.multer);

module.exports = router;
