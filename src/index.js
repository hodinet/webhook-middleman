require('dotenv').config();
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const logger = require('./lib/logging');
const app = express();

// logging requests - use morgan for requestlogging, but stream outpur through winston
const requestLogger = morgan('tiny', {stream: logger.stream});

// middleware: apache style request logging, body parsing for JSON and url encoded payloads
app.use(requestLogger, express.json(), express.urlencoded({extended: true}));

// route handling - request routing is handled by an express
// Router instance defined in routes/index.js
app.use(require('./routes'));

// start listening for new connections
const server = app.listen(config.get('listenPort'), () => {
	logger.notice(`listening at ${server.address().address}:${server.address().port}`);
});

// export the server - used for testing
module.exports = server;