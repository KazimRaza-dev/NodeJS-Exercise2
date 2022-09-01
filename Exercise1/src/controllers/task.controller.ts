import { Request, Response } from "express";
import iTask from "../interfaces/task.interface";
import Task from "../models/task.model";
import Joi, { Schema } from "joi";
import * as _ from "lodash";

const userId = "630efb256a050af50ce3bb28";
export const addTask = async (req: Request, res: Response) => {

    const taskSchema: Schema<iTask> = Joi.object({
        taskTitle: Joi.string().min(5).max(20).required(),
        description: Joi.string().min(5).max(100).required(),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
    });

    const { error } = taskSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newTask = _.pick(req.body, ['taskTitle', 'description',
            'dueDate']);
        // newTask.status = "active";
        newTask.userId = userId;
        newTask.assignBy = "self";
        const user: iTask = new Task(newTask);
        const result: iTask = await user.save();
        res.status(200).json({
            "message": "New Task Added.",
            "Task details": result
        });
    }
    catch (error) {
        // console.log(error);
        res.status(400).send(error)
    }
}

export const editTask = async (req: Request, res: Response) => {
    const taskSchema: Schema<iTask> = Joi.object({
        taskTitle: Joi.string().min(5).max(20),
        description: Joi.string().min(5).max(100),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/),
    });

    const { error } = taskSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        const taskId: string = req.params.id;
        let updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true
        });
        if (updatedTask) {
            return res.status(200).send({
                message: "Task successfully Edited.",
                "Edited task": updatedTask
            })
        }
        return res.status(200).send(`Task with id ${taskId} does not exists.`);
    }
    catch (error) {
        // console.log(error);
        res.status(400).send(error);
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const taskId: string = req.params.id;
        let taskDeleted: iTask = await Task.findByIdAndDelete(taskId);
        if (taskDeleted) {
            return res.status(200).send({
                message: "Task deleted",
                Task: taskDeleted
            })
        }
        return res.status(400).send(`Task with id ${taskId} does not exists.`);
    }
    catch (error) {
        // console.log(error);
        res.status(400).send(error);
    }
}

export const getUserTasks = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId;
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