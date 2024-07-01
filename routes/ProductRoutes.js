const express = require("express");

const { index, show } = require("../controllers/ProductController");

const router = express.Router();

router.get('/products', index);
router.get('/products/:id', show);


module.exports = router;