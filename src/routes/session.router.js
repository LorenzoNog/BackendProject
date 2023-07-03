import { Router } from "express";
import sessionController from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.get('/current', sessionController.getSession)

export default sessionRouter