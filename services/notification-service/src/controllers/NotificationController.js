// notification-service/src/controllers/NotificationController.js

const EnterpriseNotificationFactory = require('../services/EnterpriseNotificationFactory');
const BasicNotificationFactory      = require('../services/BasicNotificationFactory');
const NotificationService           = require('../services/NotificationService');
const { Priority }                  = require('../channels/Notification');

class NotificationController {
  constructor(tier = 'enterprise') {
    const factory = tier === 'enterprise' ? new EnterpriseNotificationFactory() : new BasicNotificationFactory();
    this._service = new NotificationService(factory);
  }

  dispatch(subject, body, email, slack, priority) {
    console.log('\n[NotificationController] POST /notifications/dispatch');
    return this._service.dispatchAllChannels(subject, body, email, slack, priority);
  }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  console.log('=== SDA-Pro: Notification Service ===\n');

  console.log('--- Enterprise Factory ---');
  const enterprise = new NotificationController('enterprise');
  enterprise.dispatch('CRITICAL: Ransomware Detected', 'Host WIN-PROD-01 isolated.',
    'soc@enterprise.com', '#soc-critical', Priority.CRITICAL)
    .forEach(r => console.log(' ', JSON.stringify(r)));

  console.log('\n--- Basic Factory (same code, different factory) ---');
  const basic = new NotificationController('basic');
  basic.dispatch('MEDIUM: Brute Force', '20 failed SSH logins.',
    'admin@company.com', '#general-alerts', Priority.MEDIUM)
    .forEach(r => console.log(' ', JSON.stringify(r)));

  console.log('\n=== Notification Service demo complete ===');
}

module.exports = NotificationController;
