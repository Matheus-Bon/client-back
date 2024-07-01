const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    id: { type: mongoose.Schema.ObjectId },
    name: { type: String },
    quantity: { type: Number },
    total_price_product: { type: Number },
    flavors: [
        {
            id: { type: mongoose.Schema.ObjectId },
            name: { type: String },
            quantity: { type: Number },
            total_price_flavor: { type: Number },
        }
    ]
}, { _id: false })

const schema = new Schema(
    {
        order_code: { type: String, index: { unique: true } },
        address_id: { type: mongoose.Schema.ObjectId },
        total_price: { type: Number, default: 0 },
        payment_method: { type: String, enum: ['DEBIT', 'CREDIT', 'CASH', 'PIX'] },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'completed', 'canceled'],
            default: 'pending'
        },
        delivery: { type: Boolean, default: true },
        products: { type: [productSchema] }
    },
    {
        timestamps: true,
    }
);

const generateOrderCode = () => {
    const now = Date.now().toString();
    const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return (now.slice(-4) + randomPart).slice(-6);
}

schema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        if (update.order_code) return next();

        let newOrderCode = generateOrderCode();
        let orderExists = await mongoose.models.orders.findOne({ order_code: newOrderCode });

        while (orderExists) {
            newOrderCode = generateOrderCode();
            orderExists = await mongoose.models.orders.findOne({ order_code: newOrderCode });
        }

        this.setUpdate({ ...update, order_code: newOrderCode });
        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model("orders", schema);

const updateOrder = async (id, update) => {
    return await Order
        .findByIdAndUpdate(id, update, { new: true });
}

module.exports = {
    Order,
    updateOrder
}