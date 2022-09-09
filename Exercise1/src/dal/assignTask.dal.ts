import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { User, Task, AssignTask } from "../models/index.model";

const assignTaskDal = {
    isUserExists: async (assignToUserEmail: string): Promise<iUser> => {
        const user: iUser = await User.findOne({ email: assignToUserEmail });
        return user;
    },

    assignTaskToExistingUser: async (newAssignTask): Promise<iTask> => {
        const newTask: iTask = new Task(newAssignTask);
        const task: iTask = await newTask.save();
        return task;
    },

    assignTaskToNonExistingUser: async (assignTaskObj): Promise<iAssignTask> => {
        const newAssignTask: iAssignTask = new AssignTask(assignTaskObj);
        const assignTask: iAssignTask = await newAssignTask.save();
        return assignTask;
    }
}
export default assignTaskDal;