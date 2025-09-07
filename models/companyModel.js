import mongoose from "mongoose";
const companySchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        
    },
    location:{
        type:String,
        
    },
    web_site:{
        type:String,
        
    },
    logo:{
        type:String,
        
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },



},{timestamps: true})
export const Company= mongoose.model('Company', companySchema)