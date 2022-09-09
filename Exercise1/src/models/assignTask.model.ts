import { Schema, Model, model } from "mongoose";
import { iAssignTask } from "../interfaces/index.interfaces";

const assignTaskSchema: Schema = new Schema<iAssignTask>({
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
    assignTo: {
        type: String,
        required: true,
    }
});

const AssignTask: Model<iAssignTask> = model<iAssignTask>("assignTask", assignTaskSchema);

export default AssignTask;