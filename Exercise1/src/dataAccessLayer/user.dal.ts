import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import User from "../models/user.model";
import iAssignTask from "../interfaces/assignTask.interface";
import AssignTask from "../models/assignTask.model";
import Task from "../models/task.model";
import iTask from "../interfaces/task.interface";
import { Types } from "mongoose";
import passwordHashing from "../utils/hashPassword.utils";

const userDal = {
    isUserAlreadyExists: async (userEmail: string): Promise<iUser> => {
        const isUserAlreadyExist: iUser = await User.findOne({ email: userEmail });
        return isUserAlreadyExist;
    },

    createNewUser: async (userToRegister): Promise<iUser> => {
        const user: iUser = new User(userToRegister);
        const userFromDb: iUser = await user.save();
        return userFromDb;
    },

    assignTaskToNewUser: async (userFromDb: iUser, userEmail: string): Promise<iAssignTask[]> => {
        const userId: Types.ObjectId = userFromDb._id;
        const assignedTasks: iAssignTask[] = await AssignTask.find({ assignTo: userEmail });
        if (assignedTasks.length > 0) {
            assignedTasks.map(async (task) => {
                let newTask = _.pick(task, ['taskTitle', 'description', 'dueDate']);
                newTask.userId = userId;
                newTask.status = "new";
                const userTask: iTask = new Task(newTask);
                await userTask.save();
            });
            await AssignTask.deleteMany({ assignTo: userEmail })
        }
        return assignedTasks;
    },

    checkLoginCredientials: async (userEmail: string, userPassword: string, userRole: string): Promise<iUser> => {
        const userFromDb: iUser = await User.findOne({ email: userEmail, role: userRole });
        if (userFromDb) {
            const isPasswordCorrect = await passwordHashing.unhashPassword(userPassword, userFromDb.password);
            if (isPasswordCorrect) {
                return userFromDb;
            }
            return null;
        }
        return userFromDb;
    },
}
export default userDal;

