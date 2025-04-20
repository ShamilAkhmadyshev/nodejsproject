const config = require("config")
const express = require("express")
const mongoose = require("mongoose")
const chalk = require("chalk")
const cors = require("cors")
const router = require("./routes")
const path = require("path")

const initDb = require("./startUp/initDb")
const PORT = config.get("port") ?? "8080"
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use("/api", router)

if(process.env.NODE_ENV === "production"){
    console.log("Production")
    app.use("/", express.static(path.join(__dirname, "client")))
    const indexPath = path.join(__dirname, "client", "index.html")
    app.get("*", (req, res) =>{
        res.send(indexPath)
    })
}

async function start(){
    try {
        await mongoose.connect(config.get("mongoUri"))
        console.log("MongoDB connected")
        initDb()
        app.listen(PORT, ()=> (console.log(chalk.green(`Server is running on ${PORT} port`))))

    }catch(e){
        console.error("Error:", e.message)
        process.exit(1)
    }
}

start()

// app.get("/", (req,res)=>{
//     res.end("fd")
// })


// if(process.env.NODE_ENV === "production"){
//     console.log(chalk.bgBlue("Production"))
// }else{
//     console.log(chalk.bgRed("Development"))
// }