const jwt = require("jsonwebtoken")

const jwtKey = "my_secret"
const jwtExpirySeconds = '5h'



module.exports.createToken= function (email) {

    return jwt.sign({ email }, jwtKey, {
           algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
         })

};
module.exports.verifyToken= function (token) {
    return   jwt.verify(token, jwtKey );
   
};
exports.renewToken =  async(req,res,next)=>{
    console.log(req.body.userid);
    const email =req.body.userid
    const refreshtoken= jwt.sign({ email }, jwtKey, {
        		algorithm: "HS256",
         		expiresIn: jwtExpirySeconds,
         	});
    res.send({refreshToken:refreshtoken});
    
}
