import * as taskController from "../controllers/task.controller"
import express, { Router } from "express";
const taskRouter: Router = express();
import authMiddleware from "../middlewares/auth";

taskRouter.post("/addtask", authMiddleware, taskController.addTask);

taskRouter.put("/edittask/:id", authMiddleware, taskController.editTask);

taskRouter.delete("/deletetask/:id", authMiddleware, taskController.deleteTask);

taskRouter.get("/getusertasks/:userId", authMiddleware, taskController.getUserTasks);

export default taskRouter;