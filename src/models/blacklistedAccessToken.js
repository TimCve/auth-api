const mongoose = require("mongoose")

const blackListedTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model("blacklistedtokens", blackListedTokenSchema)