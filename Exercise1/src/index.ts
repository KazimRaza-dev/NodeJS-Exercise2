import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import routes from "./routes/routes"
import loggingApiRequests from "./middlewares/loggingRequests";
import connectToMongoDB from "./config/config";
connectToMongoDB();

dotenv.config();
const app: Express = express();
if (!process.env.PORT) {
    console.log("Exiting program..");
    process.exit(1);
}
if (!process.env.jwtPrivateKey) {
    console.log("FATAL ERROR! jwt private key not defined.");
    process.exit(1);
}
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(loggingApiRequests);
app.use(routes);

const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})