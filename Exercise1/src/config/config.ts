import { connect } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectToMongoDb = () => {
    const connectionStr: string = process.env.DB_host + process.env.DB_name;
    connect(connectionStr)
        .then(() => console.log(`Connected to ${connectionStr}..`))
        .catch((error) => {
            console.log("Error in connecting to mongoDB " + error)
            throw error;
        });
}

export default connectToMongoDb;