// notification-service/src/services/NotificationService.js
// Orchestrates dispatching using the Abstract Factory.

const { Notification } = require('../channels/Notification');

class NotificationService {
  constructor(factory) { this._factory = factory; }

  dispatchAllChannels(subject, body, emailRecipient, slackChannel, priority) {
    return [
      this._factory.createEmailNotifier().send(new Notification(subject, body, emailRecipient, priority)),
      this._factory.createSlackNotifier().send(new Notification(subject, body, slackChannel, priority)),
      this._factory.createPagerDutyNotifier().send(new Notification(subject, body, 'on-call', priority))
    ];
  }

  dispatchSingleChannel(channel, notification) {
    const map = { email: () => this._factory.createEmailNotifier(), slack: () => this._factory.createSlackNotifier(), pagerduty: () => this._factory.createPagerDutyNotifier() };
    const fn = map[channel.toLowerCase()];
    if (!fn) throw new Error(`Unknown channel: ${channel}`);
    return fn().send(notification);
  }
}

module.exports = NotificationService;
