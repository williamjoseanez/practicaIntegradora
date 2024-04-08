const socket = require("socket.io");
const MessageModel = require("../dao/mongoDb/modelsDB/message.model");
const ProductService = require("../services/productService");
const productService = new ProductService();

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un cliente se conectó");

      socket.emit("products", await productService.getProducts());

      //      //Recibo el evento "eliminarProducto"
      socket.on("eliminarProducto", async (id) => {
        await productService.deletproduct(id);
        io.sockets.emit("products", productService.getProducts());
      });

      //Recibo el evento "agregarProducto"
      socket.on("agregarProducto", async (product) => {
        await productService.addProduct(product);
        io.sockets.emit("products", productService.getProducts());
      });

      const productList = await productService.getProducts();
      if (Array.isArray(productList) && productList.length > 0) {
        socket.emit("products", productList);
      } else {
        console.error("Invalid product data:", productList);
      }

      socket.emit("products", productList);
      //
      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit("productos", await productService.obtenerProductos());
  }
}

module.exports = SocketManager;
