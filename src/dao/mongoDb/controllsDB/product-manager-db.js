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
        console.log("Todos los campos son obligatorios");
        return;
      }
      // validamos codigo unico

      const existingProduct = await ProductsModel.findOne({ code: code });
      if (existingProduct) {
        console.log("El código debe ser único, ya está siendo utilizado");
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
      console.log("error al agregar el producto", error);
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
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductsModel.findById(id);

      if (!product) {
        console.log(`No se ha encontrado el producto con ID "${id}"`);
        return null;
      }
      console.log("producto Encontrado");
      return product;
    } catch (error) {
      console.log("Error al buscar el producto por ID");
    }
  }
  async updateProduct(id, productActualizado) {
    try {
      const productUpdate = await ProductsModel.findByIdAndUpdate(
        id,
        productActualizado
      );

      if (!productUpdate) {
        console.log("El producto no existe");
        return null;
      }

      console.log("producto actializado con exito");
      return productUpdate;
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }
  async deletproduct(id) {
    try {
      const productDelete = await ProductsModel.findByIdAndDelete(id);

      if (!productDelete) {
        console.log("No se ha podido eliminar el producto");
        return null;
      }
      console.log("Se ha eliminado correctamente el producto");
      return null;
    } catch (error) {
      console.log("error al borrar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
