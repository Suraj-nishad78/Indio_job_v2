

let recruiterId = 1
const recruiters = []

const recruitersFunc = () =>{
    return recruiters;
}

const createRecruiterModel = (user) =>{
    const {name, email, password} = user
    const id = recruiterId;
    let newRecruiter = { id, name, email, password}
    const getRecruiters = recruitersFunc()
    getRecruiters.push(newRecruiter)
    recruiterId++
}


const findRecruiterModel = (user) => {
    const { email, password} = user;
    const getRecruiters = recruitersFunc()
    const findRecruiter = getRecruiters.filter(recruiter=>recruiter.email == email && recruiter.password == password);
    return findRecruiter;
}

const userEmailExist = (user) => {
    const { email } = user;
    const getRecruiters = recruitersFunc()
    const findRecruiter = getRecruiters.filter(recruiter=>recruiter.email == email);
    return findRecruiter;
}

export {
    createRecruiterModel,
    findRecruiterModel,
    userEmailExist,
    recruitersFunc
}