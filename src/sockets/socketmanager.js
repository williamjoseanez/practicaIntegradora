const socket = require("socket.io");
const MessageModel = require("../dao/mongoDb/modelsDB/message.model");
const ProductRepository = require("../repositories/productRepository");
const productRepository = new ProductRepository();


class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un cliente se conectó");

      socket.emit("products", await productRepository.getProducts());

      //      //Recibo el evento "eliminarProducto"
      socket.on("deletproduct", async (id) => {
        await productRepository.deletproduct(id);
        io.sockets.emit("products", productRepository.getProducts());
        // this.emitUpdatedProducts(socket); si hay error colocar esta linea y comentar la anterior

      });

      //Recibo el evento "agregarProducto"
      socket.on("addProduct", async (product) => {
        await productRepository.addProduct(product);
        this.emitUpdatedProducts(socket);
      });

      const productList = await productRepository.getProducts();
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
    socket.emit("productos", await productRepository.obtenerProductos());
  }
}

module.exports = SocketManager;
