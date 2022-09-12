import * as _ from "lodash";
import { Types } from "mongoose";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";

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
            await Promise.all(
                assignedTasks.map((task) => {
                    const newTask = _.pick(task, ['taskTitle', 'description', 'dueDate']);
                    newTask.userId = userId;
                    newTask.status = "new";
                    const userTask: iTask = new Task(newTask);
                    userTask.save();
                })
            )
            await AssignTask.deleteMany({ assignTo: userEmail })
        }
        return assignedTasks;
    },

    checkLoginCredientials: async (userEmail: string, userPassword: string): Promise<iUser> => {
        const userFromDb: iUser = await User.findOne({ email: userEmail, password: userPassword });
        return userFromDb;
    },
}
export default userDal;

