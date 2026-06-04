// notification-service/src/services/BasicNotificationFactory.js
// PATTERN: Abstract Factory — Concrete Factory (Basic Tier)

const EmailNotifier     = require('../channels/EmailNotifier');
const SlackNotifier     = require('../channels/SlackNotifier');
const PagerDutyNotifier = require('../channels/PagerDutyNotifier');

class BasicNotificationFactory {
  createEmailNotifier()     { console.log('[BasicFactory] Creating EmailNotifier');     return new EmailNotifier('smtp.gmail.com'); }
  createSlackNotifier()     { console.log('[BasicFactory] Creating SlackNotifier');     return new SlackNotifier('https://hooks.slack.com/basic/general-alerts'); }
  createPagerDutyNotifier() { console.log('[BasicFactory] Creating PagerDutyNotifier'); return new PagerDutyNotifier('BASIC_PD_KEY_ABC', 'BusinessHours-Escalation'); }
}

module.exports = BasicNotificationFactory;
