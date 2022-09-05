import { Request, Response } from "express";
import * as _ from "lodash";
import userBLL from "../businessLogicLayer/user.bll";

const userController = {
    registerUser: async (req: Request, res: Response) => {
        try {
            let userToRegister = _.pick(req.body, ['email', 'password', 'fname', 'lname']);
            const result = await userBLL.registerNewUser(userToRegister);
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
            res.status(400).send(error)
        }
    },
    loginUser: async (req: Request, res: Response) => {
        try {
            const user = _.pick(req.body, ["email", "password"]);
            const loginResult = await userBLL.loginUserBll(user);
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
            res.status(400).send(error)
        }
    }
}
export default userController;

