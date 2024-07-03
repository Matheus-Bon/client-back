const mongoose = require("mongoose");
const { Schema } = mongoose;

const { Order } = require('./Order');

const responseHistory = new Schema({
    nickname: { type: String },
    address: { type: String }
}, { _id: false });

const handleRoutines = new Schema({
    choosing_address: { type: Boolean, default: true },
    number_question_address: { type: Number, default: 0 },
    see_menu: { type: Boolean, default: true },
    link_sent: { type: Boolean, default: false },

}, { _id: false });

const address = new Schema({
    nickname: { type: String, unique: true },
    address: { type: String },
    location: {
        lat: { type: String },
        lng: { type: String },
    },
});

const credentialsSchema = new Schema({
    email: { type: String },
    password: { type: String }
}, { _id: false });

const schema = new Schema(
    {
        name: { 
            type: String 
        },
        phone: { type: String, maxLength: 13, index: { unique: true } },
        current_order_id: { type: mongoose.Types.ObjectId, ref: 'orders' },
        role: { type: String, enum: ['admin', 'clerk', 'user', 'deliveryMan'] },
        credentials: credentialsSchema,
        adresses: { type: [address], default: [] },
        handle_routines: handleRoutines,
        response_history: responseHistory
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("users", schema);

const fetchUserById = async (id) => {
    return await User
        .findById(id)
        .populate('current_order_id')
        .select({
            name: 1,
            current_order_id: 1
        })
}

module.exports = {
    fetchUserById
}