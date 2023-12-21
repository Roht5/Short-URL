const express=require('express');

const URL=require('../models/url');

const router=express.Router();

router.get("/",async(req,res)=>{
    if (!req.user) res.redirect('/login')
    const allUrls=await URL.find({createdBy:req.user._id});
    return res.render("home",{urls:allUrls});
});


module.exports=router;