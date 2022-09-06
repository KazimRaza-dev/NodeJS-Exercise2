import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface userRequest extends Request {
    user: any
}
const adminAuth = (req: userRequest, res: Response, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decodedToken = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decodedToken;
        if (req.user.role !== "admin") {
            return res.status(401).send("Access denied. Only Admin can call this API.");
        }
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.')
    }
}

export default adminAuth;