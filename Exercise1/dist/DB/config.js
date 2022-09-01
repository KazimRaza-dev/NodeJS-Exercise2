"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectToMongoDB = () => {
    (0, mongoose_1.connect)("mongodb://localhost:27017/exercise1")
        .then(() => console.log("Connected to MongoDB.."))
        .catch((error) => {
        console.log("Error in connecting to mongoDB " + error);
        return process.exit(1);
    });
};
exports.default = connectToMongoDB;
