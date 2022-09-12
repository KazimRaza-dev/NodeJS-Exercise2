import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";

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