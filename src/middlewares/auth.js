const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    
 
  try {
    const  { token } = req.headers; 
    if(token){
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } else {
        res.status(403).send({status: "ERROR", message: "Invalid token"});
    }
  } catch (error) {
    res.status(500).send({status: "ERROR", message: error.message});
  }
};

module.exports = { isAuth}