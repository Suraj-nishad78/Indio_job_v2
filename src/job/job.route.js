import express from "express"

const router = express.Router()

//Middleware
import { auth } from "../middleware/auth.middleware.js"

// Neccessary Function
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
} from "./jobs.controller.js"

import {
    jobApplicants
} from '../recruiter/recruiter.controller.js'

router.get("/home", auth, jobsHome)
router.get("/jobs", jobListingPage)
router.get("/job/:id", jobDetails)
router.get("/post-job", newJobPage)
router.get("/update-job-page/:id", auth, updateJobPage)
router.get('/jobs/applicants', auth, jobApplicants)
router.post("/post-job", createNewJob)
router.post('/job-search', findJob)
router.put("/update-job/:id", updateJob)
router.delete("/job/:id", deleteJob)
router.get("/jobsArray", jobsArrayRoute)
router.get("/user-not-found", userNotFound)
router.get('*', page404)

export default router;