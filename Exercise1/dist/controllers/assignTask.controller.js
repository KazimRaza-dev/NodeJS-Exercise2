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
exports.assignNewTask = void 0;
const joi_1 = __importDefault(require("joi"));
const user_model_1 = __importDefault(require("../models/user.model"));
const assignTask_model_1 = __importDefault(require("../models/assignTask.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
const _ = __importStar(require("lodash"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const loginUserEmail = "kazim@gmail.com";
const loginUserName = "Kazim Raza";
const assignNewTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assignTaskSchema = joi_1.default.object({
        taskTitle: joi_1.default.string().min(5).max(20).required(),
        description: joi_1.default.string().min(5).max(100).required(),
        dueDate: joi_1.default.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
        assignTo: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });
    const { error } = assignTaskSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newAssignTask = _.pick(req.body, ['taskTitle', 'description', 'dueDate']);
        const userExist = yield user_model_1.default.findOne({ email: req.body.assignTo });
        if (userExist) {
            newAssignTask.userId = userExist._id;
            newAssignTask.assignBy = loginUserEmail;
            const newTaskObj = new task_model_1.default(newAssignTask);
            const result = yield newTaskObj.save();
            return res.status(200).json({
                "message": "New Task Assigned.",
                "Task details": result
            });
        }
        else {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: "nodeexercise@gmail.com",
                    pass: "cvmcmvufwbyrhhid"
                }
            });
            const textToSent = loginUserName + " has assign you a task on NodeExercise website. Sign Up to view that Todo. You can register yourself at http://localhost:3001/user/register";
            var mailOptions = {
                from: 'nodeexercise@gmail.com',
                to: req.body.assignTo,
                subject: 'Node JS Exercise 1',
                text: textToSent,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        res.status(400).send(error);
                    }
                    else {
                        newAssignTask.assignBy = loginUserEmail;
                        newAssignTask.assignTo = req.body.assignTo;
                        const assignTaskObj = new assignTask_model_1.default(newAssignTask);
                        const result = yield assignTaskObj.save();
                        return res.status(200).json({
                            "message": "Email send & New Task Assigned.",
                            "Assign Task details": result
                        });
                    }
                });
            });
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.assignNewTask = assignNewTask;
