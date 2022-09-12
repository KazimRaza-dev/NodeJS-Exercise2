import * as _ from "lodash";
import { Types } from "mongoose";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";

const userDal = {
    isUserExists: async (userEmail: string) => {
        try {
            const isUserExists: iUser = await User.findOne({ email: userEmail });
            return { isUserExists };
        } catch (error) {
            throw error;
        }
    },

    create: async (userToRegister) => {
        try {
            const newUser: iUser = new User(userToRegister);
            const user: iUser = await newUser.save();
            return { user };
        }
        catch (error) {
            throw error;
        }
    },

    assignTaskToNewUser: async (userFromDb: iUser, userEmail: string): Promise<iAssignTask[]> => {
        try {
            const userId: Types.ObjectId = userFromDb._id;
            const assignedTasks: iAssignTask[] = await AssignTask.find({ assignTo: userEmail });
            if (assignedTasks.length > 0) {
                await Promise.all(
                    assignedTasks.map((task) => {
                        const newTask = _.pick(task, ['taskTitle', 'description', 'dueDate', 'assignBy']);
                        newTask.userId = userId;
                        const userTask: iTask = new Task(newTask);
                        userTask.save();
                    })
                )
                await AssignTask.deleteMany({ assignTo: userEmail })
            }
            return assignedTasks;
        } catch (error) {
            throw error;
        }
    },

    checkLoginCredientials: async (userEmail: string, userPassword: string): Promise<iUser> => {
        try {
            const userFromDb: iUser = await User.findOne({ email: userEmail, password: userPassword });
            return userFromDb;
        } catch (error) {
            throw error;
        }
    },
}
export default userDal;

