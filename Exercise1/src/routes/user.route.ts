import express, { Router } from "express";
const userRouter: Router = express.Router();
import * as userController from "../controllers/user.controller";
import validateRegisterReq from "../middlewares/validateRequest/registerReqValidator";
import validateLoginReq from "../middlewares/validateRequest/loginReqValidator";

userRouter.post("/register", validateRegisterReq, userController.registerUser)
userRouter.post("/login", validateLoginReq, userController.loginUser)

export default userRouter;