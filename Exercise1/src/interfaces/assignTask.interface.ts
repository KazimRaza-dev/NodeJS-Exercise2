import { Types, Document } from "mongoose";

interface iAssignTask extends Document {
    _id: Types.ObjectId,
    assignBy: string,
    assignTo: string,
    taskTitle: string,
    description: string,
    dueDate: string
}
export default iAssignTask;