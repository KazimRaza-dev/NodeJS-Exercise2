import Joi, { Schema } from "joi";
import { Request, Response } from "express";
import { iAssignTask } from "../../interfaces/index.interfaces";

const validateAssignTaskRequest = (req: Request, res: Response, next) => {
    const assignTaskSchema: Schema<iAssignTask> = Joi.object({
        taskTitle: Joi.string().min(5).max(20).required(),
        description: Joi.string().min(5).max(100).required(),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
        assignTo: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });
    const { error } = assignTaskSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateAssignTaskRequest;












