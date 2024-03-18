const fs = require("fs").promises;

class ProductManager {
  // static ultId = 0;

  // creamos el constructor con array vacio
  constructor(path) {
    this.products = [];
    this.path = path;
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
    }
  }

  async addProduct(nuevoObjeto) {
    let {
      title,
      description,
      price,
      thumbnail = [],
      code,
      stock,
      status = true,
      category,
    } = nuevoObjeto;
    // validamos cada campo
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    // validamos codigo unico
    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico, lo estas repitiendo");
      return;
    }

    // aqui creamos el nuevo objeto con todos los datos que me piden

    const newProduct = {
      id: this.getNextProductId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };

    // agregamos al array de productos

    this.products.push(newProduct);
    // Guardamos el archivo con todos los productos
    await this.guardarArchivo(this.products);
  }

  getNextProductId() {
    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  async getProducts() {
    // console.log(this.products);
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const productoBuscado = arrayProductos.find(
        (producto) => producto.id === id
      );

      if (!productoBuscado) {
        console.log("No se encontro el producto");
        return null;
      } else {
        console.log("producto encontrado ");
        return productoBuscado;
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  // leemos un producto
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("error al leer un archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo:", error.message);
      throw error;
    }
  }

  // para actalizar productos
  async updateProduct(id, productAtualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1, productAtualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontro el elemento a actualizar");
      }
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }

  async deletproduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((p) => p.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontro el elemento a borrar");
      }
    } catch (error) {
      console.log("error al borrar el producto", error);
    }
  }

  async getProductsLimit(limit) {
    const arrayProductos = await this.leerArchivo();
    if (limit) {
      return arrayProductos.slice(0, limit);
    }
    return arrayProductos;
  }
}

module.exports = ProductManager;
