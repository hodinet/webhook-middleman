// make sure the environment variables are loaded early
require('dotenv').config();
const expect = require('chai').expect;
// TODO: do better
// loading the test data
const pagerDutySample = require('./pd-test-message.json');
let server, api;

before((done) => {
	// silent the logs while testing
	const logger = require('../src/lib/logging');
	// optionally if you want the logs, you can set this env variable to true
	// keep in mind env variables are strings
	if (process.env.app_test_do_not_silent_logs === 'true') logger.silent = false;
	else logger.silent = true; 
	// the app
	server = require('../src/index.js');
	server.on('listening', () => {
		api = require('supertest')(server);
		done();
	});
});

after((done) => {
	server.close();
	done();
});

describe('Health checks', () => {
	it('should respond to liveness check with 200 ok', (done) => {
		api.get('/health/liveness').end((error, res) => {
			expect(res.statusCode).to.equal(200);
			done(error);
		});
	});

	it('should respond to readiness check with 200 ok', (done) => {
		api.get('/health/readiness').end((error, res) => {
			expect(res.statusCode).to.equal(200);
			done(error);
		});
	});
});

describe('Pagerduty stub', () => {
	it('should respons with a 202', (done) => {
		api.post('/webhooks/pagerduty-to-slack')
			.send(pagerDutySample)
			.end((error, res) => {
				expect(res.statusCode).to.equal(202);
				done(error);
			});
	});
});