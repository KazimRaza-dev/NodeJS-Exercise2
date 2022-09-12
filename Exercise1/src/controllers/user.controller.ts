import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import { userService } from "../services/index.services";

const userController = {
    registerUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userToRegister = _.pick(req.body, ['email', 'password', 'fname', 'lname']);
            const result = await userService.registerNewUser(userToRegister);
            if (result.status === false) {
                return res.status(400).send("Email already Exist.")
            }
            const token = result.userFromDb.generateAuthToken();
            res.header('x-auth-token', token).status(200).send({
                "Account details": result.userFromDb,
                "Assigned Tasks": result.assignedTasks
            });
        }
        catch (error) {
            next(error);
        }
    },
    loginUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = _.pick(req.body, ["email", "password"]);
            const loginResult = await userService.loginUserBll(user);
            if (loginResult.status === false) {
                return res.status(400).send("Invalid Email or password")
            }
            const token = loginResult.userFromDb.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": "successfully login",
                "User": loginResult.userFromDb,
            })
        }
        catch (error) {
            next(error);
        }
    }
}
export default userController;

