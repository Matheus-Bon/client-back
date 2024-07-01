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

const Flavor = mongoose.model("flavors", schema);

const fetchFlavorById = async(id) => {
    return await Flavor.findById(id);
}

module.exports = {
    fetchFlavorById
}