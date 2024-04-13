const express = require("express");
const router = express.Router();
const CartController = require("../dao/controllers/cart.controllers.js");
const cartController = new CartController();

// 1
router.post("/", cartController.createCart);
// 2
router.get("/:cid", cartController.getProductTheCart);
//3
router.post("/:cid/products/:pid", cartController.aggProductInTheCart);
// 4// Agrego endpoint para eliminar un producto del carrito
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);
// 5// Agrego endpoint para actualizar el carrito con un arreglo de productos
router.put("/:cid", cartController.updateCart);
// 6// // Agrego endpoint para actualizar la cantidad de ejemplares de un producto en el carrito
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
// 7// // Agrego endpoint para eliminar todos los productos del carrito
router.delete("/:cid", cartController.clearCart);


module.exports = router;
