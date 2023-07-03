const btnAddProductToCart = document.getElementById("addToCart");
const prodId = document.getElementById("prodId");
const userId = document.getElementById("userId");

btnAddProductToCart.addEventListener("click", async () => {
  const user = await fetch(`/users/${userId.innerText}`).then((res) =>
    res.json()
  );
  const prod = await fetch(`/api/products/${prodId.innerText}`).then((res) =>
    res.json()
  );
  const cart = user.user.cart;
  if (prod) {
    await fetch(`http://localhost:2022/api/carts/${cart}/product/${prod._id}`, {
      method: "POST",
    }).then((res) => {
      res.json();
      Toastify({
        text: "Producto agregado al carrito :)",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        style: {
          background: "cadetblue",
        },
      }).showToast();
    });
  } else {
    Toastify({
      text: "El producto no se encuentra disponible :(",
      duration: 2000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "red",
      },
    }).showToast();
  }
});



