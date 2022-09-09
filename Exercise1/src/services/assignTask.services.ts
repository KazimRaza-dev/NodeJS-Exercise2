import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { sendEmailToUser } from "../utils/index.utils";
import { assignTaskDal } from "../dal/index.dal";

const assignTaskService = {
    assignTaskToUser: async (newAssignTask, assignTo: string, loginUserEmail: string, loginUserName: string) => {
        const isUserExists: iUser = await assignTaskDal.isUserExists(assignTo);
        if (isUserExists) {
            newAssignTask.userId = isUserExists._id;
            newAssignTask.status = "new";
            const task: iTask = await assignTaskDal.assignTaskToExistingUser(newAssignTask);
            return {
                status: true,
                message: "New Task Assigned.",
                dataToSend: task
            }
        }
        else {
            const isEmailSent: boolean = await sendEmailToUser(loginUserName, assignTo);
            if (!isEmailSent) {
                return {
                    status: false,
                    message: "Error in sending email.",
                }
            }
            newAssignTask.assignTo = assignTo;
            const task: iAssignTask = await assignTaskDal.assignTaskToNonExistingUser(newAssignTask);
            return {
                status: true,
                message: "Email sent & New Task Assigned.",
                dataToSend: task
            }
        }
    }
}
export default assignTaskService;