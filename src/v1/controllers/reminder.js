//const services = require("../services")
const models = require("../models");
//const utils = require("../../utils");
const Errors = require("../services/Errors");
const message = require("../messages");
const {sendEmail} = require("../../api/gmail");
const { pagination } = require("../../utils");

exports.create = async (req, res, next) => {
  try {
    const { title, event_date, details, participants } = req.body
    const reminder = await models.Reminders.query().insertGraphAndFetch({
      user_id: req.user.id,
      title, event_date, details,
      deleted_flag:false,
      created_by: req.user.id,
      participants: participants.map(participants => ({
        email: participants,
        created_by: req.user.id,
        created_on: new Date()
      })),
    });

    //send mail
    participants.forEach(element => {
      const message = `Hi </br></br> ${req.user.user_name} setup a reminder with details below </br></br> ${details}`; 
      sendEmail(element,title,"", message);
    });

    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

exports.getReminder = async (req, res, next) => {
  try {
    const reminder = await models.Reminders.query().where({user_id:req.user.id, deleted_flag: false}).withGraphFetched({participants:true});
    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

exports.fetchReminders = async (req, res, next) => {
  try {

    req.query.deleted_flag = false;
    const { sort_by = 'created_on', sort_dir = 'DESC', limit = 10, page = 1, search = "", search_fields = "" } = req.query
    const { results: reminders, page_info } = await pagination(models.Reminders.query().
    where({user_id:req.user.id, deleted_flag: false}).withGraphFetched({participants:true})
    ,search, search_fields, page, limit, sort_by, sort_dir);
    
    return res.status(200).json({ status: "success", message: message.success, data: { reminders, page_info } });

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

    await reminder.$query().patchAndFetch({
      event, details, event_date, modified_on: new Date(), modified_by: req.user.id
    });

    return res.status(200).json({ status: "success", message: message.success, data: reminder });
  } catch (error) {
    next(error)
  }
}

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    const reminder = await models.Reminders.query().findOne({ id, deleted_flag: false });
    console.log(reminder.id);
    if (!reminder) throw new Errors.NotFound("Record not found");
    await reminder.$query().patchAndFetch({ deleted_flag: true, deleted_on: new Date(), deleted_by: req.user.id });
    return res.status(200).json({ status: "success", message: message.success });
  } catch (error) {
    next(error)
  }
}

exports.notification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await models.Reminders.query().findOne({ id, deleted_flag: false });

    if (!reminder) throw new Errors.NotFound("Record not found");

    //reminder.$query().update({ deleted_flag: true, deleted_on: new Date(), deleted_by: req.user.id });

    return res.status(200).json({ status: "success", message: message.success });
  } catch (error) {
    next(error)
  }
}