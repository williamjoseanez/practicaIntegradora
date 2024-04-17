function deleteProduct(cartId, productId) {
  // alert("Deleting " + productId);

  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito");
      }
      location.reload();
    })
    .catch((error) => {
      req.logger.error("Error:", error);
    });
}

function deleteProduct(cartId, productId) {
  // alert(cartId + " - " + productId);
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito");
      }
      location.reload();
    })
    .catch((error) => {
      req.logger.error("Error:", error);
    });
}

function emptyCart(cartId) {
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al vaciar el carrito");
      }
      location.reload();
    })
    .catch((error) => {
      req.logger.error("Error:", error);
    });
}
function endPurchase(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al finalizar la compra");
      }
      location.reload();
    })
    .catch((error) => {
      req.logger.error("Error:", error);
    });
}
