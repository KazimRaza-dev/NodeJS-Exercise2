"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assignTaskSchema = new mongoose_1.Schema({
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
    assignTo: {
        type: String,
        required: true,
    }
});
const AssignTask = (0, mongoose_1.model)("assignTask", assignTaskSchema);
exports.default = AssignTask;
