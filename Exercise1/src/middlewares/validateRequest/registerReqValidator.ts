import Joi, { Schema } from "joi";
import { Request, Response } from "express";
import { iUser } from "../../interfaces/index.interfaces";

const validateRegisterRequest = (req: Request, res: Response, next) => {
    const userSchema: Schema<iUser> = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        role: Joi.string().required().valid('member', 'admin'),
    });
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateRegisterRequest;