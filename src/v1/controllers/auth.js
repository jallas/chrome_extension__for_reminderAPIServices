const services = require("../services");

/*The first time a user open the extesnion the user details will be saved into a database, this will enable fetch related data */
exports.initialization = async (req, res, next) => {
  try {
    const { email, device, device_os } = req.body
    const { success, status = 200, message, data } = await new services.Auth()
      .initialize(email, device, device_os)
    return res.status(status).json({ status: success ? "success" : "error", message, data })
  } catch (error) {
    next(error)
  }
}


/*Each time a user open the extension it will perform login action to get user token and save to browser*/ 
exports.login = async (req, res, next) => {
  try {
    const { email, device, device_os } = req.body;
    const authInstance = new services.Auth()
    const data = await authInstance.login(email, device, device_os)
    res.json({ status: "success", message: "Successful", data: Object.assign(data.user, { token: data.token }) })
  } catch (error) {
    next(error)
  }
}
