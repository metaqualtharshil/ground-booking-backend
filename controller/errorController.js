const AppError = require("../utils/appError");

const handleCastErrorDB =err =>{
    const message=`invalid ${err.path}: ${err.value}.`;
    return new AppError(message,400);
};

const handleDuplicateFieldDB= err =>{
    const value = err.keyValue.name;
    const message=`Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message,400);
};

const handleValidationErrorDb= err =>{
    const errors= Object.values(err.errors).map(el=>el.message);
    const message=`Invalid input data ${errors.join('. ')}`;
    return new AppError(message,400);
};

const handleJWTError= () => new AppError('Invalid token please login again!',401); 

const handleJWTTokenError= () => new AppError('your token has expired please login again!',401); 

const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
};

const sendErrorprod=(err,res)=>{
    //operational trusted error:send msg to client
    if(err.isOperational){
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    });
    }
    //Programming or other error
    else{
        console.error('Error!',err);
        res.status(500).json({
            status:'error',
            message:'something went very wrong'
        }); 
    }
};

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,res)
    }
    else if(process.env.NODE_ENV ==='production'){
        let error={...err};
        if(error.name === 'CasteError') error=handleCastErrorDB(error);
        if(error.code === 11000) error=handleDuplicateFieldDB(error);
        if(error.name === 'ValidationError') error= handleValidationErrorDb(error);
        if(error.name === 'JsonWebTokenError') error= handleJWTError();
        if(error.name === 'TokenExpiredError') error= handleJWTTokenError();
        sendErrorprod(error,res);
    }  
};