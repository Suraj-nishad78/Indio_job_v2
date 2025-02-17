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

/*------- Routes---------*/
import recruiterRoute from "./src/recruiter/recruiter.route.js"
import jobRoute from "./src/job/job.route.js"
import applicantsRoute from "./src/applicant/applicants.route.js"

app.use("/", recruiterRoute)
app.use("/", applicantsRoute)
app.use("/", jobRoute)


app.listen(3000, ()=>{
    console.log('Server is runnig on port 3000')
    connectToDb()
})

