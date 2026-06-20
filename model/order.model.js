const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [

        {

            oneproduct: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

        }

    ],

    totalPrice: {
        type: Number,
        required: true
    },

    shippingAddress: {
        address: {
            type: String,
            required: true
        }

    },

    status: {
        type: String,
        enum: [
            "pending",
            "paid",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

const order = mongoose.model("Order", orderSchema);


module.exports = order;
