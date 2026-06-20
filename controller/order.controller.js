const asyncWrapper = require("../middlewares/asyncWrapper");
const order = require("../model/order.model");
const product = require("../model/Products.model");
const appError = require("../utils/appError");
const { FAIL, SUCCESS } = require("../utils/httpsstatus");

const createOrder = asyncWrapper(async(req , res , next)=>{
    const { products, shippingAddress } = req.body;
    if(!products || products.length === 0){
        const error = new appError("products not exist" , 400 , FAIL)
        return next(error);
    }
    let orderProducts = [];
    let totalPrice = 0;

    for(const item of products){
        const oproduct = await product.findById(item.oneproduct);
        if(!oproduct){
            const error = new appError("products not found" , 404 , FAIL)
            return next(error);
        }
        
        if(item.quantity > oproduct.quantity){
            const error = new appError("quantity not enough" , 400 , FAIL)
            return next(error);
        }
        
        orderProducts.push({
            oneproduct : oproduct._id,
            quantity : item.quantity,
            price : oproduct.price
        })

        oproduct.quantity -= item.quantity; 
        await oproduct.save();

        totalPrice += oproduct.price * item.quantity; 
    }
    
    const neworder = await order.create({
        user : req.user.id,
        products : orderProducts,
        totalPrice : totalPrice,
        shippingAddress : shippingAddress
    })

    res.status(201).json({
        state : SUCCESS,
        message : "order is created!...",
        data : neworder
    });
});

const getMyOrders = asyncWrapper(async (req, res) => {
    const orders = await order.find({
        user: req.user.id
    }).populate("products.oneproduct");

    res.status(200).json({
        status: SUCCESS,
        message : "my order!...",
        data: orders
    });
});


const updateMyOrders = asyncWrapper(async (req, res, next) => {
    const updatedOrder = await order.findOneAndUpdate(
        {_id :req.params.id ,user:req.user.id}, 
        { status: "paid" }, 
        { returnDocument: 'after' }
    );

    if (!updatedOrder) {
        const error = new appError("Order not found or unauthorized", 404, FAIL);
        return next(error);
    }

    res.json({
        state: SUCCESS,
        message: "Order paid, please wait for us to contact you",
        data: updatedOrder
    });
});

const deleteOrder = asyncWrapper(async (req, res, next) => {
    const targetOrder = await order.findById(req.params.id);

    if (!targetOrder) {
        return next(new appError("Order not found", 404, FAIL));
    }

    // السماح فقط لصاحب الأوردر أو الأدمن
    const isOwner = targetOrder.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return next(new appError("Access denied", 403, FAIL));
    }

    // اليوزر العادي يقدر يحذف بس لو الأوردر لسه pending
    if (isOwner && !isAdmin && targetOrder.status !== "pending") {
        return next(new appError("Cannot delete an order that is already processed", 400, FAIL));
    }

    const deleteorder = await order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: SUCCESS,
        message: "Order deleted successfully",
        data: deleteorder
    });
});



module.exports = {
    createOrder,
    getMyOrders,
    updateMyOrders,
    deleteOrder
}