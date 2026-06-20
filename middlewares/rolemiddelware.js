const appError = require("../utils/appError")
const { ERROR } = require("../utils/httpsstatus")

const allow = (...role)=>{
    return(req , res , next)=>{
        if(!role.includes(req.user.role)){
            const error = new appError("Access denied" , 403 , ERROR)
            return next(error);
        }
        next();
    }
}

module.exports = allow;