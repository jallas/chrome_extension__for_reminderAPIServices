const router = require("express").Router()
const { validate, Joi } = require('express-validation')
const reminder = require("../controllers/reminder")
const { validateUser } = require("../middlewares/auth")

router.post("/create", validateUser(), reminder.create);
router.get("/", validateUser(), reminder.fetchReminders);

router.post("/update", validate({
    body: Joi.object({
        title: Joi.string().required(),
        details: Joi.string().required(),
        event_date: Joi.string().required(),
        participants:Joi.array().required()
    }),
}), validateUser(), reminder.update);

router.put("/cancel/:id", validateUser(), reminder.cancel);
router.put("/notification/:id", validateUser(), reminder.notification);

module.exports = router