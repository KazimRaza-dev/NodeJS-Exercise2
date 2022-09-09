import { Request, Response } from "express";
import * as _ from "lodash";
import taskBLL from "../businessLogicLayer/task.bll";
import userBLL from "../businessLogicLayer/user.bll";
import iUser from "../interfaces/user.interface";

const userController = {
    registerUser: async (req: Request, res: Response) => {
        try {
            const userToRegister = _.pick(req.body, ['email', 'password', 'fname', 'lname', 'role']);
            const { failure, success } = await userBLL.registerNewUser(userToRegister);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message)
            }
            return res.status(200).send({
                "Account details": success.userFromDb,
                "Assigned Tasks": success.assignedTasks
            });
        }
        catch (error) {
            res.status(400).send(error)
        }
    },
    
    loginUser: async (req: Request, res: Response) => {
        try {
            const user = _.pick(req.body, ["email", "password", "role"]);
            const loginResult = await userBLL.loginUserBll(user);
            if (loginResult.status === false) {
                return res.status(400).send("Invalid Email, password or role")
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
    },

    getAllUsers: async (req: Request, res: Response) => {
        try {
            let { pageno, size } = req.query as any;
            const allUsers: iUser[] = await userBLL.getAllRegisterUsers(pageno, size);
            if (allUsers.length > 0) {
                return res.status(200).send(allUsers);
            }
            res.status(200).send("No Users Exists.");
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    changeUserRole: async (req: Request, res: Response) => {
        try {
            const newRole: string = req.body.newRole;
            const userId: string = req.params.id;
            const { failure, userUpdated } = await userBLL.changeUserRole(userId, newRole);
            if (failure) {
                return res.status(failure.statusCode).send({
                    message: failure.message,
                });
            }
            res.status(200).send({
                message: userUpdated.message,
                user: userUpdated.user
            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}
export default userController;

