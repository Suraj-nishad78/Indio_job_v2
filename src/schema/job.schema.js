import mongoose from "mongoose";

const JobSchema = mongoose.Schema({
    jobCreater:{
        type:mongoose.Schema.ObjectId,
        ref:'Recruiter',
        required:true
    },
    jobCategory:{
        type:String,
        required:true
    },
    jobDesignation:{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    applyBy:{
        type:String,
        required:true
    },
    skillsRequired:{
        type:[String],
        default:[]
    },
    numberOfOpenings:{
        type:Number,
        required:true
    },
    jobPosted:{
        type:String,
        required:true
    },
    applicants:[{
                type:mongoose.Schema.ObjectId,
                ref:"Applicants"
    }]
})

const JobModel = mongoose.model('Job', JobSchema)

export default JobModel;