import express, { Express, Request, Response } from "express";
const assignTaskRouter = express.Router();
import * as assignTaskController from "../controllers/assignTask.controller";
import authMiddleware from "../middlewares/auth";

assignTaskRouter.post("/", authMiddleware, assignTaskController.assignNewTask)

export default assignTaskRouter;