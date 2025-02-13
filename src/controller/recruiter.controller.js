
// Neccessary imports are here

import {
    createRecruiterModel,
    findRecruiterModel,
    userEmailExist,
    recruitersFunc
} from '../model/recruiter.model.js'

import {
    jobsArrayFunc    
} from '../model/jobs.model.js'

import {
    applicantsFormData
} from "../model/applicants.model.js"

// Neccessary funcion are here

const recruitersArrayRoute = (req, res) =>{
    const recrui = recruitersFunc()
    res.send(recrui)
}

const createRecruiter = (req, res) =>{
    const emailExist = userEmailExist(req.body)
    if(emailExist && emailExist.length){ 
        res.redirect("/home")
        return
    }
    createRecruiterModel(req.body)
    res.redirect("/login")
}

const loginPage = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    let err = ''
    res.render("login", {user, app, err})
}

const loginRecruiter = (req, res) =>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    const recruiter = findRecruiterModel(req.body)
    if(recruiter && recruiter.length){
        req.session.user = recruiter[0];
        res.redirect("/jobs")
    }else{
        let err = 'Authentication failed invalid credential !'
        res.render('login', {user, app, err })
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