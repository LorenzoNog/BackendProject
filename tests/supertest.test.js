import supertest from "supertest";
import { expect } from "chai";

const request = supertest("http://localhost:2022");

const cartId = "64a31b45a3494d0512c21308";
const productId = "649d7e73eced07c79945c20f";

describe("Rutas de carritos", function () {
  it("Testear metodo DELETE PRODUCT IN CART /carts", async function () {
    const response = await request.post("/api/carts/:cid/products/:pid").send(cartId, productId);
    expect(response).to.be.ok;
  });
  it("Testear metodo GET by id /carts", async function () {
    const response = await request.get("/api/carts/:cid").send(cartId);
    expect(response).to.be.ok;
  });
  it("Testear metodo ADD PRODUCT TO CART /carts", async function () {
    const response = await request.put("/api/carts/:cid/product/:pid").send(cartId, productId);
    expect(response).to.be.ok;
  });
});

const prodId = "649d7e73eced07c79945c20f"

describe("Rutas de productos ", function () {
  it("Testear metodo GET by id /products", async function () {
    const response = await request.get("/api/products/:pid").send(prodId);
    expect(response.statusCode).to.be.equal(200);
  });
  it("Testear metodo GET All /products", async function () {
    const response = await request.get("/api/products");
    expect(response.statusCode).to.be.equal(200);
  });
  it("Testear metodo UPDATE PRODUCT /products", async function () {
    const response = await request.put("/api/products/:pid").send(prodId)
    expect(response.statusCode).to.be.equal(200);
  });
});

const UserMock = {
  first_name: "Neymar",
  last_name: "Da Silva Santos Junior",
  email: "neymar@gmail.com",
  age: 31,
  password: "neymar",
  role: "Admin",
};

const userId = "64a31b46a3494d0512c2130b";

describe("Rutas de usuarios", function () {
  it("Testear metodo POST /users", async function () {
    const response = await request.post("/users/register").send(UserMock);
    expect(response).to.be.ok;
  });
  it("Testear metodo GET by id /users", async function () {
    const response = await request.get("/users/:uid").send(userId);
    expect(response).to.be.ok;
  });
  it("Testear metodo GET all users by id /users", async function () {
    const response = await request.delete("/users")
    expect(response).to.be.ok
  });
});
