const router = require("express").Router()
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const blackListedToken = require("../models/blacklistedAccessToken")

router.post("/", async (req, res) => {
  try {
    const token = req.header("x-auth-token")
    if(!token) return res.json(false)

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
    if(!verifiedToken) return res.json(false)

    await blackListedToken.findOne({"token": token})
    .then(token => {
      if(token) {
        return res.status(401).json(false)
      } else {
        User.findById(verifiedToken.id)
        .then(user => {
          if(!user) {
            return res.json(false)
          } else {
            return res.json(true)
          }
        })
      }
    })
  } catch(err) {
    res.json(false)
  }
})

module.exports = router