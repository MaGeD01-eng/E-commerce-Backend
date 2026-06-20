const express = require("express");
const { postCategory, getCategory, putCategory, deletecategory, getIdCategory } = require("../controller/category.controller");
const protectroute = require("../middlewares/protectAuth");
const allow = require("../middlewares/rolemiddelware");

const routercategory = express.Router();


routercategory.get("/api/get",getCategory);
routercategory.get("/api/get/:id",getIdCategory);


routercategory.post("/api/post",protectroute , allow("admin"),postCategory);
routercategory.put("/api/patch/:id",protectroute , allow("admin"),putCategory);
routercategory.delete("/api/delete/:id",protectroute , allow("admin"),deletecategory);


module.exports = routercategory;