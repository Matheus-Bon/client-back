const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const globalErrorHandler = require('./controllers/ErrorController');

const ProductRoutes = require('./routes/ProductRoutes');
const UserRoutes = require('./routes/UserRoutes');
const OrderRoutes = require('./routes/OrderRoutes');



const whitelist = [''];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());

app.use(ProductRoutes);
app.use(UserRoutes);
app.use(OrderRoutes);

app.all('*', (req, res, next) => {
    res.status(500).json({
        status: 'fail', 
        message: "Essa rota não existe"
    })
})

app.use(globalErrorHandler);

module.exports = app;