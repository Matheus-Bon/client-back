const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { fetchUserByEmail, storeUser } = require("../models/User");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");


//  @route /login/
//  @method POST
const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new CustomError('Os campos não podem ser vazios', 400);
        return next(error);
    }

    const user = await fetchUserByEmail(email);
    if (!user) {
        const error = new CustomError('Usuário não encontrado', 404);
        return next(error);
    }

    const hash = user.get('credentials.password');
    const samePwd = bcrypt.compare(password, hash);

    if (!samePwd) {
        const error = new CustomError('Senha incorreta', 401);
        return next(error);
    }

    return res.status(200).json({
        status: 'success',
        data: {
            name: user.get('name'),
            phone: user.get('phone'),
            email: user.get('credentials.email'),
            role: user.get('role'),
        }
    })
});

//  @route /singup/
//  @method POST
const singUp = asyncErrorHandler(async (req, res, next) => {
    const user = {
        name: req.body.name,
        phone: req.body.phone,
        role: req.body.role,
        "credentials.email": req.body.email,
        "credentials.password": req.body.password,
    }
    const newUser = await storeUser(user);

    return res.status(201).json({
        sattus: 'success',
        data: {
            name: newUser.get('name'),
            phone: newUser.get('phone'),
            email: newUser.get('credentials.email'),
            role: newUser.get('role'),
        }
    })

});



module.exports = {
    login,
    singUp
}