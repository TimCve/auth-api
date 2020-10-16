const router = require("express").Router()
const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/refreshToken")

router.post("/", async (req, res) => {
	try {
    // gets the refresh token from the request header
    const refreshToken = req.header("x-refresh-token")

    // if refresh token is not passed, return 401 status
    if(!refreshToken) {
      return res.status(401).json({"msg": "No refresh token passed"})
    }

    await RefreshToken.findOne({"token": refreshToken})
    .then(token => {
      if(!token) {
        res.status(403).json({"msg": "Invalid refresh token"})
      } else {
        // decode the info from the refresh token
        const decodedTokenInfo = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        // encode the uid decoded from the refresh token into a new access token
        const newToken = jwt.sign({id: decodedTokenInfo.id}, process.env.JWT_SECRET, {expiresIn: "2m"})

        // return that access token and a 200 status
        return res.status(200).json({"accessToken": newToken})
      }
    })
	} catch (err) {
		res.status(500).json({ "error": err.message })
	}
})

module.exports = router