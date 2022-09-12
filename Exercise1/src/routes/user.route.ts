import express, { Router } from "express";
const userRouter: Router = express.Router();
import { userController } from "../controllers/index.controller";
import { validateRegisterRequest, validateLoginRequest } from "../middlewares/index.middleware";

userRouter.post("/user/register", validateRegisterRequest, userController.registerUser)
userRouter.post("/user/login", validateLoginRequest, userController.loginUser)

export default userRouter;