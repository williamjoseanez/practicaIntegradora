const CartRepository = require("../../repositories/cartRepository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../../repositories/productRepository.js");
const productRepository = new ProductRepository();
const TicketModel = require("../mongoDb/modelsDB/ticket.model.js");
const UserModel = require("../mongoDb/modelsDB/user.model.js");
const {
  generateUniqueCode,
  calculateTotal,
} = require("../../utils/cartutils.js");

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      // req.logger.error("Error al crear un nuevo carrito", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async getProductTheCart(req, res) {
    const cartId = req.params.cid;

    try {
      let cart = await cartRepository.getProductToCart(cartId);

      if (!cart) {
        // req.logger.debug("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(cart.products);
    } catch (error) {
      // req.logger.error("Error al querer obtener el Carrito", error);
      res.status(500).json({ error: "Error del Servidor" });
    }
  }

  //3

  // aqui iba cartManager
  async aggProductInTheCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const updateCart = await cartRepository.aggProduct(
        cartId,
        productId,
        quantity
      );
      res.redirect(`/carts/${updateCart._id}`);
    } catch (error) {
      console
        .error
        // "Error al intentar agregar un producto al carrito de compras",
        // error
        ();
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  // 4
  // Agrego endpoint para eliminar un producto del carrito
  // aqui iba cartManager
  async removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
      const updatedCart = await cartRepository.deletProduct(cartId, productId);
      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      // req.logger.error("Error al eliminar el producto del carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  // 5
  // Agrego endpoint para actualizar el carrito con un arreglo de productos
  // aqui iba cartManager
  async updateCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
      const updatedCart = await cartRepository.updateCart(
        cartId,
        updatedProducts
      );
      res.json(updatedCart.products);
    } catch (error) {
      // req.logger.error("Error al intentar actualizar el carrito", error);
      res.status(500).json({ error: "Error del servidor al hacer put" });
    }
  }

  // 6
  // // Agrego endpoint para actualizar la cantidad de ejemplares de un producto en el carrito
  // aqui iba cartManager
  async updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
      const updatedCart = await cartRepository.updateProductQuantity(
        cartId,
        productId,
        newQuantity
      );
      res.json({
        status: "success",
        message: "Cantidad del producto actualizada correctamente",
        updatedCart,
      });
    } catch (error) {
      // req.logger.error(
      // "Error al intentar actualizar la cantidad de ejemplares de un producto en el carrito",
      // error
      // );
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  // 7
  // // Agrego endpoint para eliminar todos los productos del carrito
  // aqui iba cartManager
  async clearCart(req, res) {
    try {
      const cartId = req.params.cid;

      const updatedCart = await cartRepository.clearCart(cartId);

      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados correctamente",
        updatedCart,
      });
    } catch (error) {
      // req.logger.error(
      // "Error al intentar eliminar todos los productos del carrito",
      // error
      // );
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      // Obtener el carrito y sus productos
      const cart = await cartRepository.getCartById(cartId);
      const products = cart.products;

      // Inicializar un arreglo para almacenar los productos no disponibles
      const productsNotAvailable = [];

      // Verificar el stock y actualizar los productos disponibles
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductById(productId);
        if (product.stock >= item.quantity) {
          // Si hay suficiente stock, restar la cantidad del producto
          product.stock -= item.quantity;
          await product.save();
        } else {
          // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
          productsNotAvailable.push(productId);
        }
      }

      // const userWithCart = await UserModel.findOne({ cart: cartId });
      const userWithCart = req.user;

      // Crear un ticket con los datos de la compra
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calculateTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      // Eliminar del carrito los productos que sí se compraron
      cart.products = cart.products.filter((item) =>
        productsNotAvailable.some((productId) => productId.equals(item.product))
      );

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      res.status(200).json({ cartId: cart._id, ticketId: ticket._id });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
