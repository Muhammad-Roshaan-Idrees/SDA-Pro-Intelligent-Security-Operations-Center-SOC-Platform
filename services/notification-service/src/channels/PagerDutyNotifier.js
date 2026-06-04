// notification-service/src/channels/PagerDutyNotifier.js
// PATTERN: Abstract Factory — Concrete Product

class PagerDutyNotifier {
  constructor(serviceKey, escalationPolicy) {
    this._serviceKey       = serviceKey;
    this._escalationPolicy = escalationPolicy;
  }

  send(notification) {
    console.log(`[PagerDutyNotifier] Key:${this._serviceKey} | Policy:${this._escalationPolicy} | [${notification.priority}] ${notification.subject}`);
    return { success: true, channel: 'PagerDuty', message: `PagerDuty incident triggered: ${this._serviceKey}` };
  }

  getChannelName() { return 'PagerDuty'; }
}

module.exports = PagerDutyNotifier;
