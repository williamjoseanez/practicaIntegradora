// const ProductModel = require("../mongoDb/modelsDB/products.model.js");
// const answer = require("../../utils/reusable.js");
const ProductRepository = require("../../repositories/productRepository.js");
const productRepository = new ProductRepository();

class ProductController {
  async getProducts(req, res) {
    try {
      // Parsear los parámetros de consulta
      const { limit = 10, page = 1, sort, query } = req.query;

      // Obtener la lista de productos
      const products = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      res.json({
        status: "success",
        payload: products,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
          : null,
      });
    } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;

    try {
      await productRepository.addProduct(newProduct);
      res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al agregar el producto" });
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const product = await productRepository.getProductById(id);

      if (product) {
        res.json(product);
      } else {
        res
          .jstatus(44)
          .json({ error: "Producto no Encontrado, siga intentando" });
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productUpdate = req.body;

    try {
      await productRepository.updateProduct(id, productUpdate);
      res.json({ message: "Producto Actualizado Exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  }

  async deletproduct(req, res) {
    const id = req.params.pid;
    try {
      await productRepository.deletproduct(id);
      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el producto" });
    }
  }

  // async postProduct(req, res) {
  //   try {
  //     const newProduct = req.body;
  //     await ProductModel.create(newProduct);
  //     answer(res, 201, "Producto creado exitosamente");
  //   } catch (error) {
  //     answer(res, 500, "Error al obtener los productos");
  //   }
  // }
}

module.exports = ProductController;
