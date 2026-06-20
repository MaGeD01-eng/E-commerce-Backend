const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../model/category.model");
const product = require("../model/Products.model");
const appError = require("../utils/appError");
const { FAIL, SUCCESS } = require("../utils/httpsstatus");





const postProducts  = asyncWrapper(async(req , res ,next)=>{
        const {title , price , quantity , category} = req.body;

        
        if(!title || !price  || !quantity || !category){
                const error = new appError("all field are required" , 400 , FAIL);
                return next(error);
        }
        if (!req.files || req.files.length === 0) {
                const error = new appError("Please upload at least one image" , 400 , FAIL);
                return next(error);
        }
        const selectcategory = await Category.findById(category);
        if(!selectcategory){ 
                const error = new appError("not found category" , 404 , FAIL);
                return next(error);
        }

        const imageUrls = req.files.map(file => file.path);
        const newproduct = await product.create({
                title,
                price,
                quantity,
                image : imageUrls,
                category
                
        });
        res.status(201)
        .json({
                state : SUCCESS,
                message : "product created!...",
                data : newproduct
        });
})



const getProducts = asyncWrapper(async(req , res,next)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const products = await product.find({} ,{"__v" : false}).limit(limit).skip((page-1)*limit).populate("category", "title");
    if(products.length === 0){
        const error = new appError("not found categories" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "informaton of categoris",
        data : products
    });
})



const getIdProduct = asyncWrapper(async(req , res , next)=>{
    const id = req.params.id
    const oneproduct = await product.findById(id).populate("category" , "title");
    if(!oneproduct){
        const error = new appError("not found product" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "informaton of category",
        data : oneproduct
    });
})



const patchProduct = asyncWrapper(async(req , res , next)=>{
    const id = req.params.id;

    const existingProduct = await product.findById(id);
    if(!existingProduct){
        const error = new appError("not found product" , 404 , FAIL);
        return next(error);
    }

    const updateData = { ...req.body };

    if(req.files && req.files.length > 0){
        updateData.image = req.files.map(file => file.path);
    }

    const updateProduct = await product.findByIdAndUpdate(id , updateData , { returnDocument: 'after' });

    res.json({
        state : SUCCESS,
        message : "Product is updated",
        data : updateProduct
    });
})



const deleteProduct =  asyncWrapper(async(req , res ,next)=>{
    const id = req.params.id
    const deleteProduct = await product.findByIdAndDelete(id);
    if(!deleteProduct){
        const error = new appError("not found product" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "product is deleted",
        data : deleteProduct
    });
})








module.exports = {
        postProducts,
        getProducts,
        getIdProduct,
        patchProduct,
        deleteProduct
}


