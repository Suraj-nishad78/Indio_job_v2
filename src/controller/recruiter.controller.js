
// modules imports are here

import bcrypt from "bcrypt"

// Neccessary imports are here

import {
    createRecruiterModel,
    findRecruiterModel,
    recruitersFunc
} from '../model/recruiter.model.js'

import {
    jobsArrayFunc    
} from '../model/jobs.model.js'

import {
    applicantsFormData
} from "../model/applicants.model.js"

// Neccessary funcion are here

const recruitersArrayRoute = async (req, res) =>{
    const recruiter = await recruitersFunc()
    res.send(recruiter)
}

const createRecruiter = async (req, res) =>{
    try{
        const {name , email, password} = req.body;
        const emailExist =  await findRecruiterModel(email)
        if(emailExist){ 
            res.redirect("/home")
            return
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        const user = {name , email, password:encryptedPassword}
        
        const recruiter = await createRecruiterModel(user)
        
        res.redirect("/login")
    } catch(err){
        res.redirect("/home")
    }
}

const loginPage = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    let err = ''
    res.render("login", {user, app, err})
}

const loginRecruiter = async (req, res) =>{
    try{
        let user = req.session.user || '';
        let app = req.session.App || '';
        const {email, password} = req.body;
        const recruiter = await findRecruiterModel(email)
        const checkPassword = await bcrypt.compare(password, recruiter.password)
        if(recruiter && checkPassword){
            req.session.user = recruiter;
            res.redirect("/jobs")
        }else{
            let err = 'Authentication failed invalid credential !'
            res.render('login', {user, app, err })
        }
    } catch(err){
        res.redirect("/home")
    }
}

const logoutRecruiter = (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login');
        }
      });
}

const applicantsForm = (req, res) =>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    const {id} = req.params
    const jobs = jobsArrayFunc().filter(job=>job.id == id)
    const createrJob = jobs[0].jobCreater;
    if(user.email == createrJob){
        const applicants = applicantsFormData(req.params);
    
        if(applicants && applicants.length){
            let count = 1;
            res.render("applicants", {user,app , applicants, count})
            return
        }
        const warning = 'No body apply for this job'
        res.render("404page", {user, app, warning})
    }else if(user){
        const warning = 'Only recruiter who create this job can access this page'
        res.render("404page", {user, app, warning})
    }
    else{
        const warning = 'only recruiters is allowed to access this page, login as recruiter to continue'
        res.render("404page", {user, app, warning})
    }
}

const jobApplicants = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    if(user){
        res.render("applicants", {user, app})
    }else{
        const warning = 'only recruiter is allowed to access this page, login as recruiter to continue'    
        res.render("404page", {user, app, warning})
    }
}

export {
    loginPage,
    createRecruiter,
    loginRecruiter,
    logoutRecruiter,
    applicantsForm,
    jobApplicants,
    recruitersArrayRoute
}