const { fetchUserById } = require("../models/User");

//  @route /users/:id
//  @method GET
const show = async (req, res) => {
    const userId = req.params.id;

    let response;

    if (userId.length !== 24) {
        response = 'Id fora dos padrões';
        return res.status(400).json({ error: response, data: null });
    }

    const user = await fetchUserById(userId);
    if (!user) {
        response = 'Usuário não encontrado';
        return res.status(404).json({ error: response, data: null });
    }

    const orderId = user?.get('current_order_id');
    if (!orderId) {
        response = 'Pedido não encontrado';
        return res.status(404).json({ error: response, data: null });
    }

    const orderStatus = user?.get('current_order_id.status');
    if (orderStatus !== 'pending') {
        response = 'Este pedido já foi concluído. Tente criar outro.';
        return res.status(403).json({ error: response, data: null });
    }

    response = {
        _id: user?.get('_id'),
        name: user?.get('name'),
        orderId: user?.get('current_order_id._id'),
        orderStatus: user?.get('current_order_id.status')
    };

    return res.status(200).json({ error: null, data: response });
}

module.exports = {
    show
}