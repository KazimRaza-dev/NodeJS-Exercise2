import iTask from "../interfaces/task.interface";
import Task from "../models/task.model";
import * as _ from "lodash";

const createNewTask = async (reqTask): Promise<iTask> => {
    const user: iTask = new Task(reqTask);
    const taskFromDb: iTask = await user.save();
    return taskFromDb;
}

const checkTaskExist = async (taskId: string): Promise<iTask> => {
    const isTaskExist = await Task.findById(taskId).select('userId');
    return isTaskExist;
}

const editUserTask = async (taskId: string, newTask: iTask): Promise<iTask> => {
    const updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, newTask, {
        new: true
    });
    return updatedTask;
}

const deleteUserTask = async (taskId: string): Promise<iTask> => {
    let taskDeleted: iTask = await Task.findByIdAndDelete(taskId);
    return taskDeleted;
}

const getUserAllTasks = async (userId: string): Promise<iTask[]> => {
    const userTasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy');
    return userTasks;
}

export {
    createNewTask,
    checkTaskExist,
    editUserTask,
    deleteUserTask,
    getUserAllTasks
}