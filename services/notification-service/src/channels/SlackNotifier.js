// notification-service/src/channels/SlackNotifier.js
// PATTERN: Abstract Factory — Concrete Product

class SlackNotifier {
  constructor(webhookUrl) { this._webhookUrl = webhookUrl; }

  send(notification) {
    console.log(`[SlackNotifier] Webhook:${this._webhookUrl} | Channel:${notification.recipient} | [${notification.priority}] ${notification.subject}`);
    return { success: true, channel: 'Slack', message: `Slack message posted to ${notification.recipient}` };
  }

  getChannelName() { return 'Slack'; }
}

module.exports = SlackNotifier;
