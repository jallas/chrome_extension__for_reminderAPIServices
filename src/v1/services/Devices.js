const models = require('../models');
const { raw } = require('objection');

//use to save user device for further analysis later
class Device {
  constructor(user, device) {
    this.user = user;
    this.device = device
  }

  async update({ device_name, device_os }) {
    let device = await models.Devices.query()
      .findOne({ user_id: this.user.id, device_name, device_os, deleted_flag: false })
      .orderBy('id', 'DESC');
    if (!device) {
      device = await models.Devices.query().insertAndFetch({ user_id: this.user.id, device_name, device_os, created_on: raw('NOW()') })
    } else {
      device = await device.$query().patchAndFetch({ device_name, device_os, modified_on: raw('NOW()') });
    }

    console.log(device);
    return { success: true, data: device }
  }
}

module.exports = Device