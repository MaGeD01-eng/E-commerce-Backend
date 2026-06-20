const express = require("express");
const { postProducts, getProducts, getIdProduct, patchProduct , deleteProduct} = require("../controller/product.controller");
const protectroute = require("../middlewares/protectAuth");
const allow = require("../middlewares/rolemiddelware");
const upload = require("../middlewares/uploadimage");

const routerProduct = express.Router();


routerProduct.get("/api/get" , getProducts);
routerProduct.get("/api/get/:id" , getIdProduct);

routerProduct.post("/api/post" , protectroute , allow("admin") ,upload.array('image' , 5) ,postProducts);
routerProduct.patch("/api/patch/:id" ,protectroute , allow("admin"), upload.array('image' , 5) ,patchProduct);
routerProduct.delete("/api/delete/:id" ,protectroute , allow("admin") ,deleteProduct);

module.exports = routerProduct;