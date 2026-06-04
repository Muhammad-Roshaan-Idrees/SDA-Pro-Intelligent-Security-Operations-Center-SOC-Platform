// notification-service/src/services/EnterpriseNotificationFactory.js
// PATTERN: Abstract Factory — Concrete Factory (Enterprise Tier)

const EmailNotifier     = require('../channels/EmailNotifier');
const SlackNotifier     = require('../channels/SlackNotifier');
const PagerDutyNotifier = require('../channels/PagerDutyNotifier');

class EnterpriseNotificationFactory {
  createEmailNotifier()     { console.log('[EnterpriseFactory] Creating EmailNotifier');     return new EmailNotifier('smtp-relay.enterprise.internal'); }
  createSlackNotifier()     { console.log('[EnterpriseFactory] Creating SlackNotifier');     return new SlackNotifier('https://hooks.slack.com/enterprise/soc-security-team'); }
  createPagerDutyNotifier() { console.log('[EnterpriseFactory] Creating PagerDutyNotifier'); return new PagerDutyNotifier('ENTERPRISE_PD_KEY_XYZ', '24x7-SOC-OnCall'); }
}

module.exports = EnterpriseNotificationFactory;
