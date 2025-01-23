const Coaching = require("../model/coachingModel");
const factory = require("../controller/handleFactory");
const catchAsync = require("../utils/catchAsync");
const multer=require('multer');

const multerStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/img/users');
    },
    filename: (req,file,cb)=>{
        //user -fdsf4r43dse.jpg
        const ext= file.mimetype.split('/')[1];

        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new AppError('Not an image please only upload image',400),false);
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photos');

exports.addCoaching = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);
    if (req.file) {
      const photos =req.file.filename;
      console.log(photos);
      req.body.photos = photos;
    }

    const newDoc = await Coaching.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDoc,
    });
  } catch (error) {
    console.error("Error during file upload:", error); // Log error details for debugging
    res.status(500).json({
      message: "Failed to upload ground photos.",
      error: error.message || "Internal Server Error",
    });
  }
};

exports.getCoaching = factory.getOne(Coaching);

exports.getAllCoaching = factory.getAll(Coaching);

exports.updateCoaching = factory.updateOne(Coaching);

exports.deleteCoaching = factory.deleteOne(Coaching);
