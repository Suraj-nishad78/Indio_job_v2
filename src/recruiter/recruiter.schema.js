import mongoose from "mongoose";

const RecruiterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const RecruiterModel = mongoose.model("Recruiter", RecruiterSchema)

export default RecruiterModel;