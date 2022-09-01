"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTasks = exports.deleteTask = exports.editTask = exports.addTask = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const joi_1 = __importDefault(require("joi"));
const _ = __importStar(require("lodash"));
const userId = "630efb256a050af50ce3bb28";
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskSchema = joi_1.default.object({
        taskTitle: joi_1.default.string().min(5).max(20).required(),
        description: joi_1.default.string().min(5).max(100).required(),
        dueDate: joi_1.default.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
    });
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newTask = _.pick(req.body, ['taskTitle', 'description',
            'dueDate']);
        newTask.userId = userId;
        newTask.assignBy = "self";
        const user = new task_model_1.default(newTask);
        const result = yield user.save();
        res.status(200).json({
            "message": "New Task Added.",
            "Task details": result
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.addTask = addTask;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskSchema = joi_1.default.object({
        taskTitle: joi_1.default.string().min(5).max(20),
        description: joi_1.default.string().min(5).max(100),
        dueDate: joi_1.default.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/),
    });
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        const taskId = req.params.id;
        let updatedTask = yield task_model_1.default.findOneAndUpdate({ _id: taskId }, req.body, {
            new: true
        });
        if (updatedTask) {
            return res.status(200).send({
                message: "Task successfully Edited.",
                "Edited task": updatedTask
            });
        }
        return res.status(200).send(`Task with id ${taskId} does not exists.`);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.editTask = editTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        let taskDeleted = yield task_model_1.default.findByIdAndDelete(taskId);
        if (taskDeleted) {
            return res.status(200).send({
                message: "Task deleted",
                Task: taskDeleted
            });
        }
        return res.status(400).send(`Task with id ${taskId} does not exists.`);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.deleteTask = deleteTask;
const getUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const userTasks = yield task_model_1.default.find({ userId: userId }).select('taskTitle description dueDate assignBy');
        if (userTasks.length > 0) {
            return res.status(200).send(userTasks);
        }
        res.status(200).send("No Tasks exist for this user.");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getUserTasks = getUserTasks;
