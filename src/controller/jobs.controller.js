/*------- Import function here------*/

import {
    createJob,
    getJobFromId,
    updateJobWithId,
    deletejobWithId,
    findJobText,
    jobsArrayFunc
    
} from '../model/jobs.model.js'


/*---------App-Arrays, Jobs-Arrays, Recrui-Arrays--------*/

const jobsHome = (req, res) =>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    res.render('home',{user, app})
}

const jobsArrayRoute = (req, res) =>{
    const jobsR = jobsArrayFunc()
    res.send(jobsR)
}

const jobListingPage = (req, res)=>{
    let lastLoggedIn = req.session.lastLoggedIn || '';
    let user = req.session.user || '';
    let app = req.session.App || '';
    const jobs = jobsArrayFunc()
    res.render("jobs", {user, jobs, app, lastLoggedIn})
}


const jobDetails = (req, res)=>{
    const job = getJobFromId(req.params)
    let user = req.session.user || '';
    let app = req.session.App || '';
    res.render("job-Details", {user, app, job})
}

const newJobPage = (req, res)=>{
    let user = req.session.user || ''
    let app = req.session.App || '';
    if(user){
        let jobNumber = '';
        res.render("post-job", {user, app, jobNumber})
    }else{
        const warning = 'only recruiter is allowed to access this page, login as recruiter to continue'    
        res.render("404page", {user,app, warning})
    }
}

const createNewJob = (req, res) =>{
    const userEmail = req.session.user.email;
    const{appliedDate} = req.body
    const applyDate = new Date(appliedDate)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if(applyDate >= currentDate){
        createJob(req.body, userEmail)
        res.redirect("/jobs")
    } else{
        let user = req.session.user || ''
        let app = req.session.App || '';
        let jobNumber = '';
        res.render("post-job", {user, app, jobNumber})
    }

    
}

const updateJobPage = (req, res)=>{
    const {id} = req.params;
    let user = req.session.user;
    let app = req.session.App || '';
    let jobNumber = id;
    res.render("post-job", {user, app, jobNumber})
}
const updateJob = (req, res)=>{
    const {id} = req.params;
    let user = req.session.user;
    let jobNumber = Number(id);

    const updateJobObj = updateJobWithId(jobNumber, req.body)
    if(updateJobObj && updateJobObj.length){
        res.redirect(`/job/${jobNumber}`)
    }
}

const deleteJob = (req, res) =>{
    const {id} = req.params;
    const deletedJob = deletejobWithId(id)
    if(deletedJob && deletedJob.length){
        res.redirect('/jobs')
    }
}

const findJob = (req, res) =>{
    const {search} = req.body;
    const searchText = search.trim();

    const jobs = findJobText(searchText)
    let lastLoggedIn = req.session.lastLoggedIn || '';
    let user = req.session.user || '';
    let app = req.session.App || '';

    if(jobs && jobs.length){
        res.render("jobs", {user, app, jobs, lastLoggedIn})
    }else{
        const warning = `Job name '${searchText}' doesn't exist`
        res.render("404page", {user, app, warning})
    }

}


const userNotFound = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    const warning = 'user not found pls register'
    res.render("404page", {user, app, warning})
}

const page404 = (req, res)=>{
    let user = req.session.user || '';
    let app = req.session.App || '';
    const warning = '404: Page not Found'
    res.render("404page", {user, app, warning})
}

export {
    jobsHome,
    jobListingPage,
    jobDetails,
    newJobPage,
    createNewJob,
    updateJobPage,
    updateJob,
    deleteJob,
    findJob,
    userNotFound,
    page404,
    jobsArrayRoute,
}

