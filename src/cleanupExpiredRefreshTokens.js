const jwt = require("jsonwebtoken")
const RefreshToken = require("./models/refreshToken")

function cleanRefreshTokens() {
  console.log("cleaning expired refresh tokens")
  RefreshToken.find()
  .then(tokens => {
    if(tokens.length) {
      for(let i = 0; i < tokens.length; i++) {
        try {
          jwt.verify(tokens[i].token, process.env.JWT_REFRESH_SECRET)
        } catch {
          RefreshToken.deleteOne({"token": tokens[i].token})
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
}

cleanRefreshTokens()

const minutes = 120, the_interval = minutes * 60 * 1000
setInterval(cleanRefreshTokens, the_interval)
