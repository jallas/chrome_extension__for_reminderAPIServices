//const services = require("../services")
const models = require("../models");
//const utils = require("../../utils");
const Errors = require("../services/Errors");
const message = require("../messages");

exports.create = async (req, res, next) => {
  try {
    const { title, event_date, details, participants } = req.body

    console.log(req.user);
    const reminder = await models.Reminders.query().insertGraphAndFetch({
      user_id: req.user.id,
      title, event_date, details,
      participants: participants.map(participants => ({
        email: participants,
        created_by: req.user.id,
        created_on: new Date()
      })),
    });
    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { event, event_date, details } = req.body;
    const { id } = req.params;
    const reminder = await models.Reminders.query().findOne({ id, deleted_flag: false });

    if (!reminder) throw new Errors.NotFound("Record not found");

    await reminder.$query().updateAndFetch({
      event, details, event_date, modified_on: new Date(), modified_by: req.user.id
    });

    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await models.Reminders.query().findOne({ id, deleted_flag: false });

    if (!reminder) throw new Errors.NotFound("Record not found");

    reminder.$query().update({ deleted_flag: true, deleted_on: new Date(), deleted_by: req.user.id });

    return res.status(200).json({ status: "success", message: message.success });
  } catch (error) {
    next(error)
  }
}