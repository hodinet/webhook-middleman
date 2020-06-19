const router = require('express').Router();
const pagerDutySlackHandler = require('./slack/pagerduty');

router.post('/webhooks/pagerduty-to-slack', pagerDutySlackHandler);

function healthStub(req, res){res.status(200).json(req.path);}

router.get('/health/liveness', healthStub);
router.get('/health/readiness', healthStub);

module.exports = router;
