import { Request, Response } from "express";
import * as _ from "lodash";
import { assignTaskService } from "../services/index.services";

export interface userAuthRequest extends Request {
    user: any
}
const assignTaskController = {
    assignNewTask: async (req: userAuthRequest, res: Response) => {
        try {
            const loginUserName: string = req.user.name;
            const newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
            const { failure, taskAssigned } = await assignTaskService.assignTaskToUser(newAssignTask, req.body.assignTo, loginUserName);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
                "message": taskAssigned.message,
                "Task details": taskAssigned.dataToSend
            });
        }
        catch (error) {
            res.status(400).send(error.message)
        }
    }
}

export default assignTaskController;
