import { Request, Response } from "express";
import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import * as taskDal from "../dataAccessLayer/task.dal";

interface userAuthRequest extends Request {
    user: any
}
export const addTask = async (req: userAuthRequest, res: Response) => {
    try {
        let reqTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
        reqTask.userId = req.user._id;
        reqTask.assignBy = "self";
        const result: iTask = await taskDal.createNewTask(reqTask);
        res.status(200).json({
            "message": "New Task Added.",
            "Task details": result
        });
    }
    catch (error) {
        res.status(400).send(error)
    }
}

export const editTask = async (req: userAuthRequest, res: Response) => {
    try {
        const tokenUserId: string = req.user._id;
        const taskId: string = req.params.id;
        const isTaskExist: iTask = await taskDal.checkTaskExist(taskId);
        if (isTaskExist) {
            const userId: string = isTaskExist.userId.toString();
            if (tokenUserId !== userId) {
                return res.status(401).send("You cannot Edit other User's task.")
            }
        } else {
            return res.status(404).send(`Task with id ${taskId} does not exists.`);
        }

        const updatedTask: iTask = await taskDal.editUserTask(taskId, req.body);
        return res.status(200).send({
            message: "Task successfully Edited.",
            "Edited task": updatedTask
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
}

export const deleteTask = async (req: userAuthRequest, res: Response) => {
    try {
        const tokenUserId: string = req.user._id;
        const taskId: string = req.params.id;
        const isTaskExist: iTask = await taskDal.checkTaskExist(taskId);
        if (isTaskExist) {
            const userId: string = isTaskExist.userId.toString();
            if (tokenUserId !== userId) {
                return res.status(401).send("You cannot delete other User's tasks.")
            }
        } else {
            return res.status(404).send(`Task with id ${taskId} does not exists.`);
        }
        const taskDeleted: iTask = await taskDal.deleteUserTask(taskId);
        return res.status(200).send({
            message: "Task deleted",
            Task: taskDeleted
        })
    }
    catch (error) {
        res.status(400).send(error);
    }
}

export const getUserTasks = async (req: userAuthRequest, res: Response) => {
    try {
        const tokenUserId: string = req.user._id;
        const userId: string = req.params.userId;
        if (tokenUserId !== userId) {
            return res.status(400).send("You cannot view other User's tasks.")
        }
        const userTasks: iTask[] = await taskDal.getUserAllTasks(userId);
        if (userTasks.length > 0) {
            return res.status(200).send(userTasks);
        }
        res.status(200).send("No Tasks exist for this user.");
    }
    catch (error) {
        res.status(400).send(error);
    }
} 