const helmet = require('helmet');
const compression = require('compression');

module.exports = function (app) {
    if (app.get('env') === 'Production') {
        app.use(helmet());
        app.use(compression());
    }
}