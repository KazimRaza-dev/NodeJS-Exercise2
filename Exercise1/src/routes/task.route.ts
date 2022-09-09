import express, { Router } from "express";
import { taskController } from "../controllers/index.controller";
import { adminAuth, auth, validateTaskRequest, validateEditTaskRequest, validateChangeTask } from "../middlewares/index.middleware";
const taskRouter: Router = express();

taskRouter.post("/task/addtask", auth, validateTaskRequest, taskController.addTask);

taskRouter.put("/task/edittask/:id", auth, validateEditTaskRequest, taskController.editTask);

taskRouter.delete("/task/deletetask/:id", auth, taskController.deleteTask);

taskRouter.get("/task/getusertasks/:userId", auth, taskController.getUserTasks);

taskRouter.get("/task/getusertasks/:userId", auth, taskController.getUserTasks);

taskRouter.get("/task/getalltasks", adminAuth, taskController.getAllTasks);

taskRouter.put("/task/changestatus/:id", auth, validateChangeTask, taskController.changeTaskStatus);

taskRouter.get("/task/search", adminAuth, taskController.searchingTasks);

taskRouter.post("/task/import-bulk", auth, taskController.importTasksInBulk);

export default taskRouter;