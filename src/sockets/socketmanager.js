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
      // req.logger.debug("Un cliente se conectó");

      socket.emit("products", await productRepository.getProducts());

      //      //Recibo el evento "eliminarProducto"
      socket.on("deletproduct", async (id) => {
        await productRepository.deletproduct(id);
        io.sockets.emit("products", productRepository.getProducts());
        // this.emitUpdatedProducts(socket); si hay error colocar esta linea y comentar la anterior
      });

      //Recibo el evento "agregarProducto"
      socket.on("aggProduct", async (product) => {
        await productRepository.aggProduct(product);
        this.emitUpdatedProducts(socket);
      });

      // const productList = await productRepository.getProducts();
      // if (Array.isArray(productList) && productList.length > 0) {
      //   socket.emit("products", productList);
      // } else {
      //   req.logger.error("Invalid product data:", productList);
      // }
      const productList = await productRepository.getProducts();
      if (
        productList &&
        Array.isArray(productList.docs) &&
        productList.docs.length > 0
      ) {
        socket.emit("products", productList.docs);
      } else {
        req.logger.error("Datos de producto inválidos:", productList);
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
    socket.emit("products", await productRepository.getproduct());
  }
}

module.exports = SocketManager;
