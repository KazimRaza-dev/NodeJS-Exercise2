import * as _ from "lodash";
import { iTask } from "../interfaces/index.interfaces";
import { taskDal } from "../dal/index.dal";
const taskBLL = {
    addTask: async (reqTask): Promise<iTask> => {
        try {
            const task: iTask = await taskDal.create(reqTask);
            return task;
        } catch (error) {
            throw error;
        }
    },

    isTaskExists: async (taskId: string, tokenUserId: string) => {
        try {
            const isTaskExist: iTask = await taskDal.isTaskExists(taskId);
            if (isTaskExist) {
                const userId: string = isTaskExist.userId.toString();
                if (tokenUserId !== userId) {
                    return {
                        isError: true,
                        statusCode: 401,
                        msg: "You cannot Edit other User's task."
                    }
                }
            } else {
                return {
                    isError: true,
                    statusCode: 404,
                    msg: `Task with id ${taskId} does not exists.`
                }
            }
            return {
                isError: false
            };
        } catch (error) {
            throw error;
        }
    },

    updateTask: async (taskId: string, task: iTask): Promise<iTask> => {
        try {
            const editedtask: iTask = await taskDal.editUserTask(taskId, task);
            return editedtask;
        } catch (error) {
            throw error;
        }
    },

    delete: async (taskId: string): Promise<iTask> => {
        try {
            const deletedTask: iTask = await taskDal.delete(taskId);
            return deletedTask;
        } catch (error) {
            throw error;
        }
    },

    getAllTasks: async (userId: string): Promise<iTask[]> => {
        try {
            const userTasks: iTask[] = await taskDal.getUserAllTasks(userId);
            return userTasks;
        } catch (error) {
            throw error;
        }
    }
}
export default taskBLL;
