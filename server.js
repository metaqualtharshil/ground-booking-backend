const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});
const app = require("./app");

process.on('uncaughtException',err => {
 console.log("uncaughtException!!");
 console.log(err.name,err.message);
 process.exit(1);
});

process.on("unhandledRejection",err => {
    console.log('UNHANLEDREJECTION!!');
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    });
});

mongoose.connect(process.env.CONNECTION_STRING).then(cons=>{
    console.log("DB is Successfully");
});

const port = process.env.PORT || 3000;

const server = app.listen(port,'0.0.0.0',() => {
    console.log(`App Running on Port ${port}....`);
});

