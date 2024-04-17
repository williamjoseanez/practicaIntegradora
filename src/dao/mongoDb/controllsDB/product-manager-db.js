const ProductsModel = require("../modelsDB/products.model");

class ProductManager {
  async addProduct({
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
      // validamos cada campo

      if (!title || !description || !price || !code || !stock || !category) {
        // req.logger.debug("Todos los campos son obligatorios");
        return;
      }
      // validamos codigo unico

      const existingProduct = await ProductsModel.findOne({ code: code });
      if (existingProduct) {
        // req.logger.debug("El código debe ser único, ya está siendo utilizado");
        return;
      }

      // aqui creamos el nuevo objeto con todos los datos que me piden

      const newProduct = new ProductsModel({
        // id: this.getNextProductId(),
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
      // req.logger.debug("error al agregar el producto", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
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

      const productos = await ProductsModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductsModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
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
        // req.logger.debug(`No se ha encontrado el producto con ID "${id}"`);
        return null;
      }
      // req.logger.debug("producto Encontrado");
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, productActualizado) {
    try {
      const productUpdate = await ProductsModel.findByIdAndUpdate(
        id,
        productActualizado
      );

      if (!productUpdate) {
        // req.logger.debug("El producto no existe");
        return null;
      }

      // req.logger.debug("producto actializado con exito");
      return productUpdate;
    } catch (error) {
      throw error;
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
      return null;
    } catch (error) {
      // req.logger.debug("error al borrar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
