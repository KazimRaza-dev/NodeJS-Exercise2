import Joi, { Schema } from "joi";
import { Request, Response } from "express";

const validateChangeRoleRequest = (req: Request, res: Response, next) => {
    const joiSchema: Schema = Joi.object({
        newRole: Joi.string().required().valid('member', 'admin'),
    })
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next()
}
export default validateChangeRoleRequest;