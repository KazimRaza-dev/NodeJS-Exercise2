import Joi, { Schema } from "joi";
import { Request, Response } from "express";

interface taskStatus {
    status: string
}
const validateChangeTaskStatusReq = (req: Request, res: Response, next) => {
    const changeStatusSchema: Schema<taskStatus> = Joi.object({
        newStatus: Joi.string().required().valid('new', 'in progress', 'done'),
    });
    const { error } = changeStatusSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateChangeTaskStatusReq;







