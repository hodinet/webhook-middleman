const config = require('config');
const { IncomingWebhook } = require('@slack/webhook');
const logger = require('../../lib/logging');

// the slack integration webhook 
const url = config.get('slack.webhookUrl');
const channel = config.get('slack.defaultChannel');
// initialize the webhook
const webhook = new IncomingWebhook(url, {channel: channel});
// wrap the pagerduty info we want
// TODO: There is a LOT of info here we could add but this is a POC test...
function wrapPagerDutyMessage(message) {
	return [
		{
			fallback: message.incident.title,
			pretext: 'PagerDuty Incident: ',
			title: message.incident.title,
			fields: [
				{
					title: 'Event:',
					value: message.event,
					short: true
				},
				{
					title: 'Staus:',
					value: message.incident.status,
					short: true
				},
				{
					title: 'Incident URL:',
					value: message.incident.html_url,
					short: false
				}
			]
		}
	];
}

function relayMessage(message) {
	return webhook.send({
		text: 'PagerDuty',
		attachments: wrapPagerDutyMessage(message)
	});
}

// export the handler
module.exports = (req, res) => {
	// respond that we are handling it even if we don't
	res.status(202).json();

	// TODO: this should really just be pushing the message to a worker queue
	const messages = req.body.messages;

	// asynchronously push each message and capture the promise in an array
	const promises = [];
	messages.forEach((message) => {
		promises.push(relayMessage(message));
	});

	// handle the promises only when they all finish OR any one fails
	Promise.all(promises)
		.then(() => {
			logger.debug(`${messages.length} pagerduty events posted to slack`);
		})
		// TODO: unit test for failure
		.catch((reason) => {
			logger.error('error posting pagerduty event to slack', {error: reason});
		});
};