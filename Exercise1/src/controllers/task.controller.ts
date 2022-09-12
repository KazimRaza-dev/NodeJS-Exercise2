import { Request, Response } from "express";
import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import { taskService } from "../services/index.services"; ''

interface userAuthRequest extends Request {
    user: any
}
const taskController = {
    addTask: async (req: userAuthRequest, res: Response) => {
        try {
            const reqTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
            reqTask.userId = req.user._id;
            reqTask.assignBy = "self";

            const result: iTask = await taskService.addNewTaskBll(reqTask);
            res.status(200).json({
                "message": "New Task Added.",
                "Task details": result
            });
        }
        catch (error) {
            res.status(400).send(error)
        }
    },

    editTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const isTaskExist = await taskService.isTaskAlreadyExists(taskId, tokenUserId);
            if (isTaskExist.isError) {
                return res.status(isTaskExist.statusCode).send(isTaskExist.msg);
            }
            const updatedTask: iTask = await taskService.updateExistingTask(taskId, req.body);
            return res.status(200).send({
                message: "Task successfully Edited.",
                "Edited task": updatedTask
            });
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    deleteTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const isTaskExist = await taskService.isTaskAlreadyExists(taskId, tokenUserId);
            if (isTaskExist.isError) {
                return res.status(isTaskExist.statusCode).send(isTaskExist.msg);
            }

            const taskDeleted: iTask = await taskService.deleteTask(taskId);
            return res.status(200).send({
                message: "Task deleted",
                Task: taskDeleted
            })
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    getUserTasks: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const userId: string = req.params.userId;
            if (tokenUserId !== userId) {
                return res.status(400).send("You cannot view other User's tasks.")
            }
            const userTasks: iTask[] = await taskService.getAllAddedTasks(userId);
            if (userTasks.length > 0) {
                return res.status(200).send(userTasks);
            }
            res.status(200).send("No Tasks exist for this user.");
        }
        catch (error) {
            res.status(400).send(error);
        }
    }
}
export default taskController;

