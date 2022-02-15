const models = require("../models")
const services = require("../services");
const jwt = require("jsonwebtoken");

class Onboard {
  constructor(user) {
    this.user = user;
  }

  async initialize(email, device, device_os) {
    let user = await models.Users.query()
      .findOne({ email, deleted_flag: false})

    if (user) return { success: true, status: 200, message: 'successful', data: { user }}

    user = await models.Users.query().insert({
        created_on : new Date(),
        status:'Active',
        email
      });
  
      await new services.Device(user).update({ device, device_os })
      await new services.Audit(user).log(services.Audit.types.created_password);

    return {
      success: true, status: 200, message: 'OTP has been sent to your phone number.', data: { user,  
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }) }
    }
  }

  async login(email, device, device_os) {
   
    const users = await models.Users.query().findOne({email, deleted_flag: false});

    if( !users) this.initialize(email, device, device_os)
    await new services.Device(users).update({ device, device_os })

    return { user: users, token: jwt.sign({ id: `${users.id}` }, process.env.JWT_SECRET, { expiresIn: '1h' }) }
  }
}

module.exports = Onboard