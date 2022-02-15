const services = require("../services")
const models = require("../models");
const utils = require("../../utils");
const Errors = require("../services/Errors");
const message = require("../messages");


/*The first time a user open the extesnion the user details will be saved into a database, this will enable fetch related data */
exports.create = async (req, res, next) => {
  try {
    const { event, event_date, participants } = req.body
    const reminder = await models.Reminders.query().insertGraphAndFetch({
      event, event_date,
      participants: participants.map(participants => ({
        features: participants.email,
        created_by: req.user.id,
        created_on: new Date()
      })),
    });
    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

/*Each time a user open the extension it will perform login action to get user token and save to browser*/
exports.update = async (req, res, next) => {
  try {
    const { event, event_date, participants } = req.body;
    const { id } = req.params;
    const reminder = await models.Reminders.query().findOne({ id, deleted_flag: false });

    if (!reminder) throw new Errors.NotFound("Record not found");

    await models.Reminders.query().insertGraphAndFetch({
      event, event_date,
      participants: participants.map(participants => ({
        features: participants.email,
        created_by: req.user.id,
        created_on: new Date()
      })),
    });

    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}