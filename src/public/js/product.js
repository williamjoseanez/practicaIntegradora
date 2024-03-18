// document.addEventListener("DOMContentLoaded", function () {
//   const categorySelect = document.getElementById("category-select");
//   const minPriceInput = document.getElementById("min-price");
//   const maxPriceInput = document.getElementById("max-price");
//   const applyFilterBtn = document.getElementById("apply-filter-btn");
//   const prevPageBtn = document.getElementById("prev-page-btn");
//   const nextPageBtn = document.getElementById("next-page-btn");

//   applyFilterBtn.addEventListener("click", function () {
//     const selectedCategory = categorySelect.value;
//     const minPrice = minPriceInput.value;
//     const maxPrice = maxPriceInput.value;
//     const currentPage = 1;
//     fetchProducts(selectedCategory, minPrice, maxPrice, currentPage);
//   });

//   prevPageBtn.addEventListener("click", function () {
//     const currentPage = parseInt(prevPageBtn.dataset.page);
//     const selectedCategory = categorySelect.value;
//     const minPrice = minPriceInput.value;
//     const maxPrice = maxPriceInput.value;
//     fetchProducts(selectedCategory, minPrice, maxPrice, currentPage);
//   });

//   nextPageBtn.addEventListener("click", function () {
//     const currentPage = parseInt(nextPageBtn.dataset.page);
//     const selectedCategory = categorySelect.value;
//     const minPrice = minPriceInput.value;
//     const maxPrice = maxPriceInput.value;
//     fetchProducts(selectedCategory, minPrice, maxPrice, currentPage);
//   });

//   function fetchProducts(category, minPrice, maxPrice, page) {
//     const url = `/api/products?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}`;
//     fetch(url)
//       .then((response) => response.json())
//       .then((products) => {
//         updateProductView(products);
//       })
//       .catch((error) => {
//         console.error("Error al obtener productos:", error);
//       });
//   }
// });

// function updateProductView(products) {
//     const productContainer = document.getElementById('product-container');
//     // Limpio el contenedor de productos antes de agregar nuevos productos
//     productContainer.innerHTML = '';
//     // Itero sobre los productos y agregarlos al contenedor
//     products.forEach(product => {
//         const productCard = document.createElement('div');
//         productCard.classList.add('card');
//         productCard.innerHTML = `
//             <p>ID: ${product._id}</p>
//             <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" />
//             <p>Title: ${product.title}</p>
//             <p>Description: ${product.description}</p>
//             <p>Price: $ ${product.price}</p>
//             <p>Category: ${product.category}</p>
//         `;
//         productContainer.appendChild(productCard);
//     });
