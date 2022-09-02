import { Request, Response } from "express";
import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import User from "../models/user.model";
import iAssignTask from "../interfaces/assignTask.interface";
import AssignTask from "../models/assignTask.model";
import Task from "../models/task.model";
import iTask from "../interfaces/task.interface";
import Joi, { Schema } from "joi";
import { Types } from "mongoose";

export const registerUser = async (req: Request, res: Response) => {
    const userSchema: Schema<iUser> = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        fname: Joi.string().required(),
        lname: Joi.string().required(),
    });
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newUser = _.pick(req.body, ['email', 'password',
            'fname', 'lname']);
        const alreadyExist: iUser = await User.findOne({ email: newUser.email });
        if (alreadyExist) {
            return res.status(400).send("Email already Exist.")
        }

        const user: iUser = new User(newUser);
        const result: iUser = await user.save();
        const userId: Types.ObjectId = result._id;
        const assignedTasks: iAssignTask[] = await AssignTask.find({ assignTo: newUser.email });
        assignedTasks.map(async (task) => {
            let newTask = _.pick(task, ['taskTitle', 'description', 'dueDate', 'assignBy']);
            newTask.userId = userId;
            const user: iTask = new Task(newTask);
            await user.save();
        });
        await AssignTask.deleteMany({ assignTo: newUser.email })

        const token = result.generateAuthToken();
        res.header('x-auth-token', token).status(200).send({
            "Account details": result,
            "Assigned Tasks": assignedTasks
        });
    }
    catch (error) {
        res.status(400).send(error)
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const joiSchema: Schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        const user = _.pick(req.body, ["email", "password"])
        const result: iUser = await User.findOne({ email: user.email, password: user.password });

        if (result) {
            const token = result.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": "successfully login",
                "result": result,
            })
        }
        return res.status(400).send("Invalid Email or password")
    }
    catch (error) {
        res.status(400).send(error)
    }
}