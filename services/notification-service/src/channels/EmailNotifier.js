// notification-service/src/channels/EmailNotifier.js
// PATTERN: Abstract Factory — Concrete Product

class EmailNotifier {
  constructor(smtpServer) { this._smtpServer = smtpServer; }

  send(notification) {
    console.log(`[EmailNotifier] SMTP:${this._smtpServer} | TO:${notification.recipient} | SUBJECT:${notification.subject}`);
    return { success: true, channel: 'Email', message: `Email sent to ${notification.recipient}` };
  }

  getChannelName() { return 'Email'; }
}

module.exports = EmailNotifier;
