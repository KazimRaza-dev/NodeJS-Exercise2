import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/user.controller";

userRouter.post("/register", userController.registerUser)
userRouter.post("/login", userController.loginUser)

export default userRouter;