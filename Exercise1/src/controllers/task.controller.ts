import { Request, Response } from "express";
import iTask from "../interfaces/task.interface";
import Task from "../models/task.model";
import Joi, { Schema } from "joi";
import * as _ from "lodash";

export interface userAuthRequest extends Request {
    user: any
}

export const addTask = async (req: userAuthRequest, res: Response) => {
    try {
        const taskSchema: Schema<iTask> = Joi.object({
            taskTitle: Joi.string().min(5).max(20).required(),
            description: Joi.string().min(5).max(100).required(),
            dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
        });
        const { error } = taskSchema.validate(req.body)
        if (error) {
            return res.status(401).send(error.details[0].message);
        }

        let newTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
        newTask.userId = req.user._id;
        newTask.assignBy = "self";
        const user: iTask = new Task(newTask);
        const result: iTask = await user.save();
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
        const taskExist = await Task.findById(taskId).select('userId');
        if (taskExist) {
            const userId: string = taskExist.userId.toString();
            if (tokenUserId !== userId) {
                return res.status(401).send("You cannot Edit other User's task.")
            }
        } else {
            return res.status(404).send(`Task with id ${taskId} does not exists.`);
        }
        const taskSchema: Schema<iTask> = Joi.object({
            taskTitle: Joi.string().min(5).max(20),
            description: Joi.string().min(5).max(100),
            dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/),
        });
        const { error } = taskSchema.validate(req.body)
        if (error) {
            return res.status(401).send(error.details[0].message);
        }

        let updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true
        });
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
        const taskExist = await Task.findById(taskId).select('userId');
        if (taskExist) {
            const userId: string = taskExist.userId.toString();
            if (tokenUserId !== userId) {
                return res.status(401).send("You cannot delete other User's tasks.")
            }
        } else {
            return res.status(404).send(`Task with id ${taskId} does not exists.`);
        }
        let taskDeleted: iTask = await Task.findByIdAndDelete(taskId);
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

        const userTasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy');
        if (userTasks.length > 0) {
            return res.status(200).send(userTasks);
        }
        res.status(200).send("No Tasks exist for this user.");
    }
    catch (error) {
        res.status(400).send(error);
    }
} 