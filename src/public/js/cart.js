const btnEmptyCart = document.getElementById("emptyCart");
const userId = document.getElementById("userId");
const btnPurchase = document.getElementById("purchase");

btnEmptyCart.addEventListener("click", async () => {
  const user = await fetch(`/users/${userId.innerText}`).then((res) =>
    res.json()
  );
  const cart = user.user.cart;
  if (user) {
    await fetch(`http://localhost:2022/api/carts/${cart}`, {
      method: "DELETE",
    }).then((res) => {
      res.json();
      Toastify({
        text: "Carrito vaciado :(",
        duration: 1000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "red",
        },
      }).showToast();
      window.location.reload();
    });
  }
});

btnPurchase.addEventListener("click", async () => {
  const user = await fetch(`/users/${userId.innerText}`).then((res) =>
    res.json()
  );
  const cart = user.user.cart;

  await fetch(`/api/carts/${cart}/purchase`, {
    method: "POST",
  }).then((data) => {
    data.json();
    Toastify({
      text: "Tu ticket ha sido creado con exito :)",
      duration: 2000,
      gravity: "bottom",
      position: "center",
      style: {
        background: "cadetblue",
      },
    }).showToast();
    window.location.replace(`http://localhost:2022/checkout`);
  });
});
