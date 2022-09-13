import express, { Router } from "express";
import { userController } from "../controllers/index.controller";
import { validateRegisterRequest, validateLoginRequest, adminAuth, validateChangeRoleRequest } from "../middlewares/index.middleware";
const userRouter: Router = express.Router();

userRouter.post("/user/register", adminAuth, validateRegisterRequest, userController.register)
userRouter.post("/user/login", validateLoginRequest, userController.login)
userRouter.get("/user/allusers", adminAuth, userController.getAllUsers)
userRouter.put("/user/change-role/:id", adminAuth, validateChangeRoleRequest, userController.changeUserRole)

export default userRouter;