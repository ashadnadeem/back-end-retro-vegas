export const Response = (header, body = {}) => {
    return {
        header: header,
        body: body,
    };
}

export const Header = (error, errorCode = null, errorMessage = null) => {
    return {
        error: error,
        errorCode: errorCode,
        errorMessage: errorMessage,
    };
}