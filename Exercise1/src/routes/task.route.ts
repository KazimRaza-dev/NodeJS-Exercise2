import express, { Router } from "express";
const taskRouter: Router = express();
import { taskController } from "../controllers/index.controller";
import { authMiddleware, validateTaskRequest, validateEditTaskRequest, } from "../middlewares/index.middleware";

taskRouter.post("/task/addtask", authMiddleware, validateTaskRequest, taskController.addTask);

taskRouter.put("/task/edittask/:id", authMiddleware, validateEditTaskRequest, taskController.editTask);

taskRouter.delete("/task/deletetask/:id", authMiddleware, taskController.deleteTask);

taskRouter.get("/task/getusertasks/:userId", authMiddleware, taskController.getUserTasks);

export default taskRouter;