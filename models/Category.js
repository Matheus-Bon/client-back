const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model("categories", schema);

