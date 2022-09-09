import * as _ from "lodash";
import { iUser, iAssignTask } from "../interfaces/index.interfaces";
import { userDal } from "../dal/index.dal";
import { passwordHashing } from "../utils/index.utils";

interface iFailure {
    message: string
    statusCode: number
}
interface iSuccess {
    userFromDb: iUser
    assignedTasks: iAssignTask[]
}

const userService = {
    registerUser: async (userToRegister) => {
        try {
            const { isUserExists } = await userDal.isUserExists(userToRegister.email);
            if (isUserExists) {
                const failure: iFailure = {
                    message: "Email already Exists.",
                    statusCode: 200
                }
                return { failure };
            }
            // if (error) {
            //     const failure: iFailure = {
            //         message: error,
            //         statusCode: 400
            //     }
            //     return { failure };
            // }
            userToRegister.password = await passwordHashing.hashPassword(userToRegister.password);
            const { err, user } = await userDal.create(userToRegister);
            if (err) {
                const failure: iFailure = {
                    message: err,
                    statusCode: 400
                }
                return { failure };
            }
            const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(user, userToRegister.email);
            const success: iSuccess = {
                userFromDb: user,
                assignedTasks: assignedTasks
            }
            return { success }
        } catch (error) {
            throw error;
            // const failure: iFailure = {
            //     message: error,
            //     statusCode: 400
            // }
            // return { failure };
        }
    },

    loginUser: async (reqUser) => {
        const user: iUser = await userDal.checkLogin(reqUser.email, reqUser.password, reqUser.role);
        if (user) {
            return {
                status: true,
                user: user
            }
        }
        return {
            status: false
        }
    },

    getAllUsers: async (pageNo = 1, pageSize = 5) => {
        const users: iUser[] = await userDal.getAllUsers(pageNo, pageSize)
        return users;
    },

    changeUserRole: async (userId: string, newRole: string) => {
        try {
            const updatedUser = await userDal.changeUserRole(userId, newRole);
            if (updatedUser) {
                const userUpdated = {
                    message: "User role updated.",
                    user: updatedUser
                }
                return { userUpdated }
            }
            return {
                failure: {
                    message: `User with id ${userId} does not exists.`,
                    statusCode: 404
                }
            }
        } catch (error) {
            return {
                failure: {
                    message: error,
                    statusCode: 400
                }
            }
        }
    }
}
export default userService;
