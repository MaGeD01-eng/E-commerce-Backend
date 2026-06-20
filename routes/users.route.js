const express = require("express");
const { register, getusers, deleteUser, login } = require("../controller/user.controller");
const protectroute = require("../middlewares/protectAuth");
const allow = require("../middlewares/rolemiddelware");

const routerUser = express.Router();




routerUser.post("/api/auth/register" , register);
routerUser.post("/api/auth/login" , login);
routerUser.get("/api/get" , protectroute , allow("admin") , getusers);
routerUser.delete("/api/delete/:id" , protectroute , allow("admin") , deleteUser)

module.exports = routerUser;