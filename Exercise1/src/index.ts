import express, { Express } from "express";
import * as dotenv from "dotenv";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.routes"
import loggingApiRequests from "./middlewares/loggingRequests";
import errorHandler from "./middlewares/error-handler.middleware";
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

const PORT: number = parseInt(process.env.PORT as string, 10);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const corsOptions: CorsOptions = {
    origin: `http://localhost:${PORT}`,
    methods: "HEAD, PUT, PATCH, POST, DELETE",
}
app.use(cors(corsOptions));

app.use(loggingApiRequests);
app.use(routes);
//middleware to handle errors
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})