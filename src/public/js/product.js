const btnAddProductToCart = document.getElementById("addToCart");
const btnDeleteProductToDb = document.getElementById("deleteProduct");
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

btnDeleteProductToDb.addEventListener("click", async () => {
  const user = await fetch(`/users/${userId.innerText}`).then((res) =>
    res.json()
  );
  const prod = await fetch(`/api/products/${prodId.innerText}`).then((res) =>
    res.json()
  );
  console.log(user)
  if (user.user.role === 'Admin') {
    await fetch(`http://localhost:2022/api/products/${prod._id}`, {
      method: "DELETE",
    }).then((res) => {
      res.json();
      Toastify({
        text: "Se ha eliminado un producto por un administrador.",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        style: {
          background: "red",
        },
      }).showToast();
    });
    window.location.replace(`http://localhost:2022/products`);
  }else{
    window.location.replace(`http://localhost:2022/error-delete-product`);
  }
});
