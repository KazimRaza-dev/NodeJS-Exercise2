import { Types, Document } from "mongoose";

interface iTask extends Document {
    _id: Types.ObjectId,
    taskTitle: string,
    description: string,
    dueDate: string,
    // status: "actice" | "pending",
    assignBy: string,
    userId: { type: Types.ObjectId, ref: 'users' }
}
export default iTask;