const express=require("express");
const{model}=require("mongoose");
const User=require("../Module/user");
const router=express.Router();
router.get('/signin',(req,res)=>{
    return res.render('signin');
});
router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchpassword(email, password); // 👈 await here
        // console.log("Token:", token);
       return  res.cookie("token",token).redirect("/");
    } catch (err) {
        return res.render('signin',{
            err:"Incorrent email and password"
        })
    }
});

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
})

router.post('/signup',async (req,res)=>{
    
    const{ Name,email,password}=req.body;
    console.log("name",Name,email,password);
    
    await User.create({
        Name,
        email,
        password,
    });
    return res.redirect('/');
});


module.exports=router;