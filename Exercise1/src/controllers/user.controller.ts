import { Request, Response } from "express";
import * as _ from "lodash";
import { userService } from "../services/index.services";
import { iUser } from "../interfaces/index.interfaces";

const userController = {
    register: async (req: Request, res: Response) => {
        try {
            const userToRegister = _.pick(req.body, ['email', 'password', 'fname', 'lname', 'role']);
            const { failure, success } = await userService.registerUser(userToRegister);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message)
            }
            return res.status(200).send({
                "Account details": success.userFromDb,
                "Assigned Tasks": success.assignedTasks
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const user = _.pick(req.body, ["email", "password", "role"]);
            const loginResult = await userService.loginUser(user);
            if (loginResult.status === false) {
                return res.status(401).send("Invalid Email, password or role")
            }
            const token = loginResult.user.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": "successfully login",
                "User": loginResult.user,
            })
        }
        catch (error) {
            res.status(400).send(error)
        }
    },

    getAllUsers: async (req: Request, res: Response) => {
        try {
            let { pageno, size } = req.query as any;
            const users: iUser[] = await userService.getAllUsers(pageno, size);
            if (users.length > 0) {
                return res.status(200).send(users);
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
            const { failure, userUpdated } = await userService.changeUserRole(userId, newRole);
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

