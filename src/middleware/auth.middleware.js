
const auth = (req, res, next) =>{
    if(!req.session.user && !req.session.App){
        let user = ''
        let app = ''
        return res.render('home',{user, app})
    }
    next()
}

export {auth}