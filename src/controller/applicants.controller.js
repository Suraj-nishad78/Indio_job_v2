//Neccessary imports are here

import path from "path"

import {
    applicantsFunc,
    addApplicantsInArray,
    checkApplicantsExist,
    createApplicants,
    updateApplied,
    checkEmailExist,
    deleteApplied,
    appIdAlreadyExist
} from "../model/applicants.model.js"

//Neccessary function are here

const applicantsArrayRoute = (req, res) =>{
    const app = applicantsFunc()
    res.send(app)
}

const loginApplicants = (req, res)=>{
    let user = req.session.App || '';
    let app = req.session.App || '';
    let err = ''
    res.render("loginApp", {user, app, err})
}

const applicantsAccount = (req, res)=>{
    const {name, email, password} = req.body;
    const emailExist = checkEmailExist(req.body)
    if(emailExist && emailExist.length){
        res.redirect("/home")
        return
    }
    const app = {name, email, password, appliedJob:[]}
    const applicants = addApplicantsInArray(app)
    res.redirect('/login/applicants')
}

const getApplicantAccount = (req, res)=>{
    

    const {email, password} = req.body;
    const app = {email, password}
    const applicant =  checkApplicantsExist(app)
    if(applicant && applicant.length){
        req.session.App = applicant[0];
        res.redirect("/home")
    }else{
        let user = req.session.App || '';
        let app = req.session.App || '';
        let err = 'Authentication failed invalid credential !'
        res.render('loginApp', {user, app, err })
    }
}

const logoutApplicant = (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login/applicants');
        }
      });
}


const jobApplyApplicants = (req, res) =>{
    const {name, email, number} = req.body;
    const { file } = req;
    const{jobId, appId} = req.params;
    const appIdExist = appIdAlreadyExist(jobId, appId)
    
    if(appIdExist && appIdExist.length){
        res.redirect(`/job/${jobId}`)
        return;
    }
    const applicant = { name, email, number, resume: `/uploads/${email}${path.extname(file.originalname)}`};
    createApplicants(applicant, jobId, appId)
    res.redirect('/jobs')
}

const applicantsAppliedJob = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    const {appId} = req.params;
    const applicantData = applicantsFunc().filter( app => app.id == appId)
    const applicants = applicantData[0].appliedJob;
  
    let count = 1;
    let deleteIndex = 0;
    let editIndex = 0;
    res.render("applicants", {user,app, editIndex, deleteIndex, applicants, count})
}

const updateAppliedJob = (req, res) =>{
    const {name, email, number} = req.body;
    const { file } = req;
    const {appId, index} = req.params;
    const updatedData = { name, email, number, resume: `/uploads/${email}${path.extname(file.originalname)}`};
    updateApplied(updatedData, Number(appId), Number(index))
    res.redirect(`/appliedJobs/${appId}`)
}

const deleteAppliedJob = (req, res) =>{
    const{jobId, appId, index} = req.params;
    const deleteApp = deleteApplied(jobId, appId, index)
    res.redirect(`/appliedJobs/${appId}`)
}

export {
    applicantsAccount,
    loginApplicants,
    getApplicantAccount,
    applicantsAppliedJob,
    deleteAppliedJob,
    updateAppliedJob,
    logoutApplicant,
    jobApplyApplicants,
    applicantsArrayRoute
}