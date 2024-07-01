const { fetchClientByName } = require("../models/ClientSetting");
const { fetchFlavorById } = require("../models/Flavor");
const { updateOrder } = require("../models/Order");
const { fetchProductById } = require("../models/Product");
const { fetchUserById } = require("../models/User");

//  @route /orders
//  @method PATCH
const update = async (req, res) => {
    const { userId, payment, products } = req.body;

    if (!userId || userId.length !== 24) {
        return res.status(400).json({ error: 'Id do usuário indefindo', data: null });
    }

    const user = await fetchUserById(userId);
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado', data: null });
    }

    const methods = ['PIX', 'CASH', 'DEBIT', 'CREDIT']
    if (!payment || !methods.includes(payment)) {
        return res.status(400).json({ error: 'Método de pagamento deve ser válido', data: null });
    }

    if (!products.length) {
        return res.status(400).json({ error: 'Carrinho não pode ser vazio', data: null });
    }

    const rate = await fetchClientByName('Bocadinhas')
        .then(data => data.get('company_config.rate'));

    const order = [];
    let total = rate;
    for (item of products) {
        const newProduct = {};

        const [product] = await fetchProductById(item.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado', data: null });
        }

        newProduct.id = product._id;
        newProduct.name = product.name;

        const realPrice = product.price;
        const itemTotal = item.itemTotal;
        const qty = itemTotal / realPrice;

        newProduct.quantity = qty;
        newProduct.total_price_product = realPrice * qty;

        const maxItems = product.max_items;
        newProduct.flavors = [];

        if (item.itemVariants) {
            for (el of item.itemVariants) {
                const flavor = await fetchFlavorById(el.id);
                if (!flavor) {
                    return res.status(404).json({ error: 'Sabor não encontrado', data: null });
                }

                const pricePerItem = realPrice / maxItems;
                const quantity = el.quantity;

                newProduct.flavors.push({
                    id: flavor.get('_id'),
                    name: flavor.get('name'),
                    quantity,
                    total_price_flavor: pricePerItem * quantity
                });
            }
        }

        total += newProduct.total_price_product;
        order.push(newProduct);
    }

    const orderId = user.get('current_order_id');
    const update = {
        total_price: total,
        payment_method: payment,
        products: order
    }
    const newOrder = await updateOrder(orderId, update);

    res.status(200).json({ error: null, data: newOrder.get('order_code') })
}

module.exports = {
    update
}