const router = require("express").Router()
const auth = require("../middleware/auth")
const User = require("../models/user")

router.delete("/", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user, (err, user) => {
      if (err){ 
        return res.status(500).json({"error": err.message}) 
      } else {
        if(user) {
          return res.status(200).json({"msg": "Successfully deleted user"})
        } else {
          return res.status(400).json({"msg": "User does not exist"})
        }
      }
    })
  } catch(err) {
    res.status(500).json({"error": err.message})  
  }
})

module.exports = router