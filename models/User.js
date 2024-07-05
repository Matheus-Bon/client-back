const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isAlpha, isEmail, isStrongPassword } = require('validator');

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
    nickname: { type: String },
    address: { type: String },
    location: {
        lat: { type: String },
        lng: { type: String },
    },
});

const credentialsSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email é um campo obrigatório'],
        unique: true,
        validate: [isEmail, 'Email deve ser válido']
    },
    password: {
        type: String,
        required: [true, 'Senha é um campo obrigatório'],
        validate: [isStrongPassword, 'Senha não cumpre os requisitos'],
        minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
    }
}, { _id: false });

const schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Nome é um campo obrigatório'],
            validate: [isAlpha, "Nome precisa ser válido"]
        },
        phone: {
            type: String,
            maxlength: [13, "Contato deve ter 13 caracteres"],
            unique: true
        },
        current_order_id: { type: mongoose.Types.ObjectId, ref: 'orders' },
        role: {
            type: String,
            enum: {
                values: ['admin', 'clerk', 'user', 'deliveryMan'],
                message: "Esse cargo não existe"
            }
        },
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
    fetchUserById,
}