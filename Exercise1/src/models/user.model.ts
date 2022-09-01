import { Schema, Model, model } from "mongoose";
import iUser from "../interfaces/user.interface";

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

const User: Model<iUser> = model<iUser>("user", userSchema);
export default User;