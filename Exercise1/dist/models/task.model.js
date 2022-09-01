"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        ref: 'users'
    }
});
const Task = (0, mongoose_1.model)("task", taskSchema);
exports.default = Task;
