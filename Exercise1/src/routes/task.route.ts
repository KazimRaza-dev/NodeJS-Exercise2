import * as taskController from "../controllers/task.controller"
import express, { Router } from "express";
const taskRouter: Router = express();

taskRouter.post("/addtask", taskController.addTask);

taskRouter.put("/edittask/:id", taskController.editTask);

taskRouter.delete("/deletetask/:id", taskController.deleteTask);

taskRouter.get("/getusertasks/:userId", taskController.getUserTasks);

export default taskRouter;