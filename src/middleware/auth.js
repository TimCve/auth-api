const jwt = require("jsonwebtoken")
const blackListedToken = require("../models/blacklistedAccessToken")

// auth middleware
const auth = (req, res, next) => {
  try {
    // gets jwt from request header
    const token = req.header("x-auth-token")

    // 401 status if no token passed
    if(!token) {
      return res.status(401).json({"msg": "No authentication token; access denied"})
    }

    // 401 status if token is invalid
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
    if(!verifiedToken) {
      return res.status(401).json({"msg": "Token verification failed; access denied"})
    }

    blackListedToken.findOne({"token": token})
    .then(token => {
      if(token) {
        return res.status(401).json({"msg": "This access token is blacklisted"})
      } else {
        // sets the user in the request to the id decoded from the jwt
        req.user = verifiedToken.id

        // calls the next function (the actual route contents)
        next()
      }
    })
  } catch(err) {
    res.status(500).json({"error": err.message})  
  }
}

module.exports = auth