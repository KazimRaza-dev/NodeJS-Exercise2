import iAssignTask from "../interfaces/assignTask.interface";
import iTask from "../interfaces/task.interface";
import User from "../models/user.model";
import AssignTask from "../models/assignTask.model";
import Task from "../models/task.model";
import iUser from "../interfaces/user.interface";
import * as _ from "lodash";

const assignTaskDAL = {
    checkUserExists: async (assignToUserEmail: string): Promise<iUser> => {
        const isUserExists: iUser = await User.findOne({ email: assignToUserEmail });
        return isUserExists;
    },

    assignTaskToExistingUser: async (newAssignTask): Promise<iTask> => {
        const newTaskObj: iTask = new Task(newAssignTask);
        const taskFromDb: iTask = await newTaskObj.save();
        return taskFromDb;
    },

    assignTaskToNonExistingUser: async (newAssignTask): Promise<iAssignTask> => {
        const assignTaskObj: iAssignTask = new AssignTask(newAssignTask);
        const taskFromDb: iAssignTask = await assignTaskObj.save();
        return taskFromDb;
    }

}
export default assignTaskDAL;