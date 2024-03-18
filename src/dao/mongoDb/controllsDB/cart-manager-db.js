const CartModel = require("../modelsDB/cart.models");

class CartManager {
  async getAllCarts() {
    try {
      // Utilizo el método find() de Mongoose para obtener todos los carritos
      const allCarts = await CartModel.find();
      return allCarts;
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear el nuevo carrito de compra");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("No existe ese carrito con el id");
        return null;
      }

      return cart;
    } catch (error) {
      console.log("Error al traer el carrito, fijate bien lo que haces", error);
    }
  }

  async aggProductCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("error al agregar un producto", error);
    }
  }

  // remueve un producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const updatedProducts = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      cart.products = updatedProducts;

      // Marcar la propiedad "products" como modificada antes de guardar
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al intentar eliminar un producto del carrito",
        error
      );
      throw error;
    }
  }

  // funcion para vaciar el carrito
  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = updatedProducts;

      // Marcar la propiedad "products" como modificada antes de guardar
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al intentar actualizar el carrito", error);
      throw error;
    }
  }
  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productToUpdate = cart.products.find(
        (item) => item.product.toString() === productId
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
      console.error(
        "Error al actualizar la cantidad del producto en el carrito",
        error
      );
      throw error;
    }
  }

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
      console.error("Error al limpiar el carrito", error);
      throw error;
    }
  }
}

module.exports = CartManager;
