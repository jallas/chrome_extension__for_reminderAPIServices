const router = require("express").Router()
const { validate, Joi } = require('express-validation')
const auth = require("../controllers/auth")
//const { validateUser } = require("../middlewares/auth")

router.post("/login", validate({
    body: Joi.object({
        email: Joi.string(),
        device_name: Joi.string(),
        device_os: Joi.string(),
        access_token: Joi.string(),
        user_name: Joi.string()
    }),
}), auth.login);

router.post("/onboard", auth.initialization)

module.exports = router