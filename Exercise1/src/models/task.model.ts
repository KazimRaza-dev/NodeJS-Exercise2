import { Schema, Model, model, Types } from "mongoose";
import iTask from "../interfaces/task.interface";

const taskSchema: Schema = new Schema<iTask>({
    taskTitle: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 20
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dueDate: {
        type: String,
        required: true,
        trim: true
    },

    assignBy: {
        type: String,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'users'
    }
});

const Task: Model<iTask> = model<iTask>("task", taskSchema);
export default Task;