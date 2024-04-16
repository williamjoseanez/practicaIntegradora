// const ProductModel = require("../mongoDb/modelsDB/products.model.js");
// const answer = require("../../utils/reusable.js");
const ProductRepository = require("../../repositories/productRepository.js");
const productRepository = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const newProduct = req.body;

    try {
      await productRepository.aggProduct(newProduct);
      res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "Error al agregar el producto" });
    }
  }

  async getProducts(req, res) {
    try {
      // Parsear los parámetros de consulta
      const { limit = 8, page = 1, sort, query } = req.query;

      // Obtener la lista de productos
      const products = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      res.json({
        products,
        // status: "success",
        // payload: products,
        // totalPages: products.totalPages,
        // prevPage: products.prevPage,
        // nextPage: products.nextPage,
        // page: products.page,
        // hasPrevPage: products.hasPrevPage,
        // hasNextPage: products.hasNextPage,
        // prevLink: products.hasPrevPage
        //   ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        //   : null,
        // nextLink: products.hasNextPage
        //   ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        //   : null,
      });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const product = await productRepository.getProductById(id);

      if (!product) {
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.json(product);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productUpdate = req.body;

    try {
      await productRepository.updateProduct(id, productUpdate);
      res.json({ message: "Producto Actualizado Exitosamente" });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  }

  async deletproduct(req, res) {
    const id = req.params.pid;
    try {
      await productRepository.deletproduct(id);
      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "Error al eliminar el producto" });
    }
  }
}

module.exports = ProductController;
