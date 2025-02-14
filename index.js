import express from "express"
import expressEjsLayout from "express-ejs-layouts"
import session from "express-session"
import {join} from "path"
import ejs from "ejs"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

/*----import function are here-----*/
import {
    jobsHome,
    jobListingPage,
    jobDetails,
    newJobPage,
    createNewJob,
    updateJobPage,
    updateJob,
    deleteJob,
    findJob,
    jobsArrayRoute,
    userNotFound,
    page404
} from "./src/controller/jobs.controller.js"

import {
    loginPage,
    createRecruiter,
    loginRecruiter,
    logoutRecruiter,
    applicantsForm,
    jobApplicants,
    recruitersArrayRoute
} from './src/controller/recruiter.controller.js'

import {
    applicantsAccount,
    loginApplicants,
    getApplicantAccount,
    applicantsAppliedJob,
    updateAppliedJob,
    deleteAppliedJob,
    logoutApplicant,
    jobApplyApplicants,
    applicantsArrayRoute
} from './src/controller/applicants.controller.js'

import { upload } from "./src/middleware/multer.js"
import {sendApplicantMail, updateApplicantMail} from "./src/middleware/nodeMailer.js"
import{lastLoggedInAt} from "./src/middleware/cookies.js"
import { auth } from "./src/middleware/auth.middleware.js"
import{connectToDb} from "./database/config.js"

/*----import function are here-----*/

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), '/src/views'));
app.set('layouts', 'layout')


/*-------Middleware---------*/

app.use(cookieParser())
app.use(express.static(join(process.cwd(), 'public'))); 
app.use(expressEjsLayout);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret: 'recruiter',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:  15 * 60 * 1000 }
}));


app.get("/", (req, res)=>{
    res.redirect('/home')
})

/*------- Job Routes---------*/

app.get("/home", auth, jobsHome)
app.get("/jobs", jobListingPage)
app.get("/job/:id", jobDetails)
app.get("/post-job", newJobPage)
app.get("/update-job-page/:id", auth, updateJobPage)
app.get('/jobs/applicants', auth, jobApplicants)
app.post("/post-job", createNewJob)
app.post('/job-search', findJob)
app.put("/update-job/:id", updateJob)
app.delete("/job/:id", deleteJob)


/*------- Applicant Routes---------*/

app.get('/login/applicants', loginApplicants)
app.post('/Signup/applicants', applicantsAccount)
app.post('/login/applicant', getApplicantAccount)
app.get('/logout/applicants', logoutApplicant)
app.get('/appliedJobs/:appId', auth, applicantsAppliedJob)
app.post('/jobs/:jobId/applicants/:appId', upload.single('resume'), sendApplicantMail, jobApplyApplicants)
app.put('/applicants/:appId/index/:index', upload.single('resume'), updateApplicantMail , updateAppliedJob)
app.delete('/jobs/:jobId/applicants/:appId/index/:index', deleteAppliedJob)

/*------- Recruiter Routes---------*/

app.get("/login", loginPage)
app.post("/recruiter", lastLoggedInAt, createRecruiter)
app.post("/login", lastLoggedInAt, loginRecruiter)
app.get("/logout", logoutRecruiter)
app.get('/jobs/:id/applicants', auth, applicantsForm)

/*------- Other Routes---------*/

app.get("/applicantsArray", applicantsArrayRoute)
app.get("/recruitersArray", recruitersArrayRoute)
app.get("/jobsArray", jobsArrayRoute)
app.get("/user-not-found", userNotFound)
app.get('*', page404)


app.listen(3000, ()=>{
    console.log('Server is runnig on port 3000')
    connectToDb()
})

