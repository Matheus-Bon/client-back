const express = require("express");

const { show } = require("../controllers/UserController");

const router = express.Router();

router.get('/users/:id', show);


module.exports = router;