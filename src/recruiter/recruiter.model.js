
import RecruiterModel from "./recruiter.schema.js"

const recruitersFunc = async () =>{
    return await RecruiterModel.find().lean();
}

const createRecruiterModel = async (user) =>{
    return await RecruiterModel.create(user)
}


const findRecruiterModel = async (email) => {
    return await RecruiterModel.findOne({email})
}

export {
    createRecruiterModel,
    findRecruiterModel,
    recruitersFunc
}