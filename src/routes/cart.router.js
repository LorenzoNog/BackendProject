import { Router } from "express";
import cartsController from '../controllers/carts.controller.js'

const cartRouter = Router()

cartRouter.get('/', cartsController.getCarts)
cartRouter.get('/:cid', cartsController.getCartById)
cartRouter.post('/', cartsController.createCart)
cartRouter.post('/:cid/product/:pid', cartsController.addProductToCart)
cartRouter.post('/:cid/purchase', cartsController.purchase)
cartRouter.put('/:cid/products/:pid', cartsController.updateQuantity)
cartRouter.delete('/:cid/products/:pid', cartsController.deleteProductInCart)
cartRouter.delete('/:cid', cartsController.emptyCartById)


export default cartRouter
