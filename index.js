const express = require("express");
const fs = require('fs');
const mongoose  = require("mongoose");
const { error } = require("console");

const app = express();
const PORT = 8000;

//Connection 
mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error" , err));

//Schema
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName :{
        type:String,
    },
    email :{
        type : String,
        required : true,
        unique : true,
    },
    jobTitle : {
        type :String,
    },
    gender : {
        type : String,
    },

} , 
{timestamps : true}
);

const user = mongoose.model('user' , userSchema);


//---------------------------------------------------------------------------------------------
//Middleware
app.use(express.urlencoded({extended: false})); 

app.use((req,res,next)=>{
    console.log("hello from middleware 1");
next(); 
});


app.use((req,res,next)=>{
    console.log("hello from middleware 2");
next(); 
});





//Route
app.get("/api/users", async (req,res)=>{
    const allDbUsers = await user.find({});
    return res.json(allDbUsers);
});


//Get all data 
app.get("/users" , async (req,res)=>{
    const allDbUsers = await user.find({});
    const html =`
    <ul>
    ${allDbUsers.map((user)=> `<li>${user.firstName} -${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

//Get the particular id with name 
app
.route("/api/users/:id")
.get( async(req,res)=>{  
   const user = await user.findById(req.params.id);
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
})
.patch(async (req,res)=>{
    await user.findByIdAndUpdate(req.params.id,{lastName : "Changed"});
    return res.json({status:"Pending"});
})
.delete(async(req,res)=>{  
    await user.findByIdAndDelete(req.params.id);
     return res.json({status:"Sucess"});
    });

    //Post new Data
app.post("/api/users" , async(req,res)=>{
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json ({msg : "All Fields are req...."});
    }
        const result = await user.create({
            firstName: body.first_name,
            lastname : body.last_name,
            email:body.email,
            gender : body.gender,
            jobTitle : body.job_title,
        });

        return res.status(201).json({msg:"sucess"});
});

//POST is mainly used to post new data and it is posted by an app "POSTMAN" ;

app.listen(PORT , () => console.log(`Server Started at PORT:${PORT}`));