const ProductModel = require("../mongoDb/modelsDB/products.model");
const answer = require("../../utils/reusable");

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await ProductModel.find();
      answer(res, 200, products);
    } catch (error) {
      answer(res, 500, "Error al obtener los productos");
    }
  }

  async postProduct(req, res) {
    try {
      const newProduct = req.body;
      await ProductModel.create(newProduct);
      answer(res, 201, "Producto creado exitosamente");
    } catch (error) {
      answer(res, 500, "Error al obtener los productos");
    }
  }
}

module.exports = ProductController;
