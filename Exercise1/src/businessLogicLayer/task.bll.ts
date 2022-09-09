import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import taskDal from "../dataAccessLayer/task.dal";
import { UploadedFile } from "express-fileupload";
import validateTasksFile from "../middlewares/validateRequest/tasksFileValidator"
import { ValidationError } from "joi";

const taskBLL = {
    addNewTaskBll: async (reqTask): Promise<iTask> => {
        const result: iTask = await taskDal.createNewTask(reqTask);
        return result;
    },

    checkMemberAccess: async (taskId: string, tokenUserId: string, operation: string) => {
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
        }
        else {
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

    getAllAddedTasks: async (userId: string, pageno: number = 1, pageSize: number = 5): Promise<iTask[]> => {
        const userTasks: iTask[] = await taskDal.getUserAllTasks(userId, pageno, pageSize);
        return userTasks;
    },

    getAllDbTasks: async (pageNo = 1, pageSize = 5) => {
        const allTasks = await taskDal.getAllTasks(pageNo, pageSize);
        return allTasks;
    },

    changeTaskStatus: async (taskId: string, newStatus: string): Promise<boolean> => {
        const isStatusChanged: boolean = await taskDal.changeTaskStatus(taskId, newStatus);
        return isStatusChanged;
    },

    changeTaskStatusAdmin: async (taskId: string, newStatus: string) => {
        const editedTask = await taskDal.changeTaskStatusAdmin(taskId, newStatus);
        return editedTask;
    },

    searchTasks: async (keywordToSearch: string) => {
        keywordToSearch = keywordToSearch.toLowerCase();
        const searchResult = await taskDal.searchTask(keywordToSearch);
        return searchResult;
    },

    importTasksFile: async (tasksFile: UploadedFile, userId): Promise<{
        error: ValidationError;
        fileData?: undefined;
    } | {
        fileData: iTask[];
        error?: undefined;
    }> => {
        try {
            const fileData: iTask[] = JSON.parse(tasksFile.data.toString("utf8"));
            const { error } = validateTasksFile(fileData);
            if (error) {
                return { error };
            }
            await Promise.all(
                fileData.map((task) => {
                    task.status = "new";
                    task.userId = userId;
                    taskDal.createNewTask(task)
                })
            )
            return { fileData };
        } catch (error) {
            return { error };
        }
    }
}
export default taskBLL;
