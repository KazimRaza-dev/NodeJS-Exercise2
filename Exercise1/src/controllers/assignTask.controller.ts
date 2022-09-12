import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import { assignTaskService } from "../services/index.services";

export interface userAuthRequest extends Request {
    user: any
}
const assignTaskController = {
    assignNewTask: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const loginUserEmail: string = req.user.email;
            const loginUserName: string = req.user.name;
            const newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
            const { failure, taskAssigned } = await assignTaskService.assignTaskToUser(newAssignTask, req.body.assignTo, loginUserEmail, loginUserName);
            if (failure) {
                return res.status(failure.statusCode).send(failure.message);
            }
            return res.status(200).json({
                "message": taskAssigned.message,
                "Task details": taskAssigned.dataToSend
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export default assignTaskController;
