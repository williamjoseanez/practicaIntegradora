const CartService = require("../../services/cartsService.js");
const cartService = new CartService();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.json(newCart);
    } catch (error) {
      console.error("Error al crear un nuevo carrito", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async findById(req, res) {
    const cartId = req.params.cid;

    try {
      const cart = await cartService.findById(cartId);

      if (!carrito) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(cart.products);
    } catch (error) {
      console.error("Error al querer obtener el Carrito", error);
      res.status(500).json({ error: "Error del Servidor" });
    }
  }

  //3

  // aqui iba cartManager
  async aggProductCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const updateCart = await cartService.aggProductCart(
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
  }

  // 4
  // Agrego endpoint para eliminar un producto del carrito
  // aqui iba cartManager
  async removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
      const updatedCart = await cartService.removeProductFromCart(
        cartId,
        productId
      );
      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
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
      const updatedCart = await cartService.updateCart(cartId, updatedProducts);
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al intentar actualizar el carrito", error);
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
      const updatedCart = await cartService.updateProductQuantity(
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
  }
  // 7
  // // Agrego endpoint para eliminar todos los productos del carrito
  // aqui iba cartManager
  async clearCart(req, res) {
    try {
      const cartId = req.params.cid;

      const updatedCart = await cartService.clearCart(cartId);

      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error(
        "Error al intentar eliminar todos los productos del carrito",
        error
      );
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  // ///////////////////////////ruta estaba en el views.router para controlar
  async cartsCid(req, res) {
    const cartId = req.params.cid;

    try {
      const cart = await cartService.getCartById(cartId);

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
  }
}

module.exports = CartController;
