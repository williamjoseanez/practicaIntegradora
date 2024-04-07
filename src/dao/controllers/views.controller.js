const ImagenModel = require("../mongoDb/modelsDB/image.models");
const ProductService = require("../../services/productService.js");
const products = new ProductService();
const path = require("path");
const fs = require("fs").promises;
const ProductModel = require("../mongoDb/modelsDB/products.model.js");

class ViewsControllers {
  // POST - Agregar un nuevo producto
  async upload(req, res) {
    try {
      const imagen = new ImagenModel();
      imagen.title = req.body.title;
      imagen.description = req.body.description;
      imagen.filename = req.file.filename;
      imagen.path = "/uploads/" + req.file.filename; // Carpeta donde se guardan las imágenes

      // Guardar la imagen en la base de datos
      await imagen.save();

      // Redireccionar a home con mensaje de éxito
      res.redirect("upload");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      res.status(500).send("Error al subir la imagen");
    }
  }

  // delet imagen rutinng
  async delete(req, res) {
    const { id } = req.params;
    const imagen = await ImagenModel.findByIdAndDelete(id);
    await fs.unlink(path.resolve("./src/public" + imagen.path));
    res.redirect("/upload");
  }

  // Ruta para mostrar los detalles del producto
  async productsdetail(req, res) {
    try {
      const productId = req.params._id;
      // Buscar el producto en la base de datos por su ID
      const product = await products.findById(productId);

      if (!product) {
        // Si no se encuentra el producto, redirigir a una página de error o mostrar un mensaje
        res.status(404).send("Producto no encontrado");
        return;
      }

      // Renderizo la plantilla de detalles del producto y paso los datos del producto
      res.render("detalle", { product });
    } catch (error) {
      // Manejo cualquier error que ocurra durante la búsqueda del producto
      console.error("Error al obtener los detalles del producto:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async product(req, res) {
    try {
      const { page = 1, limit = 8 } = req.query;

      const productsList = await products.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
      });

      const productsResult = productsList.docs.map((product) => {
        const { _id, ...rest } = product.toObject();
        return rest;
      });

      res.render("products", {
        status: "success",
        products: productsResult,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        currentPage: productsList.page,
        totalPages: productsList.totalPages,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos." });
    }
  }

  //Login
  login(req, res) {
    if (req.session.login) {
      return res.redirect("/products");
    }
    res.render("login");
  }
  // Registro
  async register(req, res) {
    if (req.session.login) {
      return res.redirect("/profile");
    }
    res.render("register");
  }

  //Perfil
  async profile(req, res) {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ status: "error", message: "sin sesion activa" });
    }
    // Si hay una sesión activa, mostrar el perfil del usuario
    res.render("profile", { user: req.session.user });
  }

  // Ruta para la vista en tiempo real
  async realtimeproducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch {
      res.status(500).json({
        error: "error interno del servidor, siga participando",
      });
    }
  }

  // chat
  async chat(req, res) {
    res.render("chat");
  }

  // multer, fomulario de imagnes
  async multer(req, res) {
    res.render("multer");
  }
  // ///////////////////upload
  async upload(req, res) {
    const imagenes = await ImagenModel.find();
    const newArrayImagenes = imagenes.map((imagen) => {
      return {
        id: imagen._id,
        title: imagen.title,
        description: imagen.description,
        filename: imagen.filename,
        path: imagen.path,
      };
    });

    res.render("upload", { imagenes: newArrayImagenes });
  }
}

module.exports = ViewsControllers;
