const router = require("express").Router()
const User = require("../models/user")
const sha256 = require("sha256")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/refreshToken")

router.post("/", async (req, res) => {
	try {
		const userInfo = {
			"email": req.body.email,
			"password": req.body.password
		}

		if (!userInfo.email || !userInfo.password) {
			res.status(400).json({ "msg": "Not all required fields have been filled" })
		} else {
			await User.findOne({ "email": userInfo.email, "password": sha256.x2(userInfo.password) })
			.then(user => {
				if(user) {
					const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "2m"})
					const refreshToken = jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: "12h"})
		
					const newRefreshToken = new RefreshToken({
						"token": refreshToken
					})
					newRefreshToken.save()

					res.status(200).json({
						"accessToken": token,
						"refreshToken": refreshToken,
						user: {
							"id": user._id,
							"displayName": user.displayName,
							"email": user.email
						}
					})
				} else {
					res.status(403).json({ "msg": "Incorrect username or password" })
				}
			})
			.catch(err => {
				res.status(500).json({ "error": err.message })
			})
		}
	} catch (err) {
		res.status(500).json({ "error": err.message })
	}
})

module.exports = router
