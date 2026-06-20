const express = require("express");
const protectroute = require("../middlewares/protectAuth");
const allow = require("../middlewares/rolemiddelware");
const { createOrder, getMyOrders, updateMyOrders, deleteOrder } = require("../controller/order.controller");

const routerorder = express.Router();


routerorder.post("/api/post",protectroute ,createOrder);
routerorder.get("/api/get",protectroute,getMyOrders);
routerorder.patch("/api/patch/:id",protectroute,updateMyOrders)
routerorder.delete("/api/delete/:id",protectroute,deleteOrder)




module.exports = routerorder;