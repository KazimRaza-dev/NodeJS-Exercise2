import { Types, Document } from "mongoose";

interface iUser extends Document {
    _id: Types.ObjectId,
    email: string,
    password: string,
    fname: string,
    lname: string,
    role: string,
    generateAuthToken: Function
}
export default iUser;