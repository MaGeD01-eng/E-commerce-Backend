const Category = require("../model/category.model");
const {SUCCESS , FAIL, ERROR} = require("../utils/httpsstatus");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");




const postCategory = asyncWrapper(async (req , res , next)=>{
    const {title} = req.body
    if(!title){
        const error = new appError("title not exist" , 400 , ERROR);
        return next(error);
    }
    
    await Category.create({title});
    res.status(201).json({
        state : SUCCESS,
        message : "category is created!"
    })
})










const getCategory = asyncWrapper(async(req , res,next)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const categories = await Category.find({} ,{"__v" : false}).limit(limit).skip((page-1)*limit);
    if(categories.length === 0){
        const error = new appError("not found categories" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "informaton of categoris",
        data : categories
    });
})


const getIdCategory = asyncWrapper(async(req , res , next)=>{
    const id = req.params.id
    const oneCategory = await Category.findById(id);
    if(!oneCategory){
        const error = new appError("not found category" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "informaton of category",
        data : oneCategory
    });
})


const putCategory =  asyncWrapper(async(req , res , next)=>{
    const id = req.params.id
    const {title} = req.body
    if(!title){
        const error = new appError("title not exist" , 400 , ERROR);
        return next(error);
    }
    const updateCategory = await Category.findByIdAndUpdate(id , {title} , { returnDocument: 'after' });
    res.json({
        state : SUCCESS,
        message : "category is updated",
        data : updateCategory
    });
})



const deletecategory =  asyncWrapper(async(req , res ,next)=>{
    const id = req.params.id
    const deleteCategory = await Category.findByIdAndDelete(id);
    if(!deleteCategory){
        const error = new appError("not found category" , 404 , FAIL);
        return next(error);
    }
    res.json({
        state : SUCCESS,
        message : "categoru is deleted",
        data : deleteCategory
    });
})



module.exports = {
        postCategory,
        getCategory,
        getIdCategory,
        putCategory,
        deletecategory
}