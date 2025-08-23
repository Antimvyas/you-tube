const { validate } = require("../Module/user");
const { validateToken } = require("../Services/auth");

function checkforauthentication(cookieName){
        return (req,res,next)=>{
            const tokencheck=req.cookies[cookieName]
            if(!tokencheck){
               return next();
            }
            try{
                const userpayload=validateToken(tokencheck);
                req.user=userpayload;
               
            }catch(err){ }
            return next();
        }
}
module.exports={
checkforauthentication,
}