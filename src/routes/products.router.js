const express = require("express");
const router = express.Router();
const ProductController = require("../dao/controllers/product.controller");
const productController = new ProductController();

// Método GET - Obtener productos con búsqueda, paginación y ordenamiento
router.get("/", productController.getProducts);

// Método GET - Obtener un producto por ID
router.get("/:pid", productController.getProductById);

// Método POST - Agregar un nuevo producto
router.post("/", productController.addProduct);

// Método PUT - Actualizar producto por ID
router.put("/:pid", productController.updateProduct);

// Método DELETE - Eliminar producto por ID
router.delete("/:pid", productController.deletproduct);

module.exports = router;
