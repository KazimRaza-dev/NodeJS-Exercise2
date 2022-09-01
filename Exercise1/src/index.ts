import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
import assignTaskRouter from "./routes/assignTask.route";
import connectToMongoDB from "./DB/config";
connectToMongoDB();


dotenv.config();
// console.log(process.env.PORT);
if (!process.env.PORT) {
    console.log("Exiting program..");
    process.exit(1);
}

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", (req: Request, res: Response) => {
    res.send("hello worlds");
})
app.use("/user", userRouter);
app.use("/task", taskRouter);
app.use("/assigntask", assignTaskRouter)
const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})