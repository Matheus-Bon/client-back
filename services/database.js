const mongoose = require('mongoose');

const URI = process.env.URI;

const main = async () => {
    try {
        await mongoose.connect(URI);
    } catch (error) {
        throw Error(error)
    }
}

module.exports = main;