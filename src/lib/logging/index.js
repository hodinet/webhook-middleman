const config = require('config');
const winston = require('winston');

const logger = winston.createLogger({
	levels: winston.config.syslog.levels,
	level: config.get('logging.level'),
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console({
			// log the exceptions
			handleExceptions: true
		})
	],
	// exit on unhandled exceptions
	exitOnError: true
});

// not going to count logging errors
// to console against code coverage
// istanbul ignore next
logger.on('error', (error) => {
	console.log('logger error: ', error);
});

module.exports = logger;
// TODO: handle log levels based on http response code
// NOTE: if you set the logging level above 
module.exports.stream = {
	write: function(message, encoding) {
		// including the encoding in the log to remove eslint warning
		logger.info(message, {logStream: encoding});
	}
};