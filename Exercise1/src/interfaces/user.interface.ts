import { Types, Document } from "mongoose";

interface iUser extends Document {
    _id: Types.ObjectId,
    email: string,
    password: string,
    fname: string,
    lname: string
}
export default iUser;