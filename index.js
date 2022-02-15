require('dotenv').config()
const { ValidationError } = require('express-validation')
const routes = require('./src/v1/routes')
const express = require('express')
const cors = require('cors')
const Errors = require('./src/v1/services/Errors');
const messages = require('./src/v1/messages')
const app = express()
app.set('trust proxy', true);

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logRequest)

async function logRequest(req, res, next) {
  const cleanup = () => {
    res.removeListener('finish', logFn)
    res.removeListener('error', errorFn)
  }
  const logFn = () => {
    cleanup()
    // if (![302, 304].includes(res.statusCode)) {
    const logger = getLoggerForStatusCode(res.statusCode)
    req.body = req.body || {}
    // eslint-disable-next-line no-unused-vars
    const { ...data } = req.body
    logger(`[${new Date().toISOString()}] [${req.user?.id}] ${req.ip} ${req.method} ${req.originalUrl} ${JSON.stringify(data)} ${req.headers['user-agent']} ${res.statusCode} ${res.statusMessage} ${res.get('Content-Length') || 0}b sent`)
    // }
  }
  const errorFn = err => cleanup() || console.trace(`Request pipeline error: ${err}`)
  res.on('finish', logFn)
  res.on('error', errorFn)

  next()
}

const getLoggerForStatusCode = (statusCode) => {
  if (statusCode >= 500) return console.error.bind(console)
  if (statusCode >= 400) return console.warn.bind(console)
  return console.info.bind(console)
}

app.use('/v1', routes)

app.get("/health", (_, res) => res.sendStatus(200))
app.use((req, res) => res.status(404).send({ status: "error", message: messages[404] }))
app.use((err, req, res, next) => {
  if (err instanceof Errors.BaseError) {
    return res.status(err.code).json({ status: "error", message: err.message })
  }
  if (err instanceof ValidationError) return res.status(err.statusCode).json({ status: "error", message: err.details.body[0].message.replace(/["]+/g, '') })
  console.error(err)
  res.status(500).json({ status: "error", message: messages[500] })
})

const listener = app.listen(process.env.PORT, () => console.log(`Listening on PORT: ${listener.address().port}`))
// ssh -R 80:localhost:3004 ssh.localhost.run