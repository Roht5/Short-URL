const express=require('express');
const {handleUserSignup,handleGetUsers,handleUserLogin}=require('../controller/user');
const router=express.Router();

router.get("/signup",async(req,res)=>{
    return res.render("signUp",);
});

router.get("/login",async(req,res)=>{
    return res.render("login",);
});
router.post('/user/signup',handleUserSignup);
router.get('/getUsers',handleGetUsers);
router.post('/user/login',handleUserLogin);

module.exports=router;