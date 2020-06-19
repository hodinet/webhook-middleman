/**
 * Helpful insights to config files:
 * github repo
 * https://github.com/lorenwest/node-config
 * Config file loading order
 * https://github.com/lorenwest/node-config/wiki/Configuration-Files
 * Environment variable mappings to configs
 * https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables
 */
const pkgj = require('../package.json');

/**
 * Default values
 * See config/custom-environment-variables.js file for
 * which settings can be overriden with environment variables
 */
module.exports = {
	// what port to listen on/expose
	listenPort: 8080,
	// assume the package.json name and version are appropriate
	app: {
		name: pkgj.name,
		version: pkgj.version
	},
	logging: {
		// in production this should be info
		level: 'debug'
	},
	// These need to be set as environment variables
	// or using a configmap mounted as a .env file
	slack: {
		webhookUrl: 'https://slack.com/api/api.test',
		defaultChannel: 'test',
	}
};