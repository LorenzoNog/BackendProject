import { Router } from "express";
import productsController from '../controllers/products.controller.js'
import { checkAuth,checkRoleAuth } from "../middlewares/auth.js";

const productsRouter = Router()

productsRouter.get('/', productsController.getProducts)
productsRouter.get('/:pid', productsController.getProductById)
productsRouter.post('/',checkAuth, checkRoleAuth(["Admin", "Premium"]), productsController.createProduct)
productsRouter.delete('/:pid', productsController.deleteById)
productsRouter.put('/:pid', productsController.updateProduct)

export default productsRouter