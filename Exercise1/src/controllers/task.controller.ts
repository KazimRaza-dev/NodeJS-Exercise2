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
            const result: iTask = await taskService.createTask(reqTask);
            res.status(200).json({
                "message": "New Task Added.",
                "Task details": result
            });
        }
        catch (error) {
            res.status(400).send(error)
        }
    },

    editTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const userRole: string = req.user.role;
            if (userRole === "member") {
                const isTaskExist = await taskService.checkMemberAccess(taskId, tokenUserId, 'edit');
                if (isTaskExist.isError) {
                    return res.status(isTaskExist.statusCode).send(isTaskExist.msg);
                }
            }
            const updatedTask: iTask = await taskService.update(taskId, req.body);
            if (updatedTask) {
                return res.status(200).send({
                    message: "Task successfully Edited.",
                    "Edited task": updatedTask
                });
            }
            return res.status(404).send(`Task with id ${taskId} does not exists.`)
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    deleteTask: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const userRole: string = req.user.role;
            if (userRole === "member") {
                const isTaskExist = await taskService.checkMemberAccess(taskId, tokenUserId, 'delete');
                if (isTaskExist.isError) {
                    return res.status(isTaskExist.statusCode).send(isTaskExist.msg);
                }
            }
            const task: iTask = await taskService.delete(taskId);
            if (task) {
                return res.status(200).send({
                    message: "Task deleted.", task: task
                })
            }
            return res.status(404).send(`Task with id ${taskId} does not exists.`)
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    getUserTasks: async (req: userAuthRequest, res: Response) => {
        try {
            const tokenUserId: string = req.user._id;
            const userId: string = req.params.userId;
            const userRole: string = req.user.role;
            let { pageno, size } = req.query as any;
            if (userRole === "member") {
                if (tokenUserId !== userId) {
                    return res.status(401).send("You cannot view other User's tasks.")
                }
            }
            const userTasks: iTask[] = await taskService.getUserTasks(userId, pageno, size);
            if (userTasks.length > 0) {
                return res.status(200).send(userTasks);
            }
            res.status(200).send("No Tasks exist for this user.");
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    getAllTasks: async (req: Request, res: Response) => {
        try {
            let { pageno, size } = req.query as any;
            const tasks: iTask[] = await taskService.getAllTasks(pageno, size);
            if (tasks.length > 0) {
                return res.status(200).send(tasks);
            }
            res.status(200).send("No Tasks added.");
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    changeTaskStatus: async (req: userAuthRequest, res: Response) => {
        try {
            const userRole: string = req.user.role;
            const tokenUserId: string = req.user._id;
            const taskId: string = req.params.id;
            const newStatus = req.body.newStatus;
            if (userRole === "admin") {
                const editedTask = await taskService.changeTaskStatusAdmin(taskId, newStatus);
                if (editedTask) {
                    return res.status(200).send({
                        message: "Task status updated.", task: editedTask
                    })
                }
                return res.status(404).send(`Task with id ${taskId} does not exists.`)
            }
            const isTaskExist = await taskService.checkMemberAccess(taskId, tokenUserId, 'change status of');
            if (isTaskExist.isError) {
                return res.status(isTaskExist.statusCode).send(isTaskExist.msg);
            }
            const isStatusChanged: boolean = await taskService.changeStatus(taskId, newStatus);
            if (isStatusChanged) {
                return res.status(200).send(`Status of task changed to '${newStatus}'.`);
            }
            res.status(400).send("Status of task can only be changed in flow. New -> In progress -> done");
        }
        catch (error) {
            res.status(400).send(error);
        }
    },

    searchingTasks: async (req: Request, res: Response) => {
        try {
            const keywordToSearch = req.body.keyword;
            if (!keywordToSearch) {
                return res.status(400).send("keyword for searching is required.");
            }
            const matchedTasks: iTask[] = await taskService.search(keywordToSearch);
            if (matchedTasks.length > 0) {
                return res.status(200).send({
                    message: `${matchedTasks.length} results found.`,
                    "Search results": matchedTasks
                });
            }
            res.status(404).send("No Tasks found.");
        }
        catch (error) {
            res.status(400).send(error);
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
            res.status(400).send(error);
        }
    },

}
export default taskController;

