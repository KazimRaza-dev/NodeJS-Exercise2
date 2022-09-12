import express, { Router } from "express";
const assignTaskRouter: Router = express.Router();
import { assignTaskController } from "../controllers/index.controller";
import { authMiddleware, validateAssignTaskRequest } from "../middlewares/index.middleware";

assignTaskRouter.post("/assignTask", authMiddleware, validateAssignTaskRequest, assignTaskController.assignNewTask)

export default assignTaskRouter;