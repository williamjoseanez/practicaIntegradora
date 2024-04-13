const ImagenModel = require("../mongoDb/modelsDB/image.models");
const ProductRepository = require("../../repositories/productRepository.js");
const productRepository = new ProductRepository();
const path = require("path");
const CartModel = require("../mongoDb/modelsDB/cart.models.js");
const fs = require("fs").promises;
const ProductModel = require("../mongoDb/modelsDB/products.model.js");

class ViewsControllers {
  async products(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const products = await productRepository.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
      
      });

         if (!products.docs) {
        console.log(
          "Error: No se encontraron documentos en los productos obtenidos"
        );
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      const cart = req.session.user.cart ? req.session.user.cart : false;

      const productsResult = products.docs.map((product) => {
        const { _id, ...rest } = product.toObject();
        return {
          ...rest,
          cart: cart,
          _id: _id + "",
        };
      });

      let cartunic;
      if (cart) {
        cartunic = await CartModel.findOne({ _id: req.session.user.cart });
      }
      res.render("products", {
        status: "success",
        products: productsResult,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        currentPage: products.page,
        totalPages: products.totalPages,
        user: req.session.user,
        cartLength: cart ? cartunic.products.length : false,
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos." });
    }
  }

  // /////////////////////////////////////////////////
  async Cart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getProductToCart(cartId);

      if (!cart) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalPurchase = 0;

      const productInTheCart = carrito.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;

        totalPurchase += totalPrice;

        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render("carts", {
        products: productInTheCart,
        totalPurchase,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

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
      const product = await ProductModel.findById(productId);

      if (!product) {
        // Si no se encuentra el producto, redirigir a una página de error o mostrar un mensaje
        res.status(404).send("Producto no encontrado");
        return;
      }

      // Renderizo la plantilla de detalles del producto y paso los datos del producto
      res.render("detail", { product });
    } catch (error) {
      // Manejo cualquier error que ocurra durante la búsqueda del producto
      console.error("Error al obtener los detalles del producto:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  
  //Login
  async login(req, res) {
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
    if (!req.session.login) {
      return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
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
