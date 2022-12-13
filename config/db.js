const mongoose=require('mongoose');

const connectDb=async ()=>{
    try{
        const connect=await mongoose.connect(process.env.mongoUrl,{
            useNewUrlParser:true
        })
        console.log(`Mongoose connected: ${connect.connection.host}`)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports=connectDb;