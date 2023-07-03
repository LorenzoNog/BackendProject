import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { checkAuth,checkRoleAuth } from "../middlewares/auth.js";

const UsersRouter = Router()

UsersRouter.get('/', usersController.getUsers)
UsersRouter.get('/logout', usersController.logOut)
UsersRouter.get('/:uid', usersController.getById)
UsersRouter.post('/register', usersController.createUser)
UsersRouter.post('/login', usersController.loginUser)
UsersRouter.post('/reset-password', usersController.resetPassword)
UsersRouter.post('/new-password/:userId/:token', usersController.createNewPassword)
UsersRouter.post('/change-role/:uid',checkAuth,checkRoleAuth(["Admin"]), usersController.changeRole)
UsersRouter.put('/update-product/:uid', usersController.updateUser)
UsersRouter.delete('/:uid',checkAuth,checkRoleAuth(["Admin"]),usersController.deleteById)
UsersRouter.delete('/', usersController.deleteInactiveUsers)

export default UsersRouter