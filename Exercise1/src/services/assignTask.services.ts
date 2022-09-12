import * as _ from "lodash";
import { iUser, iTask, iAssignTask } from "../interfaces/index.interfaces";
import { sendEmailToUser, responseWrapper } from "../utils/index.utils";
import { assignTaskDal } from "../dal/index.dal";

const assignTaskBll = {
    assignTaskToUser: async (newAssignTask, assignTo: string, loginUserEmail: string, loginUserName: string) => {
        try {
            const isUserExists: iUser = await assignTaskDal.isUserExists(assignTo);
            if (isUserExists) {
                newAssignTask.userId = isUserExists._id;
                if (loginUserEmail === assignTo) {
                    newAssignTask.assignBy = "self"
                }
                else {
                    newAssignTask.assignBy = loginUserEmail;
                }
                const task: iTask = await assignTaskDal.assignTaskToExistingUser(newAssignTask);
                const taskAssigned = {
                    message: "New Task Assigned.",
                    dataToSend: task
                }
                return { taskAssigned }
            }
            else {
                const isEmailSent: boolean = await sendEmailToUser(loginUserName, assignTo);
                if (!isEmailSent) {
                    const failure = responseWrapper(400, "Error in sending email.")
                    return { failure }
                }
                newAssignTask.assignBy = loginUserEmail;
                newAssignTask.assignTo = assignTo;
                const task: iAssignTask = await assignTaskDal.assignTaskToNonExistingUser(newAssignTask);
                const taskAssigned = {
                    message: "Email sent & New Task Assigned.",
                    dataToSend: task
                }
                return { taskAssigned }
            }
        } catch (error) {
            throw error;
        }
    }
}
export default assignTaskBll;