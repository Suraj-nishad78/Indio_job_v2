//Neccessary imports are here

import path from "path"
import bcrypt from "bcrypt"

import {
    applicantsFunc,
    addApplicantsInArray,
    checkApplicantsExist,
    createApplicants,
    updateApplied,
    deleteApplied,
    appIdAlreadyExist,
    findApplicantById
} from "../model/applicants.model.js"
import ApplicantModel from "../schema/applicants.schema.js"

//Neccessary function are here

const applicantsArrayRoute = async (req, res) =>{
    const app = await applicantsFunc()
    res.send(app)
}

const loginApplicants = (req, res)=>{
    let user = req.session.App || '';
    let app = req.session.App || '';
    let err = ''
    res.render("loginApp", {user, app, err})
}

const applicantsAccount = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const emailExist = await checkApplicantsExist(email)
        if(emailExist){
            res.redirect("/home")
            return
        }
        const encryptPassword = await bcrypt.hash(password, 10)
        const app = {name, email, password:encryptPassword}
        const applicants = await addApplicantsInArray(app)
        res.redirect('/login/applicants')
    } catch(err){
        res.redirect("/home")
    }
}

const getApplicantAccount = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const app = {email, password}
        const applicant =  await checkApplicantsExist(email)
        if(applicant){
            const checkPassword = await bcrypt.compare(password, applicant.password)
            if(!checkPassword){
                let user = req.session.App || '';
                let app = req.session.App || '';
                let err = 'Authentication failed invalid credential !'
                res.render('loginApp', {user, app, err })
                return
            }
            req.session.App = applicant;
            res.redirect("/home")
            return
        }else{
            let user = req.session.App || '';
            let app = req.session.App || '';
            let err = 'Authentication failed invalid credential !'
            res.render('loginApp', {user, app, err })
            return
        }
    }catch(err){
        res.redirect("/home")
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

const jobApplyApplicants = async (req, res) =>{
    try{
        const {name, email, number} = req.body;
        const { file } = req;
        const{jobId, appId} = req.params;
        const appIdExist = appIdAlreadyExist(jobId, appId)
        
        if(!appIdExist){
            res.redirect(`/job/${jobId}`)
            return;
        }
        // const applicant = { name, email, number, resume: `/uploads/${email}${path.extname(file.originalname)}`};
        const applicant = { name, email, number, resume: `/uploads/${file.filename}`};
        await createApplicants(applicant, jobId, appId)
        res.redirect('/jobs')
    } catch(err){
        console.log("Error occured while applying a job: ", err);
        res.redirect("/home")
    }
}

const applicantsAppliedJob = async(req, res)=>{
    try{
        let user = req.session.user || '';
        let app = req.session.App || '';
        const {appId} = req.params;
        const findApplicant = await findApplicantById(appId);
        const applicants = findApplicant.appliedJob;

        if(applicants.length === 0){
            const warning = `You haven't applied any jobs.`    
            res.render("404page", {user,app, warning})
            return;
        }
      
        let count = 1;
        let deleteIndex = 0;
        let editIndex = 0;
        res.render("applicants", {user,app, editIndex, deleteIndex, applicants, count})
    }catch(err){
        console.log("Error occured while displaying applied job: ", err);
        res.redirect("/home")
    }
}

const updateAppliedJob = async (req, res) =>{
    try{
        const {name, email, number} = req.body;
        const { file } = req;
        const {appId, index} = req.params;
        // const updatedData = { name, email, number, resume: `/uploads/${email}${path.extname(file.originalname)}`};
        const updatedData = { name, email, number, resume: `/uploads/${file.filename}`}
        await updateApplied(updatedData, appId, Number(index))
        res.redirect(`/appliedJobs/${appId}`)
    } catch(err){
        console.log("Error occured while updating data: ", err);
        res.redirect(`/appliedJobs/${appId}`)
    }
}

const deleteAppliedJob = (req, res) =>{
    try{
        const{jobId, appId, index} = req.params;
        const deleteApp = deleteApplied(jobId, appId, index)
        res.redirect(`/appliedJobs/${appId}`)
    } catch(err){
        console.log("Error occured while deleting data: ", err);
        res.redirect(`/appliedJobs/${appId}`)
    }
}

const AppliedDeleteByJob = async (jobID) =>{
    // await ApplicantModel.findBy
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
    applicantsArrayRoute,
    AppliedDeleteByJob
}