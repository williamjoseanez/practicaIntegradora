const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;

    this.loadCarts();
  }
  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);

      if (this.carts.length > 0) {
          this.ultId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.log(`Error reading file: ${error}`);
      await this.saveCart();
    }
  }

  async saveCart() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    let newCart = { id: ++this.ultId, products: [] };

    this.carts.push(newCart);

    await this.saveCart();
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const cart = this.carts.find((e) => e.id === cartId);

      if (!cart) {
        throw new error(`No existe carrito  con ese ID ${cartId}`);
      }
      return cart;
    } catch {
      console.error("error al obtener el carrito por ID", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const existsProduct = cart.products.find((p) => p.product === productId);

    if (existsProduct) {
      existsProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await this.saveCart();
    return cart;
  }
}

module.exports = CartManager;
