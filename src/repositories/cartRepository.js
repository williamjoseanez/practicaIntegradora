const CartModel = require("../dao/mongoDb/modelsDB/cart.models.js");

class CartRepository {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      req.logger.debug("Error al crear el nuevo carrito de compra");
    }
  }
  ////////////////////////////////////////////////////////////////
  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        // req.logger.debug("No existe ese carrito con el id");
        return null;
      }
      return cart;
    } catch (error) {
      // console.error("Error al encontrar el carrito por ID:", error);
      throw error;
    }
  }
  // ///////////////////////////////////////////////////////////////////
  async aggProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existProduct = cart.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      //Vamos a marcar la propiedad "products" como modificada antes de guardar:
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }
  // ///////////////////////////////////////////////////////////////////
  // remueve un producto del carrito
  async deletProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }
  // /////////////////////////////////////////////////////////////////////
  // funcion para vaciar el carrito
  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = updatedProducts;
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      // console.error("Error al intentar actualizar el carrito", error);
      throw new Error("Error");
    }
  }
  ///////////////////////////////////////////////////////////////////////
  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productToUpdate = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productToUpdate !== -1) {
        // productToUpdate.quantity = quantity;
        cart.products[productToUpdate].quantity = newQuantity;

        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  async clearCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      // console.error("Error al limpiar el carrito", error);
      throw error;
    }
  }
}

module.exports = CartRepository;
