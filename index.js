const express = require('express');
const logger = require('./services/logger');

const app = express();
require('./startup/logging')();
require('./startup/config')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}. Environment: ${app.get('env')}...`));

module.exports = server;