import express, { Router } from "express";
const assignTaskRouter: Router = express.Router();
import * as assignTaskController from "../controllers/assignTask.controller";
import authMiddleware from "../middlewares/auth";
import validateTaskReq from "../middlewares/validateRequest/assignTaskValidator";

assignTaskRouter.post("/", authMiddleware, validateTaskReq, assignTaskController.assignNewTask)

export default assignTaskRouter;