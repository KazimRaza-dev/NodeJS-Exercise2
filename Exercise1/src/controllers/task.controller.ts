import { Request, Response } from "express";
import { iTask } from "../interfaces/index.interfaces";
import * as _ from "lodash";
import { taskService } from "../services/index.services"; ''
import { UploadedFile } from "express-fileupload";

interface userAuthRequest extends Request {
    user: any
}

const taskController = {
    addTask: async (req: userAuthRequest, res: Response) => {
        try {
            const reqTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
            reqTask.userId = req.user._id;
            reqTask.status = "new";
            const task: iTask = await taskService.createTask(reqTask);
            res.status(200).json({
                "message": "New Task Added.",
                "Task details": task
            });
        }
        catch (error) {
            res.status(400).send(error.message)
        }
    },

    editTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const userRole: string = req.user.role;
            if (userRole === "member") {
                const { failure, validUser } = await taskService.checkMemberAccess(taskId, tokenUserId, 'edit');
                if (failure) {
                    return res.status(failure.statusCode).send(failure.message);
                }
            }
            const { task, failure } = await taskService.update(taskId, req.body);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
                message: task.message,
                task: task.updated
            })
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    deleteTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const userRole: string = req.user.role;
            if (userRole === "member") {
                const { failure, validUser } = await taskService.checkMemberAccess(taskId, tokenUserId, 'delete');
                if (failure) {
                    return res.status(failure.statusCode).send(failure.message);
                }
            }
            const { task, failure } = await taskService.delete(taskId);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
                message: task.message,
                task: task.deleted
            })
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    getUserTasks: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const userId: string = req.params.userId;
            const userRole: string = req.user.role;
            const { pageno, size } = req.query as any;
            if (userRole === "member") {
                if (tokenUserId !== userId) {
                    return res.status(401).send("You cannot view other User's tasks.")
                }
            }
            const { failure, tasks } = await taskService.getUserTasks(userId, pageno, size);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).send(tasks.usertasks)
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    getAllTasks: async (req: Request, res: Response) => {
        try {
            const { pageno, size } = req.query as any;
            const { failure, tasks } = await taskService.getAllTasks(pageno, size);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).send(tasks.alltasks);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    changeTaskStatus: async (req: userAuthRequest, res: Response) => {
        try {
            const userRole: string = req.user.role;
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const newStatus = req.body.newStatus;
            if (userRole === "admin") {
                const { notUpdated, updated } = await taskService.changeTaskStatusAdmin(taskId, newStatus);
                if (updated) {
                    return res.status(200).send({
                        message: updated.message, task: updated.task
                    })
                }
                return res.status(notUpdated.statusCode).send(notUpdated.message)
            }

            const { failure, validUser } = await taskService.checkMemberAccess(taskId, tokenUserId, 'change status of');
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }

            const { updated, notUpdated } = await taskService.changeStatus(taskId, newStatus);
            if (updated) {
                return res.status(200).send(updated.message)
            }
            return res.status(notUpdated.statusCode).send(notUpdated.message)
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    searchingTasks: async (req: Request, res: Response) => {
        try {
            const keywordToSearch = req.body.keyword;
            if (!keywordToSearch) {
                return res.status(400).send("keyword for searching is required.");
            }
            const { failure, tasks } = await taskService.search(keywordToSearch);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).send({
                message: tasks.message,
                tasks: tasks.matched
            });
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

    importTasksInBulk: async (req: userAuthRequest, res: Response) => {
        try {
            const userId = req.user._id;
            if (!req.files) {
                return res.status(400).send("Tasks file Not uploaded.");
            }
            const file: UploadedFile = req.files.tasksFile as UploadedFile;
            const { error, fileData } = await taskService.importTasksFile(file, userId);
            if (error) {
                return res.status(400).send(error.message)
            }
            return res.status(200).send({
                message: "Tasks file imported.",
                tasks: fileData
            });
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    },

}
export default taskController;

