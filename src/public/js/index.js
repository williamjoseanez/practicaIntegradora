
const socket = io();

socket.on("products", (data) => {
  if (Array.isArray(data) && data.length > 0) {
    renderProductos(data);
  } else {
    console.error("Received data is not a valid array:", data);
  }
});

const renderProductos = (products) => {
  console.log('Received data:', products);
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="Imagen de ${product.title}">
      <p>Id ${product.id} </p>
      <p>Producto ${product.title}</p>
      <p>Precio $ ${product.price}</p>
      <button onclick="confirmarEliminarProducto('${product.id}')">Eliminar Producto</button>`;

    contenedorProductos.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(product.id);
    });
  });
};


const eliminarProducto =  (id) => {

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminarlo",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Si se confirma, elimino el producto
      socket.emit("eliminarProducto", id);
    }
  });


  // console.log('Eliminando producto con id:', id);
  
};

socket.on("eliminarProducto", (id) => {
  // Aquí elimino el producto del lado del cliente
  const remainingProducts = products.filter((product) => product.id !== id);
  renderProductos(remainingProducts);
});

/////////////////////////////Desde aqui esta el codigo para el formulario//////////////

document.getElementById("btnEnviar").addEventListener("click", () => {
  // Obtengo los valores de los campos
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let thumbnail = document.getElementById("thumbnail").value;
  let price = document.getElementById("price").value;
  let code = document.getElementById("code").value;
  let stock = document.getElementById("stock").value;
  let category = document.getElementById("category").value;

  // Verifico si los campos requeridos están vacíos
  if (
    title === "" ||
    description === "" ||
    thumbnail === "" ||
    price === "" ||
    code === "" ||
    stock === "" ||
    category === ""
  ) {
    alert(
      "Todos los campos marcados como obligatorios (*) deben ser completados."
    );
  } else {
    // Validaciones adicionales (agrego más según mis necesidades)
    if (isNaN(Number(price)) || isNaN(Number(stock))) {
      alert("El precio y el stock deben ser números válidos.");
      return; // Detiene la ejecución si hay errores de validación
    }

    // Aquí llamo a mi función para agregar el producto
    agregarProducto();

    // Muestro mensaje de éxito con SweetAlert
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Tu producto ha sido agregado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  }
});

// Función para agregar un producto
const agregarProducto = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("agregarProducto", product);

  // Después de enviar el producto, limpio los campos del formulario
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "Sin Imagen";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
};
