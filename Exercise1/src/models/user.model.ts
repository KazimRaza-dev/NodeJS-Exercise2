import { Schema, Model, model } from "mongoose";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { iUser } from "../interfaces/index.interfaces";
dotenv.config();

const userSchema: Schema = new Schema<iUser>({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "member"]
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email, name: this.fname + " " + this.lname, role: this.role }, process.env.jwtPrivateKey, { expiresIn: '2h' });
    return token;
}

const User: Model<iUser> = model<iUser>("user", userSchema);
export default User;
