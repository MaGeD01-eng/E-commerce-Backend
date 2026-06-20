const { JsonWebTokenError } = require("jsonwebtoken")
const appError = require("../utils/appError")
const { ERROR } = require("../utils/httpsstatus")
const jwt = require("jsonwebtoken")




const protectroute = (req , res ,next)=>{
    try{
        const authheader = req.headers.authorization;
        if(!authheader || !authheader.startsWith("Bearer ")){
            const error = new appError("no token" , 401 , ERROR)
            return next(error);
        }
        const token = authheader.split(" ")[1];
        const decoded = jwt.verify(token , process.env.JWT_KEY);

        req.user = decoded;
        next();
    }
    catch(err){
        const error = new appError(err.message , 401 , ERROR)
        return next(error);
    }   
}

module.exports = protectroute;