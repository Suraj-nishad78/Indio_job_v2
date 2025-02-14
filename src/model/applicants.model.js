
import {
    jobsArrayFunc,
} from "./jobs.model.js"

import ApplicantModel from "../schema/applicants.schema.js"


/*----------Applicants Array---------*/
let applicantsId = 1
let applicants = []

const applicantsFunc = async () =>{
    return await ApplicantModel.find().lean();
}

const addApplicantsInArray = async (app) =>{
    await ApplicantModel.create(app)
}
/*
const addApplicantsInArray = (app) =>{
    const appId = applicantsId;
    const applicant = {id:appId,...app}
    applicantsId++
    return applicants.push(applicant)   
}
*/

const checkApplicantsExist = async (email) =>{
    return await ApplicantModel.findOne({email})
}
/*
const checkApplicantsExist = (app) =>{
    const { email, password} = app;
    const findApp = applicants.filter(applicant=>applicant.email == email && applicant.password == password);
    return findApp;
}

const checkEmailExist = (app) =>{
    const { email } = app;
    const findApp = applicants.filter(applicant=>applicant.email == email);
    return findApp;
}
*/

const createApplicants = (app, jobCreaterId, applicantsId) =>{
    const appId = Number(applicantsId);
    const jobId = Number(jobCreaterId);

    const allJobs = jobsArrayFunc();
    const getJob = allJobs.filter(job =>job.id == jobId);
    const job = getJob[0];
    const companyName = job.companyName;
    job.applicants.push({appId:appId})

    const appDetail = applicants.find(applicant=>applicant.id === appId)
    appDetail.appliedJob.push({appId, jobId, companyName,...app})

}

const appIdAlreadyExist = (jobId, appId) =>{
    const getJob = jobsArrayFunc().filter(job =>job.id == jobId);
    const jobApp = getJob[0].applicants;
    const appIdExist = jobApp.filter(job=>job.appId == appId)
    return appIdExist;
}

const applicantsFormData = (jobId) => {
    const { id } = jobId;
    const allJobs = jobsArrayFunc();
    const jobApplicants = allJobs.find(job => job.id == id)?.applicants || [];
    const allApplicants = applicantsFunc();

    return jobApplicants.flatMap(jobApp => 
        allApplicants
            .filter(app => app.id === jobApp.appId)
            .flatMap(app => app.appliedJob.filter(applied => applied.jobId == id))
    );
};

const deleteApplied = (jId, aId, index) =>{
    const jobId = Number(jId);
    const appId = Number(aId);
    const appliedIndex = Number(index);

    // Erase Applicant Id from job Array
    let jobs = jobsArrayFunc();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) {
        console.error("Job not found!");
        return;
    }
    
    jobs[jobIndex].applicants = jobs[jobIndex].applicants.filter(applicant => applicant.appId !== appId);    
    
    // Erase Applied job from Applicants Array
    let applicantsArray = applicantsFunc();
    const applicantIndex = applicantsArray.findIndex(applicant => applicant.id === appId);
    
    if (applicantIndex === -1) {
        console.error('Applicant not found!');
        return;
    }
    
    const appliedJobs = applicantsArray[applicantIndex].appliedJob;
    appliedJobs.splice(index, 1);
}

const updateApplied = (updateAppData, appId, index)=>{
    
    const applicants = applicantsFunc();
    
    const applicant = applicants.find(app=>app.id === appId)

    const jobToUpdate = applicant.appliedJob[index]

    applicant.appliedJob[index] = {
        ...jobToUpdate,
        ...updateAppData
    }
}

const updatedApplicantsArray = (app) =>{
    return applicants = app
}

export {
    addApplicantsInArray,
    checkApplicantsExist,
    createApplicants,
    updateApplied,
    deleteApplied,
    applicantsFormData,
    applicantsFunc,
    updatedApplicantsArray,
    appIdAlreadyExist
}