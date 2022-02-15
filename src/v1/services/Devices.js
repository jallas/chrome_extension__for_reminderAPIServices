const models = require('../models');
const { raw } = require('objection');

//use to save user device for further analysis later
class Device {
  constructor(user, device) {
    this.user = user;
    this.device = device
  }

  async update({ device, os }) {
    let device = await models.Devices.query()
      .findOne({ user_id: this.user.id, device, os, deleted_flag: false })
      .orderBy('id', 'DESC');
    if (!device) {
      device = await models.Devices.query().insertAndFetch({ user_id: this.user.id, device, os, created_on: raw('NOW()') })
    } else {
      device = await device.$query().patchAndFetch({ device, os, modified_on: raw('NOW()') });
    }
    return { success: true, data: device }
  }
}

module.exports = Device