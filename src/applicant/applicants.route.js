import express from "express"

const router = express.Router()

//Neccessaru Function
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
} from './applicants.controller.js'

import { upload } from "../middleware/multer.js"
import {sendApplicantMail, updateApplicantMail} from "../middleware/nodeMailer.js"
import { auth } from "../middleware/auth.middleware.js"

//Routes
router.get('/login/applicants', loginApplicants)
router.post('/Signup/applicants', applicantsAccount)
router.post('/login/applicant', getApplicantAccount)
router.get('/logout/applicants', logoutApplicant)
router.get('/appliedJobs/:appId', auth, applicantsAppliedJob)
router.post('/jobs/:jobId/applicants/:appId', upload.single('resume'), sendApplicantMail, jobApplyApplicants)
router.put('/applicants/:appId/index/:index', upload.single('resume'), updateApplicantMail , updateAppliedJob)
router.delete('/jobs/:jobId/applicants/:appId/index/:index', deleteAppliedJob)
router.get("/applicantsArray", applicantsArrayRoute)

export default router;