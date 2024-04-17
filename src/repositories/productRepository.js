const ProductsModel = require("../dao/mongoDb/modelsDB/products.model.js");

class ProductRepository {
  async aggProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      // Validar que todos los campos obligatorios estén presentes
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios");
      }

      // Verificar si ya existe un producto con el mismo código
      const existingProduct = await ProductsModel.findOne({ code: code });
      if (existingProduct) {
        throw new Error("El código debe ser único y ya está siendo utilizado");
      }

      // Crear el nuevo producto
      const newProduct = new ProductsModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        status: true,
        category,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      // console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async getProducts(limit = 8, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const products = await ProductsModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductsModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      // req.logger.debug("Error al obtener los productos", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductsModel.findById(id);

      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async updateProduct(id, productUpdated) {
    try {
      const Update = await ProductsModel.findByIdAndUpdate(id, productUpdated);

      if (!Update) {
        // req.logger.debug("El producto no existe");
        return null;
      }

      // req.logger.debug("producto actualizado con exito");
      return Update;
    } catch (error) {
      // req.logger.debug("error al actualizar el producto", error);
      throw new Error("Error");
    }
  }

  async deletproduct(id) {
    try {
      const productDelete = await ProductsModel.findByIdAndDelete(id);

      if (!productDelete) {
        // req.logger.debug("No se ha podido eliminar el producto");
        return null;
      }
      // req.logger.debug("Se ha eliminado correctamente el producto");
      return productDelete;
    } catch (error) {
      // req.logger.debug("error al borrar el producto", error);
      throw new Error("Error");
    }
  }
}

module.exports = ProductRepository;
