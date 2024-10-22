const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserModel = require("./models/user")
const PostModel = require("./models/post")
const AccModel = require("./models/profile")

mongoose.connect("mongodb+srv://swathi:swathi2609@cluster0.em0miqo.mongodb.net/freelance_jobportal_db?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())

//api for signup
app.post("/UserSignup",async(req,res)=>{
    let input=req.body
    let hashedPassword = bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    UserModel.find({email:input.email}).then(
        (items)=>{
            if(items.length>0) {
                res.json({"status":"email already exists"})
            }
            else {
                let result = new UserModel(input)
                result.save()
                res.json({"status":"success"})
            }
        }
    ).catch(
        (error)=>{
            console.log(error.message)
            alert(error.message)
        }
    )
})

//api for signin
app.post("/UserSignin",async(req,res)=>{
    let input = req.body
    let result = UserModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                const passwordValidator = bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {
                    jwt.sign({email:req.body.email,},"freelance-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"error","errorMessage":error})
                            } else {
                                res.json({"status":"success","token":token,"userId":items[0]._id})
                            }
                        }
                    )
                } else {
                    res.json({"status":"Incorrect Password"})
                }
            } else {
                res.json({"status":"Incorrect Email-id"})
            }
        }
    ).catch(
        (error)=>{
            console.log(error.message)
            alert(error.message)
        }
    )
})

//api view user
app.post("/ViewUser", (req, res) => {
    UserModel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    )

})

//api for profile-post creation
app.post("/create",async(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"freelance-app",async(error,decoded)=>{
        if (decoded && decoded.email) {
            let result = new PostModel(input)
            await result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

//api for mypost
app.post("/ViewMine",(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"freelance-app",(error,decoded)=>{
        if (decoded && decoded.email) {
            PostModel.find(input).then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":error})
                }
            )
        } else {
            res.json({"status":"Invalid autehntication"})
        }
    })
})


//api for viewing all posts
app.post("/viewallpost",(req,res)=>{
    let token=req.headers.token
    jwt.verify(token,"freelance-app",(error,decoded)=>{
        if (decoded && decoded.email) {
            PostModel.find().then(
                (items)=>{
                    res.json(items)
            }).catch(
                (error)=>{
                res.json({"status":"error"})
            })
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})


//api for profile update - Account create
app.post("/UpdateAccount",async(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"freelance-app",async(error,decoded)=>{
        if (decoded && decoded.email) {
            let result = new AccModel(input)
            await result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

//api for view updated account
app.post("/ViewAccount",(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"freelance-app",(error,decoded)=>{
        if (decoded && decoded.email) {
            AccModel.find(input).then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":error})
                }
            )
        } else {
            res.json({"status":"Invalid authentication"})
        }
    })
})

//Search Post

app.post("/PostSearch",(req,res)=>{
    let input = req.body
    PostModel.find(input).then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

//delete user
app.post("/delete",(req,res)=>{
    let input=req.body
    UserModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
})

app.listen(8080, ()=>{
    console.log("server started")
})