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
            const newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);

            const bllResult = await assignTaskService.assignTaskToUser(newAssignTask, req.body.assignTo, loginUserEmail, loginUserName);

            if (bllResult.status) {
                return res.status(200).json({
                    "message": bllResult.message,
                    "Task details": bllResult.dataToSend
                });
            }
            return res.status(400).json({
                "message": bllResult.message,
            });
        }
        catch (error) {
            res.status(400).send(error)
        }
    }


}
export default assignTaskController;
