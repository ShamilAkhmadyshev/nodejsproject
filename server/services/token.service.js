const config = require("config")
const jwt = require("jsonwebtoken")
const Token = require("../models/token")
class TokenService{
generate(payload){
    const accessToken = jwt.sign(payload, config.get("accessKey"), {expiresIn: "1h"})
    const refreshToken = jwt.sign(payload, config.get("refreshKey"))
    return {accessToken, refreshToken, expiresIn:3600}
}


async save (userId, refreshToken){
const data = await Token.findOne({userId})
    if(data){
        data.refreshToken = refreshToken
        return data.save()
    }
    const token =  await Token.create({userId, refreshToken})
    return token
}


validateRefresh(refreshToken){
    try {
        return jwt.verify(refreshToken, config.get("refreshKey"))
    }catch (e){
        return null
    }
}

validateAccess(accessToken){
    try {
        return jwt.verify(accessToken, config.get("accessKey"))
    }catch(e){
        return null
    }
}

async findToken(refreshToken){
        try {
            return await Token.findOne({refreshToken})
        }catch (e) {
            return null
        }
    }
}





module.exports = new TokenService()