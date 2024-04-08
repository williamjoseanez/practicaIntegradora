const express = require("express");
const router = express.Router();
const ProductController = require("../dao/controllers/product.controller");
const productController = new ProductController();

// ruta GET - Obtener productos con búsqueda, paginación y ordenamiento
router.get("/", productController.getProducts);
// ruta GET - Obtener un producto por ID
router.get("/:pid", productController.getProductById);
// ruta POST - Agregar un nuevo producto
router.post("/", productController.addProduct);
// ruta PUT - Actualizar producto por ID
router.put("/:pid", productController.updateProduct);
// ruta DELETE - Eliminar producto por ID
router.delete("/:pid", productController.deletproduct);

module.exports = router;
