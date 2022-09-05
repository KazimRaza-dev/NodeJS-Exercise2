import { Request, Response } from "express";
import iAssignTask from "../interfaces/assignTask.interface";
import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import SendEmailToUser from "../utils/mail.utils";
import * as assignTaskDal from "../dataAccessLayer/assignTask.dal";

export interface userAuthRequest extends Request {
    user: any
}
export const assignNewTask = async (req: userAuthRequest, res: Response) => {
    try {
        const loginUserEmail: string = req.user.email;
        const loginUserName: string = req.user.name;
        let newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
        const isUserExists: iUser = await assignTaskDal.checkUserExists(req.body.assignTo)

        if (isUserExists) {
            newAssignTask.userId = isUserExists._id;
            newAssignTask.assignBy = loginUserEmail;
            const taskFromDb: iTask = await assignTaskDal.assignTaskToExistingUser(newAssignTask)
            return res.status(200).json({
                "message": "New Task Assigned.",
                "Task details": taskFromDb
            })
        }
        else {
            const isEmailSent: boolean = await SendEmailToUser(loginUserName, req.body.assignTo);
            if (!isEmailSent) {
                return res.status(400).send("Error in sending email.");
            }
            newAssignTask.assignBy = loginUserEmail;
            newAssignTask.assignTo = req.body.assignTo;
            const taskFromDb: iAssignTask = await assignTaskDal.assignTaskToNonExistingUser(newAssignTask);
            return res.status(200).json({
                "message": "Email send & New Task Assigned.",
                "Assigned Task details": taskFromDb
            })
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
}