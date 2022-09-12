import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Schema, Model, model } from "mongoose";
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
        minLength: 5,
        maxLength: 12
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
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email, name: this.fname + " " + this.lname }, process.env.jwtPrivateKey, { expiresIn: '2h' });
    return token;
}

const User: Model<iUser> = model<iUser>("user", userSchema);
export default User;