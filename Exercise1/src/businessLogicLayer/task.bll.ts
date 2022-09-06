import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import taskDal from "../dataAccessLayer/task.dal";
import exp from "constants";

const taskBLL = {
    addNewTaskBll: async (reqTask): Promise<iTask> => {
        const result: iTask = await taskDal.createNewTask(reqTask);
        return result;
    },

    isTaskAlreadyExists: async (taskId: string, tokenUserId: string, operation: string) => {
        const isTaskExist: iTask = await taskDal.checkTaskExist(taskId);
        if (isTaskExist) {
            const userId: string = isTaskExist.userId.toString();
            if (tokenUserId !== userId) {
                return {
                    isError: true,
                    statusCode: 401,
                    msg: `You cannot ${operation} other User's task.`
                }
            }
        } else {
            return {
                isError: true,
                statusCode: 400,
                msg: `Task with id ${taskId} does not exists.`
            }
        }
        return {
            isError: false
        };
    },

    updateExistingTask: async (taskId: string, task: iTask): Promise<iTask> => {
        const updatedTask: iTask = await taskDal.editUserTask(taskId, task);
        return updatedTask;
    },

    deleteTask: async (taskId: string): Promise<iTask> => {
        const taskDeleted: iTask = await taskDal.deleteUserTask(taskId);
        return taskDeleted;
    },

    getAllAddedTasks: async (userId: string): Promise<iTask[]> => {
        const userTasks: iTask[] = await taskDal.getUserAllTasks(userId);
        return userTasks;
    },

    getAllDbTasks: async () => {
        const allTasks = await taskDal.getAllTasks();
        return allTasks;
    },

    changeTaskStatus: async (taskId: string, newStatus: string): Promise<boolean> => {
        const isStatusChanged: boolean = await taskDal.changeTaskStatus(taskId, newStatus);
        return isStatusChanged;
    },

    changeTaskStatusAdmin: async (taskId: string, newStatus: string) => {
        const editedTask = await taskDal.changeTaskStatusAdmin(taskId, newStatus);
        return editedTask;
    }


}
export default taskBLL;
