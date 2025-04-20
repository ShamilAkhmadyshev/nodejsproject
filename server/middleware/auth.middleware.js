const tokenService = require("../services/token.service")

module.exports = (req,res,next) =>{
    if(req.method === "OPTIONS"){
       return next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token)return res.status(401).send({message:"Unauthorized"})
       const data = tokenService.validateAccess(token)
        if(!data)return res.status(401).send({message:"Unauthorized"})
        req.user = data

        return next()
    }catch (e){
        return res.status(401).send({message:"Unauthorized"})
    }
}