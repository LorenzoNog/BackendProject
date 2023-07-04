import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
const viewsRouter = Router()

viewsRouter.get('/', viewsController.login)
viewsRouter.get('/register', viewsController.register)
viewsRouter.get('/products', viewsController.products)
viewsRouter.get('/products/:prodId', viewsController.productDetail)
viewsRouter.get('/profile', viewsController.profile)
viewsRouter.get('/carts/:idCart', viewsController.cart)
viewsRouter.get('/errorLogin', viewsController.loginError)
viewsRouter.get('/errorRegister', viewsController.registerError)
viewsRouter.get('/reset-password', viewsController.resetPasswordMail)
viewsRouter.get('/new-password/:userId/:token', viewsController.createNewPassword)
viewsRouter.get('/create-product', viewsController.createProduct)
viewsRouter.get('/users-list', viewsController.getUsers)
viewsRouter.get('/checkout', viewsController.checkout)
viewsRouter.get("/error-delete-product", viewsController.errorDeleteProduct)

export default viewsRouter