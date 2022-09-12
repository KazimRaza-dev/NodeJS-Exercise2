import * as _ from "lodash";
import { iUser, iAssignTask } from "../interfaces/index.interfaces";
import { userDal } from "../dal/index.dal";

const userBLL = {
    registerNewUser: async (userToRegister) => {
        try {
            const { isUserExists } = await userDal.isUserExists(userToRegister.email);
            if (isUserExists) {
                return {
                    status: false
                }
            }
            const { user } = await userDal.create(userToRegister);
            const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(user, userToRegister.email);
            return {
                status: true,
                userFromDb: user,
                assignedTasks: assignedTasks
            }

        } catch (error) {
            throw error;
        }
    },

    loginUserBll: async (reqUser) => {
        try {
            const user: iUser = await userDal.checkLoginCredientials(reqUser.email, reqUser.password);
            if (user) {
                return {
                    status: true,
                    userFromDb: user
                }
            }
            return {
                status: false
            }
        } catch (error) {
            throw error;
        }
    }
}
export default userBLL;
