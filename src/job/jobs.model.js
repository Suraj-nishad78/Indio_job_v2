
import JobModel from "./job.schema.js"

const jobsArrayFunc = async () =>{
    return await JobModel.find().lean();
}

const createJob = async (job, creater) => {
    const {
        jobCategory,
        jobDesignation,
        jobLocation,
        companyName,
        salary,
        numberOfOpenings,
        skillsRequired,
        appliedDate
    } = job;
    
    /*------Applied Date-----*/
    const applyBy = dateFormat(appliedDate)

    /*------Posted Date & Time-----*/

    const jobPosted = PostedDateNTime()

    const newJob = {
        jobCreater:creater,
        jobCategory,
        jobDesignation,
        jobLocation,
        companyName,
        salary,
        applyBy,
        skillsRequired,
        numberOfOpenings,
        jobPosted,
        applicants:[]
    }
    return await JobModel.create(newJob)
}

function dateFormat(appliedDate){
    const AppDate = appliedDate;
    const dateApply = new Date(AppDate)
    const currentDate = new Date()
    const applyBy = dateApply.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric' });
    return applyBy
}

function PostedDateNTime(){
    const currentDate = new Date()
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;// Month are zero indexed
    const year = currentDate.getFullYear();

    let hours = currentDate.getHours();
    const min = currentDate.getMinutes();
    const sec = currentDate.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12 ;

    const postedDate = `${date}/${month}/${year}`;
    const postedTime = `${hours}:${min}:${sec} ${ampm}`;
    const jobPosted = `${postedDate}, ${postedTime}`;
    return jobPosted;
}

const getJobFromId = async (_id) =>{
    return await JobModel.findOne({_id})
}

const updateJobWithId = async(jobId, jobData) =>{
    const _id = jobId;
    const {
        jobCategory,
        jobDesignation,
        jobCompany,
        jobLocation,
        jobSalary,
        totalPositions,
        jobSkills,
        jobAppliedDate,
    } = jobData;

    /*------Applied Date-----*/

    const applyBy = dateFormat(jobAppliedDate)

    /*------Posted Date & Time-----*/
    

    const updatedJobData = {
        jobCategory:jobCategory,
        jobDesignation:jobDesignation,
        companyName:jobCompany,
        jobLocation:jobLocation,
        salary:jobSalary,
        numberOfOpenings:totalPositions,
        skillsRequired:jobSkills,
        applyBy
    }

    return await JobModel.findByIdAndUpdate(
        _id,
        { $set: updatedJobData },
        { new: true, runValidators: true }
    );

}

const deletejobWithId = async (jobId) => {
    const _id = jobId;
    return await JobModel.findByIdAndDelete(_id)
}

const findJobText = async (search) =>{
    let query = {}
    query.companyName = { $regex: search, $options: "i" };
    const job = await JobModel.find(query)
    return job;
}

const updateApplicants = async (_id, appId) =>{
    await JobModel.findByIdAndUpdate(_id, { $addToSet: { applicants: {appId} } });
}

const deleteApplicants = async (_id, appId) =>{
    await JobModel.findByIdAndUpdate(_id, {$pull: { applicants: {appId} }})
}

export {
    createJob,
    getJobFromId,
    updateJobWithId,
    deletejobWithId,
    findJobText,
    jobsArrayFunc,
    updateApplicants,
    deleteApplicants
}