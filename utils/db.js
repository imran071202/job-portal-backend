import mongoose from "mongoose";
const connectDB =async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('mongoose connect sucess');
        

    } catch(error){
        console.log(error);
        

    }
}
export default connectDB