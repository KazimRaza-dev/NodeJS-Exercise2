import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface userRequest extends Request {
    user: any
}
const auth = (req: userRequest, res: Response, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.')
    }
}

export default auth;