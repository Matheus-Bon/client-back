const express = require("express");

const { update } = require("../controllers/OrderController");

const router = express.Router();

router.patch('/orders', update);

module.exports = router;