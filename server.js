require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/DB");
const routercategory = require("./routes/category.route");
const appError = require("./utils/appError");
const { ERROR } = require("./utils/httpsstatus");
const routerProduct = require("./routes/product.route");
const routerUser = require("./routes/users.route");
const routerorder = require("./routes/order.route");






//database
connectDB();


//application
const app = express();
app.use(cors());
app.use(express.json());

// upload images
app.use("/uploads" , express.static("uploads"))


//routes
app.use("/category", routercategory)
app.use("/product" , routerProduct)
app.use("/user" , routerUser)
app.use("/order" , routerorder)


//global error for routes
app.use((req , res , next)=>{
    const error = new appError("URL not found" , 404 , ERROR)
    return next(error);
});



//global error handeling
app.use((error,req , res ,next)=>{
    return res.status(error.statusCode || 500)
    .json({
        state : error.statusText ||  ERROR,
        message : error.message ,
        code : error.statusCode || 500 
    });
    
})











app.listen(process.env.PORT || 3000, ()=>{
    console.log("server running!...");
});