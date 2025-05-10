const jwt = require("jsonwebtoken");
const authentication = (req, res, next) => {
  try {
    let jwtToken = req["headers"].authorization.split(" ")[1];
    if (!jwtToken) {
      throw new Error("Unauthorized");
    }
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY,(err,payload)=>{
      if(err){
        res.status(401);
        throw new Error("Invalid authentication")
      }
      res.payload = payload
      next()
    })
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = authentication;
