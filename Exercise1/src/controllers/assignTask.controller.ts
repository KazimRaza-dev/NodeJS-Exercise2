import { Request, Response } from "express";
import iAssignTask from "../interfaces/assignTask.interface";
import iTask from "../interfaces/task.interface";
import Joi, { Schema } from "joi";
import User from "../models/user.model";
import AssignTask from "../models/assignTask.model";
import Task from "../models/task.model";
import * as _ from "lodash";
import nodemailer, { Transporter } from "nodemailer";

const loginUserEmail = "kazim@gmail.com";
const loginUserName = "Kazim Raza"

export const assignNewTask = async (req: Request, res: Response) => {
    const assignTaskSchema: Schema<iAssignTask> = Joi.object({
        taskTitle: Joi.string().min(5).max(20).required(),
        description: Joi.string().min(5).max(100).required(),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
        assignTo: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });

    const { error } = assignTaskSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
        const userExist = await User.findOne({ email: req.body.assignTo });
        if (userExist) {
            newAssignTask.userId = userExist._id;
            newAssignTask.assignBy = loginUserEmail;
            const newTaskObj: iTask = new Task(newAssignTask);
            const result: iTask = await newTaskObj.save();
            return res.status(200).json({
                "message": "New Task Assigned.",
                "Task details": result
            })
        }
        else {
            let transporter: Transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: "nodeexercise@gmail.com",
                    pass: "cvmcmvufwbyrhhid"
                }
            })

            const textToSent: string = loginUserName + " has assign you a task on NodeExercise website. Sign Up to view that Todo. You can register yourself at http://localhost:3001/user/register";

            var mailOptions = {
                from: 'nodeexercise@gmail.com',
                to: req.body.assignTo,
                subject: 'Node JS Exercise 1',
                text: textToSent,
            };

            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    res.status(400).send(error)
                } else {
                    newAssignTask.assignBy = loginUserEmail;
                    newAssignTask.assignTo = req.body.assignTo;

                    const assignTaskObj: iAssignTask = new AssignTask(newAssignTask);
                    const result: iAssignTask = await assignTaskObj.save();
                    return res.status(200).json({
                        "message": "Email send & New Task Assigned.",
                        "Assign Task details": result
                    })
                }
            });
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
}