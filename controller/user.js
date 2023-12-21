const {v4:uuidv4}=require('uuid');
const User=require('../models/user');
const {setUser}=require('../service/auth');


async function handleUserSignup(req,res) {
    const{name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("login");
}

async function handleUserLogin(req,res) {
    const{email,password}=req.body;
    const user= await User.findOne({email,password});
    console.log(user);
    if (!user) {
        console.log("Is here");
        return res.render('login',{
            error:"Invalid userName or Password"
        })
    }

    const token=setUser(user);
    res.cookie("uid",token);
    return res.redirect("/");
}

 
async function handleGetUsers(req,res) {
    const result=await User.find({});
    return res.json(result);
}


module.exports={
    handleUserSignup,
    handleGetUsers,
    handleUserLogin,
};