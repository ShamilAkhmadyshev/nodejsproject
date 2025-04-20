const express = require("express")
const router = express.Router({mergeParams:true})
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const {validationResult, check} = require("express-validator")
const {generateUserData} = require("../utils/helper")
const tokenService = require("../services/token.service")

const isTokenInvalid = (data, dbToken) =>{
    return !data || !dbToken || data._id !== dbToken?.userId?.toString()
}

router.post('/signUp', [
    check("email", "Email address is incorrect").isEmail(),
    check("password", "Password must contain at least 8 symbols").isLength({min:8}),
    async (req, res) =>{
        const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    error:{
                        message:"INVALID_DATA",
                        code:400,
                        errors:errors.array()
                    }
                })
            }
        try {
            const {email, password} = req.body
            const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({error:{
                    message:"EMAIL_EXISTS",
                    code:400
                }})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            ...generateUserData(),
            ...req.body,
            password:hashedPassword
        })
        const tokens = tokenService.generate({_id:newUser._id})
        await tokenService.save(newUser._id, tokens.refreshToken)
          return res.status(201).send({...tokens, userId:newUser._id})

        }catch (e){
           return  res.status(500).json({
                message:"server error, try again later"
            })
        }
}])

router.post('/signInWithPassword', [
    check("email", "Email is not valid").normalizeEmail().isEmail(),
    check("password", "Enter your password").exists(),
    async (req, res)=>{
        try {
            const {email, password} = req.body
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).send({
                    error:{
                        message:"INVALID_DATA",
                        code:500
                    }
                })
            }

            const existingUser = await User.findOne({email})
            if(!existingUser){
                return res.status(400).send({
                    error:{
                        message:"EMAIL_NOT_FOUND",
                        code:400
                    }
                })
            }

            const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
            if(!isPasswordEqual){
                return res.status(400).send({
                    error:{
                        message:"INVALID_PASSWORD",
                        code:400
                    }
                })
            }

            const tokens = tokenService.generate({id:existingUser._id})
            await tokenService.save(existingUser._id, tokens.refreshToken)
            return res.status(201).send({...tokens, userId:existingUser._id})

        }catch (e){
            return res.status(500).send({
                message:"server error. Try again later."
            })
        }

    }])

router.post("/token", async (req,res) =>{
try {
const {refresh_token:refreshToken} = req.body
    console.log(refreshToken)
    const data = tokenService.validateRefresh(refreshToken)
    const dbToken = await tokenService.findToken(refreshToken)
    console.log(data)
    console.log(data._id === dbToken?.userId?.toString())
    console.log(data._id, "||", dbToken.userId.toString())

    if(isTokenInvalid(data, dbToken)){
        return res.status(401).send({message:"Unautorized"})
    }

    const tokens = tokenService.generate({id:data._id})
    console.log(tokens)
    await tokenService.save(data._id, tokens.refreshToken)
    res.status(201).send({...tokens, userId:data._id})


}catch (e){
    return res.status(500).send({
        message:"server error. Try again later"
    })
}
    }
)


module.exports = router