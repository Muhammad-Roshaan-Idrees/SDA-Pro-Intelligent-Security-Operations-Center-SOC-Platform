// PATTERN: Abstract Factory
// RATIONALE: Creates families of related notification channels

const EmailChannel = require('../channels/EmailChannel');
const SlackChannel = require('../channels/SlackChannel');
const PagerDutyChannel = require('../channels/PagerDutyChannel');

class NotificationFactory {
    
    // Create email notifier
    static createEmailNotifier(config) {
        return new EmailChannel(config);
    }
    
    // Create Slack notifier
    static createSlackNotifier(config) {
        return new SlackChannel(config);
    }
    
    // Create PagerDuty notifier
    static createPagerDutyNotifier(config) {
        return new PagerDutyChannel(config);
    }
    
    // Create all notifiers for enterprise
    static createEnterpriseNotifiers() {
        return {
            email: new EmailChannel({ host: 'smtp.company.com', user: 'alerts@company.com' }),
            slack: new SlackChannel({ webhookUrl: process.env.SLACK_WEBHOOK_URL }),
            pagerduty: new PagerDutyChannel({ apiKey: process.env.PAGERDUTY_API_KEY })
        };
    }
    
    // Create basic notifiers (email only)
    static createBasicNotifiers() {
        return {
            email: new EmailChannel({ host: 'smtp.gmail.com', user: 'sdapro@gmail.com' })
        };
    }
}

module.exports = NotificationFactory;