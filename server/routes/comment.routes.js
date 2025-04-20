const express = require("express")
const router = express.Router({mergeParams:true})
const auth = require("../middleware/auth.middleware")
const Comment = require("../models/comment")


router
    .route("/")
    .get(auth, async(req, res) =>{
        try {
            const {orderBy, equalTo} = req.query
          if(!req.user) return res.status(401).send({message:"Unauthorized"})
                const list = await Comment.find({[orderBy]:equalTo})
                return res.send(list)
        }catch (e){
            return res.status(500).send({message:"server error. Try again later"})
        }
    })
    .post(auth, async(req, res)=>{
        try {
            if(!req.user) return res.status(401).send({message:"Unauthorized"})
            const newComment = await Comment.create({...req.body, userId:req.user.id})
            return res.status(201).send(newComment)
        }catch (e){
            res.status(500).send({message:"server error. Try again later"})
        }
    })

router.delete("/:commentId", auth, async (req, res)=>{
    try{
    const {commentId} = req.params
    const removedComment = await Comment.findById(commentId)
    if(removedComment.userId.toString() === req.user.id) {
        await removedComment.deleteOne()
        return res.send(null)
    }else return res.status(401).send({message:"Unauthorized"})
}catch(e){
        return res.status(500).send({message:"server error. Try again later"})
    }
})
module.exports = router