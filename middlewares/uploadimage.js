const multer = require("multer");

const path = require("path");


const storage = multer.diskStorage({
    destination : (req , file , cb)=>{
    cb(null , path.join(__dirname, "..", "uploads"));
},
    filename : (req , file , cb)=>{
        cb(null , file.fieldname+'-'+Date.now());
    }
})


const filefilter = (req , file , cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null , true);
        }
        else{
            cb(new Error("Warning! Image only..."));
        }
}


const upload = multer({
    storage,
    limits : 1024 * 1024 * 2 ,
    filefilter
});


module.exports = upload;
