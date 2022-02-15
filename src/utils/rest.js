const got = require("got")

module.exports = {
  async get() {
    try {
      const res = await got.get(...arguments)
      try {
        console.log(arguments[0], res.statusCode, JSON.stringify(res.body))
      } catch (error) { }
      return res
    } catch (error) {
      console.error(arguments[0], error)
      throw error
    }
  },
  async post() {
    try {
      const res = await got.post(...arguments)
      try {
        console.log(arguments[0], JSON.stringify(arguments[1].json || arguments[1].body), res.statusCode, JSON.stringify(res.body), res?.timings?.phases?.total)
      } catch (error) { }
      return res
    } catch (error) {
      console.error(arguments[0], JSON.stringify(arguments[1].json || arguments[1].body), error)
      throw error
    }
  }
}