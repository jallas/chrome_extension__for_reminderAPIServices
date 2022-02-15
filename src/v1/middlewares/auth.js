const jwt = require("jsonwebtoken");
const messages = require("../messages");
const UsersModel = require("../models/Users")


exports.validateUser = function () {
  return async (req, res, next) => {
    console.log(req.headers.authorization);
    try {
      if (req.headers.authorization?.split(' ')[0].toLowerCase() !== 'bearer') return res.status(401).json({ status: "error", message: messages[401] });
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) return res.status(401).json({ status: "error", message: messages[401] })
      const { id, userid } = jwt.verify(token, process.env.JWT_SECRET)
      // check blacklists etc.
      const user = await UsersModel.query().findOne({ id: id || userid, deleted_flag: false })
      if (!user) return res.status(401).json({ status: "error", message: messages[401] })
      user.ip = req.ip
      user.access_token = token
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({ status: "error", message: messages[401] })
    }
  }
}

