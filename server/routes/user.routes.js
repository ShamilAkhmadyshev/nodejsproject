const express = require("express")
const router = express.Router({mergeParams:true})
const User = require("../models/user")
const auth = require("../middleware/auth.middleware")

router.patch("/:userId", auth, async (req, res) =>{
    try {
        const {userId} = req.params

       if(userId === req.user?.id){
           const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new:true})
           res.send(updatedUser)
       }else return res.status(401).send({message:"Unauthorized"})

    }catch (e){
        return res.status(500).send({message:"server error. Try again later."})
    }
})

router.get("/", auth, async (req, res) =>{
    try {
        if(req.user){
            const list = await User.find()
            return res.send(list)
        }else res.status(401).send({message:"Unauthorized"})

    }catch (e){
      return res.status(500).send({message:"server error. Try again later"})
    }
})

module.exports = router