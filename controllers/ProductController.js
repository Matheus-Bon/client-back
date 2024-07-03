const { fetchAllProducts, fetchProductById } = require("../models/Product");

const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require('../utils/asyncErrorHandler');


//  @route /products
//  @method GET
const index = asyncErrorHandler(async (req, res, next) => {
    const products = await fetchAllProducts();
    return res.status(200).json({ status: 'success', data: products });
})

//  @route /products/:id
//  @method GET
const show = asyncErrorHandler(async (req, res, next) => {
    const productId = req.params.id;
    const product = await fetchProductById(productId);

    if (!product) {
        const error = new CustomError('Product with that ID is not found', 404);
        return next(error);
    }

    const flavors = product.flavors;

    if (flavors.length == 1) {
        const items = Object.keys(flavors[0]);
        if (!items.length) {
            product.flavors.pop();
        }
    }

    return res.status(200).json({ status: 'success', data: product });
})


module.exports = {
    index,
    show
}