import * as _ from "lodash";
import { Types } from "mongoose";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";
import { passwordHashing } from "../utils/index.utils";

const userDal = {
    isUserExists: async (userEmail: string) => {
        try {
            // throw new Error("I am error");

            const isUserExists: iUser = await User.findOne({ email: userEmail });
            return { isUserExists };
        } catch (error) {
            // return { error }
            throw error;
        }
    },

    create: async (userToRegister) => {
        try {
            const newUser: iUser = new User(userToRegister);
            const user: iUser = await newUser.save();
            return { user };
        }
        catch (err) {
            return { err }
        }
    },

    assignTaskToNewUser: async (userFromDb: iUser, userEmail: string): Promise<iAssignTask[]> => {
        try {
            const userId: Types.ObjectId = userFromDb._id;
            const assignedTasks: iAssignTask[] = await AssignTask.find({ assignTo: userEmail });
            if (assignedTasks.length > 0) {
                assignedTasks.map(async (task) => {
                    const newTask = _.pick(task, ['taskTitle', 'description', 'dueDate']);
                    newTask.userId = userId;
                    newTask.status = "new";
                    const userTask: iTask = new Task(newTask);
                    await userTask.save();
                });
                await AssignTask.deleteMany({ assignTo: userEmail })
            }
            return assignedTasks;
        } catch (error) {
            throw new Error(error);
        }
    },

    checkLogin: async (userEmail: string, userPassword: string, userRole: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ email: userEmail, role: userRole });
            if (user) {
                const isPasswordCorrect = await passwordHashing.unhashPassword(userPassword, user.password);
                if (isPasswordCorrect) {
                    return user;
                }
                return null;
            }
            return user;
        } catch (error) {
            throw new Error(error);
        }
    },

    getAllUsers: async (pageNo: number, pageSize: number): Promise<iUser[]> => {
        try {
            const skip = (pageNo - 1) * pageSize;
            const allUsers: iUser[] = await User.find({ "role": "member" }).select("-password")
                .skip(skip).limit(pageSize)
            return allUsers;
        } catch (error) {
            throw new Error(error);
        }
    },

    changeUserRole: async (userId: string, newRole: string) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, {
                role: newRole
            }, {
                new: true
            });
            return updatedUser;
        } catch (error) {
            throw new Error(error);
        }
    }

}
export default userDal;

