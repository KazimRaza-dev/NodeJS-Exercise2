import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";

const assignTaskDAL = {
    isUserExists: async (assignToUserEmail: string): Promise<iUser> => {
        try {
            const user: iUser = await User.findOne({ email: assignToUserEmail });
            return user;
        } catch (error) {
            throw error;
        }
    },

    assignTaskToExistingUser: async (newAssignTask): Promise<iTask> => {
        try {
            const newTask: iTask = new Task(newAssignTask);
            const task: iTask = await newTask.save();
            return task;
        } catch (error) {
            throw error;
        }
    },

    assignTaskToNonExistingUser: async (assignTaskObj): Promise<iAssignTask> => {
        try {
            const newAssignTask: iAssignTask = new AssignTask(assignTaskObj);
            const assignTask: iAssignTask = await newAssignTask.save();
            return assignTask;
        } catch (error) {
            throw error;
        }
    }
}

export default assignTaskDAL;