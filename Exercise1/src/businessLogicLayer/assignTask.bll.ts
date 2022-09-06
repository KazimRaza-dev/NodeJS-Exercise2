import iAssignTask from "../interfaces/assignTask.interface";
import iTask from "../interfaces/task.interface";
import * as _ from "lodash";
import iUser from "../interfaces/user.interface";
import SendEmailToUser from "../utils/mail.utils";
import assignTaskDal from "../dataAccessLayer/assignTask.dal";

const assignTaskBll = {
    assignTaskToUser: async (newAssignTask, assignTo: string, loginUserEmail: string, loginUserName: string) => {
        const isUserExists: iUser = await assignTaskDal.checkUserExists(assignTo);
        if (isUserExists) {
            newAssignTask.userId = isUserExists._id;
            newAssignTask.status = "new";
            const taskFromDb: iTask = await assignTaskDal.assignTaskToExistingUser(newAssignTask);
            return {
                status: true,
                message: "New Task Assigned.",
                dataToSend: taskFromDb
            }
        }
        else {
            const isEmailSent: boolean = await SendEmailToUser(loginUserName, assignTo);
            if (!isEmailSent) {
                return {
                    status: false,
                    message: "Error in sending email.",
                }
            }
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