const JWT = require("jsonwebtoken")

const generateToekn = (userId) =>{
    return JWT.sign({ userId }, process.env.JWT_KEY  , {
        expiresIn:"30d"
    });
}

module.exports= {
    generateToekn
}