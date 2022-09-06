import express, { Router } from "express";
const assignTaskRouter: Router = express.Router();
import assignTaskController from "../controllers/assignTask.controller";
import adminAuth from "../middlewares/adminAuth";
import validateTaskReq from "../middlewares/validateRequest/assignTaskValidator";

assignTaskRouter.post("/assignTask", adminAuth, validateTaskReq, assignTaskController.assignNewTask)

export default assignTaskRouter;