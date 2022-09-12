import * as _ from "lodash";
import { iUser, iAssignTask } from "../interfaces/index.interfaces";
import { userDal } from "../dal/index.dal";
import { passwordHashing, responseWrapper } from "../utils/index.utils";

interface iSuccess {
    userFromDb: iUser
    assignedTasks: iAssignTask[]
}

const userService = {
    registerUser: async (userToRegister) => {
        try {
            const { isUserExists } = await userDal.isUserExists(userToRegister.email);
            if (isUserExists) {
                const failure = responseWrapper(200, "Email already Exists")
                return { failure };
            }
            userToRegister.password = await passwordHashing.hashPassword(userToRegister.password);
            const { user } = await userDal.create(userToRegister);

            const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(user, userToRegister.email);
            const success: iSuccess = {
                userFromDb: user,
                assignedTasks: assignedTasks
            }
            return { success }
        } catch (error) {
            throw error;
        }
    },

    loginUser: async (reqUser) => {
        try {
            const user: iUser = await userDal.checkLogin(reqUser.email, reqUser.password, reqUser.role);
            if (user) {
                const loggedIn = {
                    user: user,
                }
                return { loggedIn }
            }
            const failure = responseWrapper(401, "Invalid Email, password or role")
            return { failure };
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async (pageNo = 1, pageSize = 5) => {
        try {
            const users: iUser[] = await userDal.getAllUsers(pageNo, pageSize)
            if (users.length > 0) {
                return users;
            }
            const noUsers: string = "No Users Exists.";
            return noUsers;
        } catch (error) {
            throw error;
        }
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
            const failure = responseWrapper(404, `User with id ${userId} does not exists.`);
            return { failure }
        } catch (error) {
            throw error;
        }
    }
}
export default userService;
