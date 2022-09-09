import * as _ from "lodash";
import { ValidationError } from "joi";
import { UploadedFile } from "express-fileupload";
import { iTask } from "../interfaces/index.interfaces";
import { taskDal } from "../dal/index.dal";
import { validateTasksFile } from "../middlewares/index.middleware";
import responseWrapper from "../utils/responseWrapper.utils";

const taskService = {
    createTask: async (reqTask): Promise<iTask> => {
        try {
            const task: iTask = await taskDal.create(reqTask);
            return task;
        } catch (error) {
            throw error;
        }
    },

    checkMemberAccess: async (taskId: string, tokenUserId: string, operation: string) => {
        try {
            const isTaskExist: iTask = await taskDal.isTaskExists(taskId);
            if (isTaskExist) {
                const userId: string = isTaskExist.userId.toString();
                if (tokenUserId !== userId) {
                    const failure = responseWrapper(401, `You cannot ${operation} other User's task.`)
                    return { failure }
                }
            }
            else {
                const failure = responseWrapper(404, `Task with id ${taskId} does not exists.`)
                return { failure }
            }
            return { validUser: true }
        } catch (error) {
            throw error;
        }
    },

    update: async (taskId: string, task: iTask) => {
        try {
            const updatedTask: iTask = await taskDal.editUserTask(taskId, task);
            if (updatedTask) {
                const task = {
                    message: "Task successfully Edited.",
                    updated: updatedTask
                }
                return { task };
            }
            const failure = responseWrapper(404, `Task with id ${taskId} does not exists.`)
            return { failure }
        } catch (error) {
            throw error;
        }
    },

    delete: async (taskId: string) => {
        try {
            const deletedTask: iTask = await taskDal.delete(taskId);
            if (deletedTask) {
                const task = {
                    message: "Task successfully deleted.",
                    deleted: deletedTask
                }
                return { task };
            }
            const failure = responseWrapper(404, `Task with id ${taskId} does not exists.`)
            return { failure }
        } catch (error) {
            throw error;
        }
    },

    getUserTasks: async (userId: string, pageno: number = 1, pageSize: number = 5) => {
        try {
            const usertasks: iTask[] = await taskDal.getUserTasks(userId, pageno, pageSize);
            if (usertasks.length > 0) {
                const tasks = {
                    usertasks: usertasks
                }
                return { tasks };
            }
            const failure = responseWrapper(404, "No Tasks exist for this user.")
            return { failure }
        } catch (error) {
            throw error;
        }
    },

    getAllTasks: async (pageNo = 1, pageSize = 5) => {
        try {
            const alltasks = await taskDal.getAllTasks(pageNo, pageSize);
            if (alltasks.length > 0) {
                const tasks = {
                    alltasks: alltasks
                }
                return { tasks };
            }
            const failure = responseWrapper(404, "No Tasks added")
            return { failure }
        } catch (error) {
            throw error;
        }
    },

    changeStatus: async (taskId: string, newStatus: string) => {
        try {
            const isStatusChanged: boolean = await taskDal.changeStatus(taskId, newStatus);
            if (isStatusChanged) {
                const updated = {
                    message: `Status of task changed to ${newStatus}`
                }
                return { updated };
            }
            const notUpdated = responseWrapper(400, "Status of task can only be changed in flow. New -> In progress -> done")
            return { notUpdated };
        } catch (error) {
            throw error;
        }
    },

    changeTaskStatusAdmin: async (taskId: string, newStatus: string) => {
        try {
            const task = await taskDal.changeStatusAdmin(taskId, newStatus);
            if (task) {
                const updated = {
                    message: "Task status updated.",
                    task: task
                }
                return { updated };
            }
            const notUpdated = responseWrapper(404, `Task with id ${taskId} does not exists.`)
            return { notUpdated }
        } catch (error) {
            throw error;
        }
    },

    search: async (keywordToSearch: string) => {
        try {
            keywordToSearch = keywordToSearch.toLowerCase();
            const matchedTasks = await taskDal.searchTasks(keywordToSearch);
            if (matchedTasks.length > 0) {
                const tasks = {
                    message: `${matchedTasks.length} results found.`,
                    matched: matchedTasks
                }
                return { tasks };
            }
            const failure = responseWrapper(404, "No Tasks found")
            return { failure }
        } catch (error) {
            throw error;
        }
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
            throw error;
        }
    }
}
export default taskService;
