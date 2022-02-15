const router = require("express").Router()
const { validate, Joi } = require('express-validation')
const reminder = require("../controllers/reminder")
const { validateUser } = require("../middlewares/auth")

router.post("/create", validate({
    body: Joi.object({
        title: Joi.string().required(),
        details: Joi.string().required(),
        event_date: Joi.string().required(),
        participants:Joi.array().required()
    }),
}), validateUser(), reminder.create);

router.post("/update", validate({
    body: Joi.object({
        title: Joi.string().required(),
        details: Joi.string().required(),
        event_date: Joi.string().required(),
        participants:Joi.array().required()
    }),
}), validateUser(), reminder.update);

router.delete("/delete", validateUser(), reminder.update);

module.exports = router