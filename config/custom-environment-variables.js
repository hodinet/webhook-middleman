/**
 * Environment variable mappings to configs
 * https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables
 * 
 */
module.exports = {
	listenPort: 'app_listen_port',
	app: {
		name: 'app_name',
		version: 'app_version'
	},
	logging: {
		level: 'app_log_level'
	},
	slack: {
		webhookUrl: 'slack_webhook_url',
		defaultChannel: 'slack_webhook_channel'
	}
};