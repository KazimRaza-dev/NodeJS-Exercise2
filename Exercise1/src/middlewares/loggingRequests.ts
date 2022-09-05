import { Request, Response } from "express";
import fs from "fs";
var path = require('path');

const loggingApiRequests = (request: Request, response: Response, next) => {
    try {
        const { rawHeaders, httpVersion, method, socket, url } = request;
        const { remoteAddress, remoteFamily } = socket;
        const logData =
            `TimeStamp: ${Date.now()}\nRawHeaders: ${JSON.stringify(rawHeaders)}\nhttpVersion: ${httpVersion}\nmethod: ${method}\nRemoteAddress: ${remoteAddress}\nRemoteFamily: ${remoteFamily}\nurl: ${url}\n\n`;

        var filePath = path.join(__dirname, '..', 'requestLogging', 'logs.txt');
        fs.appendFile(filePath, logData, 'utf8',
            function (err) {
                if (err) throw err;
            });
        next();
    }
    catch (ex) {
        return response.status(500).send('Error while logging request to file.')
    }
}

export default loggingApiRequests;