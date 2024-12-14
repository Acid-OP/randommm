const express = require("express");
const {UserModel, TodoModel} = require("./db");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const JWT_SECRET = "create yiur own JWT sectret here";
mongoose.connect("put your db URL here");
const bcrypt = require("bcrypt"); 
const {z} = require("zod");

app.post("/signup", async function(req,res){
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const parsedDatawithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDatawithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDatawithSuccess.error
        })
    }

    function sendResponse(res, status, message) {
        return res.status(status).json({ message});
    }

    try{
        const hashedPassword = await bcrypt.hash(password,5);
        await UserModel.create({
            email:email,
            password: hashedPassword,
            name: name
        });
        return sendResponse(res, 200, "You are signed up");
    }catch(e) {
        return sendResponse(res, 500, "User already exists");

    }
    
});

app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    try{
    const user = await UserModel.findOne({
        email: email,
    })

    if(!user) {
        res.status(403).json({
            message: "user does not exist in our db"
        })
        return
    }

    const passwordMatch = bcrypt.compare(password, user.password)
    if(passwordMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }

    }catch(e){
        res.status(500).json({ message: "Server error"});
    }

});

app.post("/todo",auth , async function(req,res){
    const userId = req.userId;
    const title = req.body.title;
    try{
        await TodoModel.create({
            title,
            userId
        })
        res.json({
            userId: userId
        })
    } catch(e){
        res.status(500).json({ message: "Failed to create todo"});
    }

});

app.post("/todos",auth ,async function(req,res){
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
        todos
    })


});

function auth(req,res,next) {
    const token = req.headers.token;

    const decodeData = jwt.verify(token , JWT_SECRET);

    if(decodeData) {
        req.userId = decodeData.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
}

app.listen(3000);
