import express, { Router } from "express";
const userRouter: Router = express.Router();
import userController from "../controllers/user.controller";
import validateRegisterReq from "../middlewares/validateRequest/registerReqValidator";
import validateLoginReq from "../middlewares/validateRequest/loginReqValidator";
import adminAuth from "../middlewares/adminAuth";
import validateChangeRoleRequest from "../middlewares/validateRequest/changeUserRole"

userRouter.post("/user/register", adminAuth, validateRegisterReq, userController.registerUser)
userRouter.post("/user/login", validateLoginReq, userController.loginUser)
userRouter.get("/user/allusers", adminAuth, userController.getAllUsers)
userRouter.put("/user/change-role/:id", adminAuth, validateChangeRoleRequest, userController.changeUserRole)

export default userRouter;