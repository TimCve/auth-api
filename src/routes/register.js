const router = require("express").Router()
const User = require("../models/user")
const sha256 = require("sha256")

router.post("/", async (req, res) => {
	try {
		const userInfo = {
			email: req.body.email,
			password: req.body.password,
			passwordCheck: req.body.passwordCheck,
			displayName: req.body.displayName
		}

		await User.findOne({ "email": userInfo.email })
			.then(user => {
				if (user) {
					return res.status(400).json({ msg: "A user with this email already exists" })
				} else {
					if (!userInfo.email || !userInfo.password || !userInfo.passwordCheck) {
						return res.status(400).json({ msg: "Not all required fields have been filled" })
					}
					if (userInfo.password.length < 5) {
						return res.status(400).json({ msg: "Password too short. Must be at least 5 characters" })
					}
					if (userInfo.password !== userInfo.passwordCheck) {
						return res.status(400).json({ msg: "Passwords don't match" })
					}
					if (!userInfo.displayName) {
						userInfo.displayName = userInfo.email
					}

					const newUser = new User({
						"email": userInfo.email,
						"password": sha256.x2(userInfo.password),
						"displayName": userInfo.displayName
					})

					newUser.save()
						.then(user => {
							res.status(200).json(user)
						})
						.catch(err => {
							res.status(500).json({ "error": err.message })
						})

				}
			})
			.catch(err =>
				res.status(500).json({ error: err.message })
			)
	} catch (err) {
		return res.status(500).json({ error: err.message })
	}
})

module.exports = router