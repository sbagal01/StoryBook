
const express=require('express');
const router= express.Router();
const Story=require('../model/Story');
const {ensureAuth,ensureGuest}=require('../middleware/middle')

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{layout:'login'});
})

router.get('/dashboard',ensureAuth,async (req,res)=>{
    try{
        const stories=await Story.find({user:req.user.id}).lean();
        res.render('dashboard',{
            name:req.user.firstName,
            stories
        });
    }catch(err){
        console.log(err);
        res.redirect('/error/500');
    }
    
    
})
module.exports=router;