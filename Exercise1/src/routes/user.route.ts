import express, { Router } from "express";
const userRouter: Router = express.Router();
import userController from "../controllers/user.controller";
import validateRegisterReq from "../middlewares/validateRequest/registerReqValidator";
import validateLoginReq from "../middlewares/validateRequest/loginReqValidator";

userRouter.post("/user/register", validateRegisterReq, userController.registerUser)
userRouter.post("/user/login", validateLoginReq, userController.loginUser)

export default userRouter;