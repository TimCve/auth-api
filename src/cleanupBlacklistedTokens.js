const jwt = require("jsonwebtoken")
const blackListedToken = require("./models/blacklistedAccessToken")

const minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("cleaning blacklisted tokens")
  blackListedToken.find()
  .then(tokens => {
    if(tokens.length) {
      for(let i = 0; i < tokens.length; i++) {
        try {
          jwt.verify(tokens[i].token, process.env.JWT_SECRET)
        } catch {
          blackListedToken.deleteOne({"token": tokens[i].token})
          .catch(err => {
            console.log("error: " + err.message)
          })
        }
      }
    }
  })
  .catch(err => {
    console.log(err.message)
  })
}, the_interval);
