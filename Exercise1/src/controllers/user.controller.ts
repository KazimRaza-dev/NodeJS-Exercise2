import { Request, Response } from "express";
import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import iAssignTask from "../interfaces/assignTask.interface";
import * as userDal from "../dataAccessLayer/user.dal";

export const registerUser = async (req: Request, res: Response) => {
    try {
        let userToRegister = _.pick(req.body, ['email', 'password', 'fname', 'lname']);
        const isUserAlreadyExist: iUser = await userDal.isUserAlreadyExists(userToRegister.email)
        if (isUserAlreadyExist) {
            return res.status(400).send("Email already Exist.")
        }
        const userFromDb: iUser = await userDal.createNewUser(userToRegister);
        const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(userFromDb, userToRegister.email);

        const token = userFromDb.generateAuthToken();
        res.header('x-auth-token', token).status(200).send({
            "Account details": userFromDb,
            "Assigned Tasks": assignedTasks
        });
    }
    catch (error) {
        res.status(400).send(error)
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const user = _.pick(req.body, ["email", "password"]);
        const userFromDb: iUser = await userDal.checkLoginCredientials(user.email, user.password);

        if (userFromDb) {
            const token = userFromDb.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": "successfully login",
                "User": userFromDb,
            })
        }
        return res.status(400).send("Invalid Email or password")
    }
    catch (error) {
        res.status(400).send(error)
    }
}