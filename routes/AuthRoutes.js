const express = require("express");

const { login, singUp } = require("../controllers/AuthController");

const router = express.Router();

router.route('/login')
    .post(login)

router.route('/singup')
    .post(singUp)

module.exports = router;