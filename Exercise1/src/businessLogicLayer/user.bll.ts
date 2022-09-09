import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import iAssignTask from "../interfaces/assignTask.interface";
import userDal from "../dataAccessLayer/user.dal";
import passwordHashing from "../utils/hashPassword.utils";

interface iFailure {
    message: string
    statusCode: number
}
interface iSuccess {
    userFromDb: iUser
    assignedTasks: iAssignTask[]
}

const userBLL = {
    registerNewUser: async (userToRegister) => {
        try {
            const { error, isUserAlreadyExist } = await userDal.isUserAlreadyExists(userToRegister.email);
            if (isUserAlreadyExist) {
                const failure: iFailure = {
                    message: "Email already Exists.",
                    statusCode: 200
                }
                return { failure };
            }
            if (error) {
                const failure: iFailure = {
                    message: error,
                    statusCode: 400
                }
                return { failure };
            }
            userToRegister.password = await passwordHashing.hashUserPassword(userToRegister.password);
            const { err, userFromDb } = await userDal.createNewUser(userToRegister);
            if (err) {
                const failure: iFailure = {
                    message: err,
                    statusCode: 400
                }
                return { failure };
            }
            const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(userFromDb, userToRegister.email);
            const success: iSuccess = {
                userFromDb: userFromDb,
                assignedTasks: assignedTasks
            }
            return { success }
        } catch (error) {
            const failure: iFailure = {
                message: error,
                statusCode: 400
            }
            return { failure };
        }
    },

    loginUserBll: async (user) => {
        const userFromDb: iUser = await userDal.checkLoginCredientials(user.email, user.password, user.role);
        if (userFromDb) {
            return {
                status: true,
                userFromDb: userFromDb
            }
        }
        return {
            status: false
        }
    },

    getAllRegisterUsers: async (pageNo = 1, pageSize = 5) => {
        const allUsers: iUser[] = await userDal.getAllUsers(pageNo, pageSize)
        return allUsers;
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
export default userBLL;
