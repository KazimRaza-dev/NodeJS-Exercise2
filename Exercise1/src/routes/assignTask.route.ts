import express, { Express, Request, Response } from "express";
const assignTaskRouter = express.Router();
import * as assignTaskController from "../controllers/assignTask.controller";

assignTaskRouter.post("/", assignTaskController.assignNewTask)

export default assignTaskRouter;