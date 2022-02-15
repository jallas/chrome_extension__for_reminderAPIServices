require('dotenv').config()
const moment = require("moment");
const cron = require('node-cron')
const { raw } = require('objection')
const knex = require("./src/v1/models/db");
const rest = require('./src/utils/rest')
const config = require('./src/v1/config')
const models = require('./src/v1/models');

async function Reminder_notification() {

    const reminders = await models.Reminders.query().select().where({deleted_flag:true}).andWhereRaw(`DATE_FORMAT(event_date, "%y-%m-%d") > :date`, { date: moment().format('YYYY-MM-DD') }).withGraphFetched({ participants:true });

    console.log(reminders.length)
    for (const reminder of reminders) {
      try {
        const title = `${reminder.event}`
        const message = `Hi, \n\n you have an event on ${moment(reminder.event_date).format('YYYY-MM-DD HH:mm:ss a')}`
        
        //alert pop message
        
    } catch (error) {
        console.error(error)
      }
    }
}

cron.schedule('*/10 * * * *', function () {
    console.log('running tasks every 10mins on', new Date());
    Reminder_notification()
})

