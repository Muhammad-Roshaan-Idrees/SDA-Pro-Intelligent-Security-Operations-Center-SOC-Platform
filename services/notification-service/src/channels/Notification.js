// notification-service/src/channels/Notification.js

const Priority = Object.freeze({ LOW:'LOW', MEDIUM:'MEDIUM', HIGH:'HIGH', CRITICAL:'CRITICAL' });

class Notification {
  constructor(subject, body, recipient, priority) {
    this.subject   = subject;
    this.body      = body;
    this.recipient = recipient;
    this.priority  = priority;
  }
}

module.exports = { Notification, Priority };
