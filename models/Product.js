const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        category_id: { type: mongoose.Types.ObjectId },
        name: { type: String },
        description: { type: String },
        image: { type: String },
        price: { type: Number },
        active: { type: Boolean, default: true },
        max_items: { type: Number },
        flavors: { type: [mongoose.Types.ObjectId], ref: 'flavors' }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("products", schema);

const fetchAllProducts = async () => {
    const agg = [
        {
            $match: {
                active: true
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_info"
            }
        },
        {
            $unwind: "$category_info"
        },
        {
            $group: {
                _id: "$category_info.name",
                items: {
                    $push: {
                        _id: "$_id",
                        image: "$image",
                        name: "$name",
                        description: "$description",
                        price: "$price"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                items: 1
            }
        }
    ];

    const result = await Product.aggregate(agg);
    return result;
}

const fetchProductById = async (id) => {
    const agg = [
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(id)
            }
        },
        {
            '$lookup': {
                'from': 'flavors',
                'localField': 'flavors',
                'foreignField': '_id',
                'as': 'flavor',
                'pipeline': [
                    {
                        '$match': {
                            'active': true
                        }
                    }
                ]
            }
        },
        {
            '$unwind': {
                'path': '$flavor',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$group': {
                '_id': '$_id',
                'category_id': {
                    '$first': '$category_id'
                },
                'name': {
                    '$first': '$name'
                },
                'description': {
                    '$first': '$description'
                },
                'image': {
                    '$first': '$image'
                },
                'price': {
                    '$first': '$price'
                },
                'max_items': {
                    '$first': '$max_items'
                },
                'flavors': {
                    '$push': {
                        '_id': '$flavor._id',
                        'name': '$flavor.name'
                    }
                }
            }
        },
        {
            '$project': {
                'name': 1,
                'description': 1,
                'image': 1,
                'price': 1,
                'flavors': {
                    '$cond': {
                        'if': {
                            '$and': [
                                { '$isArray': '$flavors' },
                                { '$gt': [{ '$size': '$flavors' }, 0] }
                            ]
                        },
                        'then': '$flavors',
                        'else': []
                    }
                },
                'max_items': 1
            }
        }
    ];


    return await Product
        .aggregate(agg);
}

module.exports = {
    fetchAllProducts,
    fetchProductById
}