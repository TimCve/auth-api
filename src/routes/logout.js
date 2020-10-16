const router = require("express").Router()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const blackListedToken = require("../models/blacklistedAccessToken")
const RefreshToken = require("../models/refreshToken")

router.post("/", auth, async (req, res) => {
	try {
		const token = req.header("x-auth-token")
		const refreshToken = req.header("x-refresh-token")
		
		await RefreshToken.findOneAndDelete({"token": refreshToken})
		.catch(err => {
			console.log(err.message)
		})
		
		newBlackListedToken = new blackListedToken({
			"token": token
		})
		
		newBlackListedToken.save()
    return res.status(200).json({"msg": "Successfull logout"})
	} catch (err) {
		res.status(500).json({ "error": err.message })
	}
})

module.exports = router