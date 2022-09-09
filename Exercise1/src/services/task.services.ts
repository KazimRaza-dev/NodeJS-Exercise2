import * as _ from "lodash";
import { ValidationError } from "joi";
import { UploadedFile } from "express-fileupload";
import { iTask } from "../interfaces/index.interfaces";
import { taskDal } from "../dal/index.dal";
import { validateTasksFile } from "../middlewares/index.middleware";

const taskService = {
    createTask: async (reqTask): Promise<iTask> => {
        const task: iTask = await taskDal.create(reqTask);
        return task;
    },

    checkMemberAccess: async (taskId: string, tokenUserId: string, operation: string) => {
        const isTaskExist: iTask = await taskDal.isTaskExists(taskId);
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
                statusCode: 404,
                msg: `Task with id ${taskId} does not exists.`
            }
        }
        return {
            isError: false
        };
    },

    update: async (taskId: string, task: iTask): Promise<iTask> => {
        const updatedTask: iTask = await taskDal.editUserTask(taskId, task);
        return updatedTask;
    },

    delete: async (taskId: string): Promise<iTask> => {
        const taskDeleted: iTask = await taskDal.delete(taskId);
        return taskDeleted;
    },

    getUserTasks: async (userId: string, pageno: number = 1, pageSize: number = 5): Promise<iTask[]> => {
        const tasks: iTask[] = await taskDal.getUserTasks(userId, pageno, pageSize);
        return tasks;
    },

    getAllTasks: async (pageNo = 1, pageSize = 5) => {
        const tasks = await taskDal.getAllTasks(pageNo, pageSize);
        return tasks;
    },

    changeStatus: async (taskId: string, newStatus: string): Promise<boolean> => {
        const isStatusChanged: boolean = await taskDal.changeStatus(taskId, newStatus);
        return isStatusChanged;
    },

    changeTaskStatusAdmin: async (taskId: string, newStatus: string) => {
        const editedTask = await taskDal.changeStatusAdmin(taskId, newStatus);
        return editedTask;
    },

    search: async (keywordToSearch: string) => {
        keywordToSearch = keywordToSearch.toLowerCase();
        const matchedTasks = await taskDal.searchTasks(keywordToSearch);
        return matchedTasks;
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
                    taskDal.create(task)
                })
            )
            return { fileData };
        } catch (error) {
            return { error };
        }
    }
}
export default taskService;
