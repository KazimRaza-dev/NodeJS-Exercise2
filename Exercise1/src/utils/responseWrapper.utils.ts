interface iResponse {
    message: string
    statusCode: number
}

const responseWrapper = (statusCode: number, msg: string) => {
    const response: iResponse = {
        statusCode: statusCode,
        message: msg
    }
    return response;
}

export default responseWrapper;