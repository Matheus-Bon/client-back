const { fetchUserById } = require("../models/User");

const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require('../utils/asyncErrorHandler');

//  @route /users/:id
//  @method GET
const show = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.id;

    const user = await fetchUserById(userId)

    if (!user) {
        const error = new CustomError('User with that ID is not found', 404);
        return next(error);
    }

    const orderId = user.get('current_order_id');
    if (!orderId) {
        const error = new CustomError('User does not have a order id', 404);
        return next(error);
    }

    const orderStatus = user.get('current_order_id.status');
    if (orderStatus !== 'pending') {
        const error = new CustomError('This ordering has been completed', 403);
        return next(error);
    }

    const response = {
        _id: user.get('_id'),
        name: user.get('name'),
        orderId: user.get('current_order_id._id'),
        orderStatus: user.get('current_order_id.status')
    };

    return res.status(200).json({ status: 'success', data: response });
})

module.exports = {
    show
}