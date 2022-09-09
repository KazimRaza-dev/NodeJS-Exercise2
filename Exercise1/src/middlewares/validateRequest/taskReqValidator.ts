import Joi, { Schema } from "joi";
import { Request, Response } from "express";
import { iTask } from "../../interfaces/index.interfaces";

const validateTaskRequest = (req: Request, res: Response, next) => {
    const taskSchema: Schema<iTask> = Joi.object({
        taskTitle: Joi.string().min(5).max(20).required(),
        description: Joi.string().min(5).max(100).required(),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
    });
    const { error } = taskSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateTaskRequest;







