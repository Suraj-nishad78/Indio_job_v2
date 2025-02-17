import express from "express"

//Middleware
import{lastLoggedInAt} from "../middleware/cookies.js"

// Neccessary function imported here
import {
    loginPage,
    createRecruiter,
    loginRecruiter,
    logoutRecruiter,
    applicantsForm,
    recruitersArrayRoute
} from './recruiter.controller.js'

const router = express.Router()

router.get("/login", loginPage)
router.post("/recruiter", lastLoggedInAt, createRecruiter)
router.post("/login", lastLoggedInAt, loginRecruiter)
router.get("/logout", logoutRecruiter)
router.get('/jobs/:id/applicants', applicantsForm)
router.get("/recruitersArray", recruitersArrayRoute)

export default router