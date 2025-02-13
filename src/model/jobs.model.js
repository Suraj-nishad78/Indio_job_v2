
import { 
    applicantsFunc,
    updatedApplicantsArray
    } from './applicants.model.js';

let jobId = 4
let jobsArray = [
    {
        id: 1,
        jobCreater:"surajn838@gmail.com",
        jobCategory: "Tech",
        jobDesignation: "SDE",
        jobLocation: "Gurgaon HR IND Remote",
        companyName: "Coding Ninjas",
        salary:"15-20 Lpa",
        applyBy: "30 Nov 2024",
        skillsRequired: ["React", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
        numberOfOpenings: "5",
        jobPosted: "12/7/2024, 08:31:31 AM",
        applicants:[]
    },
    {
        id: 2,
        jobCreater:"vivek123@gmail.com",
        jobCategory: "Tech",
        jobDesignation: "DevOps",
        jobLocation: "Delhi IND",
        companyName: "Google",
        salary:"10-15 Lpa",
        applyBy: "15 Sep 2024",
        skillsRequired: ["React", "NodeJs", "MongoDB", "Express", "AWS"],
        numberOfOpenings: "10",
        jobPosted: "28/8/2024, 10:15:2 PM",
        applicants:[]
    },
    {
        id: 3,
        jobCreater:"surajn838@gmail.com",
        jobCategory: "Tech",
        jobDesignation: "Full-Stack Developer",
        jobLocation: "Chennai India",
        companyName: "CapgaMini",
        salary:"5-10 Lpa",
        applyBy: "31 Dec 2024",
        skillsRequired: ["React", "SQL", "MongoDB", "Express", "AWS"],
        numberOfOpenings: "7",
        jobPosted: "21/9/2024, 11:10:55 AM",
        applicants:[]
    }
]

const jobsArrayFunc = () =>{
    return jobsArray;
}

const createJob = (job, creater) => {
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
        id:jobId,
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

    const jobArray = jobsArrayFunc()
    jobArray.push(newJob)
    jobId++
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


const getJobFromId = (jobId) =>{
    const{ id } = jobId;
    const allJobs = jobsArrayFunc();
    const getJob = allJobs.filter(job =>job.id == id);
    const job = getJob[0];
    return job;
}

const updateJobWithId = (jobId, jobData) =>{
    
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

    jobsArray = jobsArray.map(job=>{
        if(job.id === jobId){
            return {...job,...updatedJobData}
        } 
            
        return job
    })

    return jobsArray;

}

const deletejobWithId = (jobId) => {
    const id = Number(jobId);
    jobsArray = jobsArray.filter(job=>job.id !== id)
    const updatedApplicants = applicantsFunc().map(app=>({
        ...app,
        appliedJob:app.appliedJob.filter(job=>job.jobId !== id)
    }))

    updatedApplicantsArray(updatedApplicants)

    return jobsArray;
}

const findJobText = (search) =>{
    let searched = search.toLowerCase()
    const job = jobsArray.filter(job=>job.companyName.toLowerCase().includes(searched));
    return job;
}

export {
    createJob,
    getJobFromId,
    updateJobWithId,
    deletejobWithId,
    findJobText,

    jobsArrayFunc
}