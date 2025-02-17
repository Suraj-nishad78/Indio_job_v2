
import {
    getJobFromId,
    updateApplicants,
    deleteApplicants
} from "../job/jobs.model.js"

import ApplicantModel from "./applicants.schema.js"


const applicantsFunc = async () =>{
    return await ApplicantModel.find().lean();
}

const addApplicantsInArray = async (app) =>{
    await ApplicantModel.create(app)
}

const checkApplicantsExist = async (email) =>{
    return await ApplicantModel.findOne({email})
}

const createApplicants = async (app, jobCreaterId, applicantsId) =>{
    const _id = applicantsId;
    const jobId = jobCreaterId;

    const job = await getJobFromId(jobId);
    const companyName = job.companyName;
    await updateApplicants(jobId, _id)
    
    const jobDetail = {appId:_id, jobId, companyName,...app}
    const jobApplied = await ApplicantModel.findByIdAndUpdate(_id, {$addToSet: {appliedJob: jobDetail}})
    return jobApplied;
}

const appIdAlreadyExist = async (jobId, appId) =>{
    const getJob = await getJobFromId(jobId);
    const jobApp = getJob.applicants;
    const appIdExist = jobApp.find(job=>job.appId == appId)
    return appIdExist;
}

const findApplicantById = async (_id) =>{
    return await ApplicantModel.findById(_id)
}

const applicantsFormData = async (jobId) => {
    const { id } = jobId;
    const allJobs = await getJobFromId(id);
    const jobApplicants = allJobs.applicants;
    const allApplicants = await applicantsFunc();

    const job = jobApplicants.flatMap(jobApp => 
        allApplicants
            .filter(app => String(app._id) == String(jobApp.appId))
            .flatMap(app => app.appliedJob.filter(applied => applied.jobId == id))
    );
    
   return job;

};


const updateApplied = async (updateAppData, appId, index) => {
    const updateQuery = Object.keys(updateAppData).reduce((acc, key) => {
        acc[`appliedJob.${index}.${key}`] = updateAppData[key]; // Use dot notation to update specific properties
        return acc;
    }, {});

    const updateApplicant = await ApplicantModel.findByIdAndUpdate(
        appId,
        { $set: updateQuery },
        { new: true } // Return updated document
        );
        
        return updateApplicant;
    };

    const deleteApplied = async (jId, aId, index) => {
        const jobId = jId;
        const appId = aId;
        const appliedIndex = Number(index);
    
        await deleteApplicants(jobId, appId); // Remove from job's applied list
    
        const applicant = await ApplicantModel.findById(appId);
    
        // Remove the object from the array using JavaScript splice and save the document
        applicant.appliedJob.splice(appliedIndex, 1);
        await applicant.save();
    };

export {
    addApplicantsInArray,
    checkApplicantsExist,
    createApplicants,
    updateApplied,
    deleteApplied,
    applicantsFormData,
    applicantsFunc,
    appIdAlreadyExist,
    findApplicantById
}