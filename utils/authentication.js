const jwt=require('jsonwebtoken');

function generateAccessToken(payload){
    try{
        const accessToken= jwt.sign(payload, process.env.ACCESS_TOKEN_SECRETKEY, { expiresIn: '1h' });
        return accessToken;

    }catch(err){
        console.log("Error generating the access Token :"+err);
        return null;
    }
}

function generateRefreshToken(payload) {
    try {
        const refreshToken=jwt.sign(payload,process.env.REFRESH_TOKEN_SECRETKEY,{expiresIn:'2h'});
        return refreshToken;
        
    } catch (error) {
        console.log("Error generating the refresh Token :"+ error);
        return null;
    }
    
}

async function verifyAccessToken(receivedAccessToken){
    await jwt.verify(receivedAccessToken,process.env.ACCESS_TOKEN_SECRETKEY,(err,decoded)=>{
        if(err){
            if(err.name==="TokenExpiredError"){
                return "TokenExpiredError";
            }else{
                console.log("Error verifyAccessToken:"+ err);
                return "otherError";
            }
            
        }else{
            return "verified";
        }
    });
}

async function verifyRefreshToken(receivedRefreshToken){
    await jwt.verify(receivedAccessToken,process.env.REFRESH_TOKEN_SECRETKEY,(err,decoded)=>{
        if(err){
            if(err.name==="TokenExpiredError") return "TokenExpiredError";
            else{
                console.log("Error verifyRefreshToken:"+ err);
                return "otherError";
            }
            
        }else{
            return "verified";
        }
    });
}

module.exports={generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken};