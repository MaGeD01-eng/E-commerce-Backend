const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price : {
        type : Number,
        required : true,
        trim : true,
    },
    quantity : {
        type : Number,
        default : 0
    },
    image : [
        {
            type : String
        }
    ],
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "category",
        required : true
    }
}

, {
    timestamps: true
});


const product = mongoose.model("product" , productSchema);


module.exports = product;