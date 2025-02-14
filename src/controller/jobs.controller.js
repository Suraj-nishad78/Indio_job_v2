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

const jobsArrayRoute = async(req, res) =>{
    const jobsR = await jobsArrayFunc()
    res.send(jobsR)
}

const jobListingPage = async (req, res)=>{
    try{
        let lastLoggedIn = req.session.lastLoggedIn || '';
        let user = req.session.user || '';
        let app = req.session.App || '';
        const jobs = await jobsArrayFunc()
        res.render("jobs", {user, jobs, app, lastLoggedIn})
    } catch(err){
        res.redirect("/home")
    }
}


const jobDetails = async (req, res)=>{
    const {id} = req.params;
    const job = await getJobFromId(id)
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

const createNewJob = async(req, res) =>{
    try{
        const user = req.session.user._id;
        const{appliedDate} = req.body
        const applyDate = new Date(appliedDate)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
    
        if(applyDate >= currentDate){
            await createJob(req.body, user)
            res.redirect("/jobs")
        } else{
            let user = req.session.user || ''
            let app = req.session.App || '';
            let jobNumber = '';
            res.render("post-job", {user, app, jobNumber})
        }
    } catch(err){
        res.redirect("/home")
    }
}

const updateJobPage = (req, res)=>{
    const {id} = req.params;
    let user = req.session.user;
    let app = req.session.App || '';
    let jobNumber = id;
    res.render("post-job", {user, app, jobNumber})
}
const updateJob = async (req, res)=>{
    try{
        const {id} = req.params;
        let user = req.session.user;
        let jobNumber = id;
        const updateJobObj = await updateJobWithId(jobNumber, req.body)
        if(updateJobObj){
            res.redirect(`/job/${jobNumber}`)
        }
    } catch(err){
        res.redirect("/home")
    }
}

const deleteJob = async (req, res) =>{
    try{
        const {id} = req.params;
        const deletedJob = await deletejobWithId(id)
        if(deletedJob){
            res.redirect('/jobs')
        }
    } catch(err){
        res.redirect("/home")
    }
}

const findJob = async (req, res) =>{
    try{
        const {search} = req.body;
        const searchText = search.trim();
    
        const jobs = await findJobText(searchText)
        let lastLoggedIn = req.session.lastLoggedIn || '';
        let user = req.session.user || '';
        let app = req.session.App || '';
    
        if(jobs){
            res.render("jobs", {user, app, jobs, lastLoggedIn})
        }else{
            const warning = `Job name '${searchText}' doesn't exist`
            res.render("404page", {user, app, warning})
        }
    } catch(err){
        res.redirect("/home")
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

