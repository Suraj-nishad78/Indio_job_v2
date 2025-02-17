import mongoose from "mongoose";

const ApplicantSchema = mongoose.Schema({
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
    },
    appliedJob: [{
        appId: { type: String },
        jobId: { type: String },
        companyName: { type: String },
        name: { type: String }, 
        email: { type: String }, 
        number: { type: Number },
        resume: { type: String }  
    }]
})

const ApplicantModel = mongoose.model("Applicant", ApplicantSchema)

export default ApplicantModel;