import * as _ from "lodash";
import { iUser, iAssignTask } from "../interfaces/index.interfaces";
import { userDal } from "../dal/index.dal";

const userBLL = {
    registerNewUser: async (userToRegister) => {
        const isUserAlreadyExist: iUser = await userDal.isUserAlreadyExists(userToRegister.email);
        if (isUserAlreadyExist) {
            return {
                status: false
            }
        }
        const userFromDb: iUser = await userDal.createNewUser(userToRegister);
        const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(userFromDb, userToRegister.email);
        return {
            status: true,
            userFromDb: userFromDb,
            assignedTasks: assignedTasks
        }
    },

    loginUserBll: async (user) => {
        const userFromDb: iUser = await userDal.checkLoginCredientials(user.email, user.password);
        if (userFromDb) {
            return {
                status: true,
                userFromDb: userFromDb
            }
        }
        return {
            status: false
        }
    }





}
export default userBLL;
