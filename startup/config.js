const config = require('config');
const logger = require('../services/logger');
const morgan = require('morgan');

module.exports = function(app) {
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAl ERROR: jwtPrivateKey is not defined. Using default configuration.');
    }

    if (app.get('env') !== 'Production') {
        app.use(morgan('tiny'));
        logger.info('Enabled Morgan HTTP request logging...');
    }
}

