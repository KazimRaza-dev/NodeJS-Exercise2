import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

const handleError = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof Error)
        return res.status(400).send(error.message);

    return res.status(500).send("Server Error! Something went wrong.");
};

export default handleError;