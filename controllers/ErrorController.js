const CustomError = require("../utils/CustomError");

const castErrorHandler = (err, statusCode) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, statusCode);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join(' - ');
    return new CustomError(errorMessages, 400);
}

const duplicateKeyErrorHandler = (err) => {
    const msg = `Já existe um item com essa nomenclatura`;

    return new CustomError(msg, 400);
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

    // res.json(error)

    if (error.name === 'CastError') error = castErrorHandler(error, error.statusCode);
    if (error.name === 'ValidationError') error = validationErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    prodErrors(res, error);
}