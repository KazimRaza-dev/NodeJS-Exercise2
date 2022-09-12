import * as _ from "lodash";
import { iTask } from "../interfaces/index.interfaces";
import { Task } from "../models/index.model";

const taskDal = {
    create: async (reqTask): Promise<iTask> => {
        try {
            const newTask: iTask = new Task(reqTask);
            const task: iTask = await newTask.save();
            return task;
        } catch (error) {
            throw error;
        }
    },

    isTaskExists: async (taskId: string): Promise<iTask> => {
        try {
            const task: iTask = await Task.findById(taskId).select('userId');
            return task;
        } catch (error) {
            throw error;
        }
    },

    editUserTask: async (taskId: string, newTask: iTask): Promise<iTask> => {
        try {
            const updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, newTask, {
                new: true
            });
            return updatedTask;
        } catch (error) {
            throw error;
        }
    },

    delete: async (taskId: string): Promise<iTask> => {
        try {
            const deletedTask: iTask = await Task.findByIdAndDelete(taskId);
            return deletedTask;
        } catch (error) {
            throw error;
        }
    },

    getUserAllTasks: async (userId: string): Promise<iTask[]> => {
        try {
            const tasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy');
            return tasks;
        } catch (error) {
            throw error;
        }
    }

}
export default taskDal;
