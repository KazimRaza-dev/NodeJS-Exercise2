import express, { Express } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./routes/index.routes"
import { loggingApiRequests } from "./middlewares/index.middleware";
import { connectToMongoDb } from "./config/index.config";

dotenv.config();
connectToMongoDb();
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10);

const corsOptions: CorsOptions = {
    origin: `http://localhost:${PORT}`,
    methods: "HEAD, PUT, PATCH, POST, DELETE",
}
app.use(cors(corsOptions));

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
app.use(fileUpload());
app.use(loggingApiRequests);
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})