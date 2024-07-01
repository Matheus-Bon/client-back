const { fetchAllProducts, fetchProductById } = require("../models/Product")

//  @route /products
//  @method GET
const index = async (req, res) => {
    const products = await fetchAllProducts();
    return res.status(200).json({ error: null, data: products });
}

//  @route /products/:id
//  @method GET
const show = async (req, res) => {
    const productId = req.params.id;
    const [product] = await fetchProductById(productId);

    const flavors = product.flavors;

    if (flavors.length == 1) {
        const items = Object.keys(flavors[0]);
        if (!items.length) {
            product.flavors.pop();
        }
    }

    return res.status(200).json({ error: null, data: product });
}

module.exports = {
    index,
    show
}