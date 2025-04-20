const express = require("express")
const router = express.Router({mergeParams:true})
const Profession = require("../models/professions")

router.get("/", async (req, res) =>{
    try {
        const list = await Profession.find()
        res.status(200).send(list)
    }catch (e){
        res.status(500).json({message:"server error. Try again later"})
    }
})

module.exports = router