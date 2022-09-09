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
    isUserAlreadyExists: async (userEmail: string) => {
        try {
            const isUserAlreadyExist: iUser = await User.findOne({ email: userEmail });
            return { isUserAlreadyExist };
        } catch (error) {
            return { error }
        }
    },

    createNewUser: async (userToRegister) => {
        try {
            const user: iUser = new User(userToRegister);
            const userFromDb: iUser = await user.save();
            return { userFromDb };
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
                    let newTask = _.pick(task, ['taskTitle', 'description', 'dueDate']);
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

    checkLoginCredientials: async (userEmail: string, userPassword: string, userRole: string): Promise<iUser> => {
        try {
            const userFromDb: iUser = await User.findOne({ email: userEmail, role: userRole });
            if (userFromDb) {
                const isPasswordCorrect = await passwordHashing.unhashPassword(userPassword, userFromDb.password);
                if (isPasswordCorrect) {
                    return userFromDb;
                }
                return null;
            }
            return userFromDb;
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
            const updatedRole = await User.findByIdAndUpdate(userId, {
                role: newRole
            }, {
                new: true
            });
            return updatedRole;
        } catch (error) {
            throw new Error(error);
        }
    }

}
export default userDal;

