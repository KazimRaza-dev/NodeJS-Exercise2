import express, { Router } from "express";
import { assignTaskController } from "../controllers/index.controller";
import { adminAuth, validateAssignTaskRequest } from "../middlewares/index.middleware";
const assignTaskRouter: Router = express.Router();

assignTaskRouter.post("/assignTask", adminAuth, validateAssignTaskRequest, assignTaskController.assignNewTask)

export default assignTaskRouter;