import { connect } from "mongoose";

const connectToMongoDB = () => {
    connect("mongodb://localhost:27017/exercise1")
        .then(() => console.log("Connected to MongoDB.."))
        .catch((error) => {
            console.log("Error in connecting to mongoDB " + error)
            return process.exit(1);
        });
}

export default connectToMongoDB;