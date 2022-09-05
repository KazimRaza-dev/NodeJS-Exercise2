import Joi, { Schema } from "joi";
import iUser from "../../interfaces/user.interface";
import { Request, Response } from "express";

const validateRegisterRequest = (req: Request, res: Response, next) => {
    const userSchema: Schema<iUser> = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        fname: Joi.string().required(),
        lname: Joi.string().required(),
    });
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
export default validateRegisterRequest;