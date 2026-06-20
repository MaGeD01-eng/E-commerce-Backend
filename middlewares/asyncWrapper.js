module.exports = (asyncWrapper)=>{
    return async (req , res ,next)=>{
        try{
            await asyncWrapper(req , res , next);
        }
        catch(err){
            next(err);
            }
    }
}