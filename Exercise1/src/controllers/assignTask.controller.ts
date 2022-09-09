import { Request, Response } from "express";
import * as _ from "lodash";
import { assignTaskService } from "../services/index.services";

export interface userAuthRequest extends Request {
    user: any
}
const assignTaskController = {
    assignNewTask: async (req: userAuthRequest, res: Response) => {
        try {
            const loginUserEmail: string = req.user.email;
            const loginUserName: string = req.user.name;
            let newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
            const isTaskAssign = await assignTaskService.assignTaskToUser(newAssignTask, req.body.assignTo, loginUserEmail, loginUserName);

            if (isTaskAssign.status) {
                return res.status(200).json({
                    "message": isTaskAssign.message,
                    "Task details": isTaskAssign.dataToSend
                });
            }
            return res.status(400).json({
                "message": isTaskAssign.message,
            });
        }
        catch (error) {
            res.status(400).send(error)
        }
    }


}
export default assignTaskController;
