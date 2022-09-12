import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { sendEmailToUser } from "../utils/index.utils";
import { assignTaskDal } from "../dal/index.dal";

const assignTaskBll = {
    assignTaskToUser: async (newAssignTask, assignTo: string, loginUserEmail: string, loginUserName: string) => {
        const isUserExists: iUser = await assignTaskDal.checkUserExists(assignTo);
        if (isUserExists) {
            newAssignTask.userId = isUserExists._id;
            newAssignTask.assignBy = loginUserEmail;
            const taskFromDb: iTask = await assignTaskDal.assignTaskToExistingUser(newAssignTask);
            return {
                status: true,
                message: "New Task Assigned.",
                dataToSend: taskFromDb
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
            newAssignTask.assignBy = loginUserEmail;
            newAssignTask.assignTo = assignTo;
            const taskFromDb: iAssignTask = await assignTaskDal.assignTaskToNonExistingUser(newAssignTask);
            return {
                status: true,
                message: "Email sent & New Task Assigned.",
                dataToSend: taskFromDb
            }
        }
    }
}
export default assignTaskBll;