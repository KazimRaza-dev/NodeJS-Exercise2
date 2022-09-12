import * as _ from "lodash";
import { iTask } from "../interfaces/index.interfaces";
import { Task } from "../models/index.model";

const taskDal = {
    createNewTask: async (reqTask): Promise<iTask> => {
        const user: iTask = new Task(reqTask);
        const taskFromDb: iTask = await user.save();
        return taskFromDb;
    },

    checkTaskExist: async (taskId: string): Promise<iTask> => {
        const isTaskExist = await Task.findById(taskId).select('userId');
        return isTaskExist;
    },

    editUserTask: async (taskId: string, newTask: iTask): Promise<iTask> => {
        const updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, newTask, {
            new: true
        });
        return updatedTask;
    },

    deleteUserTask: async (taskId: string): Promise<iTask> => {
        const taskDeleted: iTask = await Task.findByIdAndDelete(taskId);
        return taskDeleted;
    },

    getUserAllTasks: async (userId: string): Promise<iTask[]> => {
        const userTasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy');
        return userTasks;
    }

}
export default taskDal;
