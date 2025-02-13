import nodeMailer from "nodemailer"
import { appIdAlreadyExist } from '../model/applicants.model.js'

const sendApplicantMail = async (req, res, next) =>{
    const{jobId, appId} = req.params;
    const appIdExist = appIdAlreadyExist(jobId, appId)
    
    if(appIdExist && appIdExist.length){
        next()
        return;
    }
    const {name, email} = req.body;
    let transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            // user:'codingninjas2k16@gmail.com',
            // pass:'slwvvlczduktvhdj'
            user:process.env.SENDER_MAIL,
            pass:process.env.SENDER_PASS
        }
    })

    let mailOptions = {
        // from:'codingninjas2k16@gmail.com',
        from:process.env.SENDER_MAIL,
        to:email,
        subject:'Application Received',
        text:`Dear ${name},\n\nThank you for applying for the job. We have received your application.\n\nBest Regards,\nCompany Team.`,
    }

    try{
        await transporter.sendMail(mailOptions);
        next()
    }catch(err){
        console.log('Error occured while sending mail: ', err)
    }

}

const updateApplicantMail = async (req, res, next) =>{
    const {name, email} = req.body;
    let transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:'codingninjas2k16@gmail.com',
            pass:'slwvvlczduktvhdj'
        }
    })

    let mailOptions = {
        from:'codingninjas2k16@gmail.com',
        to:email,
        subject:'Application Updated Successfully!',
        text:`Dear ${name},\n\nYou are successfully updated your deatails. We have received your updated application.\n\nBest Regards,\nCompany Team.`,
    }

    try{
        await transporter.sendMail(mailOptions);
        next()
    }catch(err){
        console.log('Error occured while sending mail: ', err)
    }

}

export { sendApplicantMail, updateApplicantMail}