import Joi, { Schema } from "joi";
import { Request, Response } from "express";

const validateLoginRequest = (req: Request, res: Response, next) => {
    const joiSchema: Schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next()
}
export default validateLoginRequest;