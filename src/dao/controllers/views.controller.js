const ImagenModel = require("../mongoDb/modelsDB/image.models");
const ProductRepository = require("../../repositories/productRepository.js");
const productRepository = new ProductRepository();
const path = require("path");
const CartModel = require("../mongoDb/modelsDB/cart.models.js");
const fs = require("fs").promises;
const ProductModel = require("../mongoDb/modelsDB/products.model.js");
const CartRepository = require("../../repositories/cartRepository.js");
const cartRepository = new CartRepository();
const TicketRepository = require("../../repositories/ticketRepository.js");
const ticketRepository = new TicketRepository();
const UserModel = require("../mongoDb/modelsDB/user.model.js");

class ViewsControllers {
  async products(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const products = await ProductModel.find().skip(skip).limit(limit);
      const totalProducts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const nuevoArray = products.map((product) => {
        const { ...rest } = product.toObject();
        return { ...rest }; // Agregar el ID al objeto
      });

      let cartId = null;
      if (req.user && req.user.cart) {
        cartId = req.user.cart.toString();
      }

      res.render("products", {
        products: nuevoArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  // /////////////////////////////////////////////////
  async Cart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);

      if (!cart) {
        // req.logger.debug("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalPurchase = 0;

      const productInTheCart = cart.products.map((item) => {
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
      // console.error("Error al obtener el carrito", error);
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
      // console.error("Error al subir la imagen:", error);
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
      // Imprimir el objeto product en la consola del servidor para verificar su estructura
      req.logger.debug("Producto encontrado:", product);

      // Renderizo la plantilla de detalles del producto y paso los datos del producto
      res.render("detail", { product });
    } catch (error) {
      // Manejo cualquier error que ocurra durante la búsqueda del producto
      // console.error("Error al obtener los detalles del producto:", error);
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

  // //Perfil
  // async profile(req, res) {
  //   if (!req.session.login) {
  //     return res.redirect("/login");
  //   }
  //   res.render("profile", { user: req.session.user });
  // }

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

  async Purchase(req, res) {
    try {
      const cart = await cartRepository.getCartById(req.params.cid);
      const ticket = await ticketRepository.getTicketById(req.params.tid);
      const purchaser = await UserModel.findById(ticket.purchaser);
      const products = cart.products;
      const cartInfo = "Sin Stock, favor intentarlo mas tarde!!!";
      const title = "Compra Finalizada";
      const hasTicket = true;

      res.render("carts", {
        products,
        cart,
        ticket,
        title,
        cartInfo,
        purchaser,
        hasTicket,
      });
    } catch (error) {
      console.error("Error al finalizar compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = ViewsControllers;
