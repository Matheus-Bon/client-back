const CustomError = require("../utils/CustomError");

const castErrorHandler = (err, statusCode) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, statusCode);
}

const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            statusCode: error.statusCode,
            status: 'error',
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}


module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (error.name = 'CastError') {
        error = castErrorHandler(error, error.statusCode)
    }

    prodErrors(res, error);
}