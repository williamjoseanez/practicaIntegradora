const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
const products = new ProductManager();

// Método GET - Obtener productos con búsqueda, paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    // Parsear los parámetros de consulta
    const { limit = 10, page = 1, sort, query} = req.query;

   
    // Obtener la lista de productos
    const productList = await products.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
  });
  res.json({
    status: 'success',
    payload: productList,
    totalPages: productList.totalPages,
    prevPage: productList.prevPage,
    nextPage: productList.nextPage,
    page: productList.page,
    hasPrevPage: productList.hasPrevPage,
    hasNextPage: productList.hasNextPage,
    prevLink: productList.hasPrevPage ? `/api/products?limit=${limit}&page=${productList.prevPage}&sort=${sort}&query=${query}` : null,
    nextLink: productList.hasNextPage ? `/api/products?limit=${limit}&page=${productList.nextPage}&sort=${sort}&query=${query}` : null,
});

} catch (error) {
  console.error("Error al obtener productos", error);
  res.status(500).json({
      status: 'error',
      error: "Error interno del servidor"
  });
}
});
   
// Método GET - Obtener un producto por ID
router.get("/:pid", async (req, res) => {
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
});

// Método POST - Agregar un nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
   
    await products.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

// Método PUT - Actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await products.updateProduct(id, productoActualizado);
    res.json({ message: "Producto Actualizado Exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

// Método DELETE - Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    await products.deletproduct(id);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;
