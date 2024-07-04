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

    if (!product.length) {
        const error = new CustomError('Product with that ID is not found', 404);
        return next(error);
    }
    
    return res.status(200).json({ status: 'success', data: product[0] });
})


module.exports = {
    index,
    show
}