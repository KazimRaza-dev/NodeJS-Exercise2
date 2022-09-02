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
exports.loginUser = exports.registerUser = void 0;
const _ = __importStar(require("lodash"));
const user_model_1 = __importDefault(require("../models/user.model"));
const assignTask_model_1 = __importDefault(require("../models/assignTask.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
const joi_1 = __importDefault(require("joi"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSchema = joi_1.default.object({
        email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        fname: joi_1.default.string().required(),
        lname: joi_1.default.string().required(),
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        let newUser = _.pick(req.body, ['email', 'password',
            'fname', 'lname']);
        const alreadyExist = yield user_model_1.default.findOne({ email: newUser.email });
        if (alreadyExist) {
            return res.status(400).send("Email already Exist.");
        }
        const user = new user_model_1.default(newUser);
        const result = yield user.save();
        const userId = result._id;
        const assignedTasks = yield assignTask_model_1.default.find({ assignTo: newUser.email });
        assignedTasks.map((task) => __awaiter(void 0, void 0, void 0, function* () {
            let newTask = _.pick(task, ['taskTitle', 'description', 'dueDate', 'assignBy']);
            newTask.userId = userId;
            const user = new task_model_1.default(newTask);
            yield user.save();
        }));
        yield assignTask_model_1.default.deleteMany({ assignTo: newUser.email });
        const token = result.generateAuthToken();
        res.header('x-auth-token', token).status(200).send({
            "Account details": result,
            "Assigned Tasks": assignedTasks
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const joiSchema = joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    });
    const { error } = joiSchema.validate(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    }
    try {
        const user = _.pick(req.body, ["email", "password"]);
        const result = yield user_model_1.default.findOne({ email: user.email, password: user.password });
        if (result) {
            const token = result.generateAuthToken();
            return res.header('x-auth-token', token).status(200).json({
                "message": "successfully login",
                "result": result,
            });
        }
        return res.status(400).send("Invalid Email or password");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.loginUser = loginUser;
