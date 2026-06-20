const asyncWrapper = require("../middlewares/asyncWrapper");
const user = require("../model/users.model");
const appError = require("../utils/appError");
const { FAIL, SUCCESS } = require("../utils/httpsstatus");


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");





const register = asyncWrapper(async (req , res , next)=>{
    const {name , email , password } = req.body;
    if(!name || !email || !password){
        const error = new appError("all field required" , 400 , FAIL)
        return next(error);
    }
    const existUser = await user.findOne({ email });

    if (existUser) {
        const error = new appError("email already exists",400,FAIL)
        return next(error);
    }

    const hashpassword = await bcrypt.hash(password , 10);
    const newuser = await user.create({
        name,
        email,
        password : hashpassword,
        role : "user"
    })


    


    const token = await jwt.sign(
        {
            id : newuser._id,
            "role" : newuser.role
        },
        process.env.JWT_KEY
        ,{
            expiresIn : "7d"
        });
    
        newuser.password = undefined;
        const userObject = newuser.toObject();
        delete userObject.password;
        res.status(201)
        .json({
            state : SUCCESS,
            message : "users is created!...",
            data : userObject,
            token : token
        });
});



const login = asyncWrapper(async(req , res , next)=>{
    const {email , password} = req.body;
    if(!email || !password){
        const error = new appError("all field required" , 400 , FAIL)
        return next(error);
    }
    const oneuser = await user.findOne({email});
    if(!oneuser){
        const error = new appError("email not found" , 404 , FAIL)
        return next(error);
    }
    const ismatch = await bcrypt.compare(password , oneuser.password);
    if(!ismatch){
        const error = new appError("email  or paassword invaild  " , 404 , FAIL)
        return next(error);
    }
    const token = await jwt.sign(
        {
            id : oneuser._id,
            "role" : oneuser.role
        },
        process.env.JWT_KEY
        ,{
            expiresIn : "7d"
        });
    const userObject = oneuser.toObject();
    delete userObject.password;
    res.json({
        state : SUCCESS,
        message : "login completed!...",
        data : userObject,
        token : token
    });
})


const getusers = asyncWrapper(async (req , res ,next)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const users = await user.find({} ,{"__v" : false}).limit(limit).skip((page-1)*limit);
    if(users.length === 0){
        const error = new appError("not found users" , 404 , FAIL)
        return next(error);
    }
    res.json({
            state : SUCCESS,
            message : "data of users",
            data : users,
        });
})

const deleteUser =  asyncWrapper(async(req , res ,next)=>{
    const id = req.params.id
    const deleteUser = await user.findByIdAndDelete(id);
    if(!deleteUser){
        const error = new appError("not found user" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "user is deleted",
        data : deleteUser
    });
})


module.exports = {
    register,
    getusers,
    deleteUser,
    login
}