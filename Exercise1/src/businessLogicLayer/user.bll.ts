import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import iAssignTask from "../interfaces/assignTask.interface";
import userDal from "../dataAccessLayer/user.dal";
import passwordHashing from "../utils/hashPassword.utils";

const userBLL = {
    registerNewUser: async (userToRegister) => {
        const isUserAlreadyExist: iUser = await userDal.isUserAlreadyExists(userToRegister.email);
        if (isUserAlreadyExist) {
            return {
                status: false
            }
        }
        userToRegister.password = await passwordHashing.hashUserPassword(userToRegister.password);

        const userFromDb: iUser = await userDal.createNewUser(userToRegister);
        const assignedTasks: iAssignTask[] = await userDal.assignTaskToNewUser(userFromDb, userToRegister.email);
        return {
            status: true,
            userFromDb: userFromDb,
            assignedTasks: assignedTasks
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
    }





}
export default userBLL;
