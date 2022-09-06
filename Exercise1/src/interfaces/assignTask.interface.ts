import { Types, Document } from "mongoose";

interface iAssignTask extends Document {
    _id: Types.ObjectId,
    assignTo: string,
    taskTitle: string,
    description: string,
    dueDate: string
}
export default iAssignTask;