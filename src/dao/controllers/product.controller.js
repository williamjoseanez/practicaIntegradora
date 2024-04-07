const ProductModel = require("../mongoDb/modelsDB/products.model.js");
const answer = require("../../utils/reusable.js");
const ProductService = require("../../services/productService.js");
const products = new ProductService();

class ProductController {

  async getProducts(req, res) {
    try {
      // Parsear los parámetros de consulta
      const { limit = 10, page = 1, sort, query } = req.query;

      // Obtener la lista de productos
      const productList = await products.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      res.json({
        status: "success",
        payload: productList,
        totalPages: productList.totalPages,
        prevPage: productList.prevPage,
        nextPage: productList.nextPage,
        page: productList.page,
        hasPrevPage: productList.hasPrevPage,
        hasNextPage: productList.hasNextPage,
        prevLink: productList.hasPrevPage
          ? `/api/products?limit=${limit}&page=${productList.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: productList.hasNextPage
          ? `/api/products?limit=${limit}&page=${productList.nextPage}&sort=${sort}&query=${query}`
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

  async getProductById (req, res) {
    const id = req.params.pid;
    try {
      const buscar = await products.getProductById(id);
  
      if (!buscar) {
        return res.json({ error: "Producto no encontrado" });
      }
      res.json(buscar);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async addProduct (req, res) {
    const newProduct = req.body;
  
    try {
      await products.addProduct(newProduct);
      res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al agregar el producto" });
    }
  }


  async updateProduct(req, res) {
    const id = req.params.pid;
    const productoActualizado = req.body;
  
    try {
      await products.updateProduct(id, productoActualizado);
      res.json({ message: "Producto Actualizado Exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  }

  async deletproduct(req, res){
    const id = req.params.pid;
    try {
      await products.deletproduct(id);
      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el producto" });
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
