const express = require("express");
const router = express.Router();
const CartManager = require("../dao/mongoDb/controllsDB/cart-manager-db");
const cartManager = new CartManager();
const CartModel = require("../dao/mongoDb/controllsDB/cart-manager-db");

// 1
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// 2
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId)
            
    if (!carrito) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    console.error("Error al querer obtener el Carrito", error);
    res.status(500).json({ error: "Error del Servidor" });
  }
});

//3
router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.aggProductCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error(
      "Error al intentar agregar un producto al carrito de compras",
      error
    );
    res.status(500).json({ error: "Error del servidor" });
  }
});

// 4
// Agrego endpoint para eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const updatedCart = await cartManager.removeProductFromCart(
      cartId,
      productId
    );
    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito correctamente',
      updatedCart,
    });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }
});
// 5
// Agrego endpoint para actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts  = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart.products);
  } catch (error) {
    console.error("Error al intentar actualizar el carrito", error);
    res.status(500).json({ error: "Error del servidor al hacer put" });
  }
});
// 6
// // Agrego endpoint para actualizar la cantidad de ejemplares de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;

  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    res.json(updatedCart.products);
  } catch (error) {
    console.error(
      "Error al intentar actualizar la cantidad de ejemplares de un producto en el carrito",
      error
    );
    res.status(500).json({ error: "Error del servidor" });
  }
});
// 7
// // Agrego endpoint para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
  const cartId = req.params.cid;

  const updatedCart = await cartManager.clearCart(cartId);


  res.json({
    status: 'success',
    message: 'Todos los productos del carrito fueron eliminados correctamente',
    updatedCart,
});
  } catch (error) {
    console.error(
      "Error al intentar eliminar todos los productos del carrito",
      error
    );
    res.status(500).json({ error: "Error del servidor" });
  }
});
module.exports = router;
