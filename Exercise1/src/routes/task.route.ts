import taskController from "../controllers/task.controller"
import express, { Router } from "express";
const taskRouter: Router = express();
import authMiddleware from "../middlewares/auth";
import validateTaskReq from "../middlewares/validateRequest/taskReqValidator";
import validateEditTaskReq from "../middlewares/validateRequest/editTaskValidator";
import validateChangeTask from "../middlewares/validateRequest/changeStatusReq";
import adminAuth from "../middlewares/adminAuth";

taskRouter.post("/task/addtask", authMiddleware, validateTaskReq, taskController.addTask);

taskRouter.put("/task/edittask/:id", authMiddleware, validateEditTaskReq, taskController.editTask);

taskRouter.delete("/task/deletetask/:id", authMiddleware, taskController.deleteTask);

taskRouter.get("/task/getusertasks/:userId", authMiddleware, taskController.getUserTasks);

taskRouter.get("/task/getusertasks/:userId", authMiddleware, taskController.getUserTasks);

taskRouter.get("/task/getalltasks", adminAuth, taskController.getAllTasks);

taskRouter.put("/task/changestatus/:id", authMiddleware, validateChangeTask, taskController.changeTaskStatus);

export default taskRouter;