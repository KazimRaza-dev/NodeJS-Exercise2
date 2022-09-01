import { Request, Response } from "express";
import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import User from "../models/user.model";
import Joi, { Schema } from "joi";

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
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
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
            return res.status(200).json({
                "message": "successfully login",
                "result": result
            })
        }
        return res.status(400).send("Invalid Email or password")
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}