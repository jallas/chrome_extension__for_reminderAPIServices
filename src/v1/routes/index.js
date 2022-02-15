const path = require('path');
const fs = require('fs');

const router = require('express').Router();
const routes = fs.readdirSync(__dirname).filter(file => !['index.js'].includes(file));

routes.forEach(routefile => router.use(`/${path.parse(routefile).name}`, require(`./${routefile}`)))

module.exports = router;