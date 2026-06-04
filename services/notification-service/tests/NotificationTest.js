// notification-service/tests/NotificationTest.js

const EnterpriseNotificationFactory = require('../src/services/EnterpriseNotificationFactory');
const BasicNotificationFactory      = require('../src/services/BasicNotificationFactory');
const NotificationService           = require('../src/services/NotificationService');
const { Notification, Priority }    = require('../src/channels/Notification');

let passed = 0, failed = 0;
function assert_(cond, name) { if (cond) { console.log(`  PASS: ${name}`); passed++; } else { console.log(`  FAIL: ${name}`); failed++; } }

console.log('=== Notification Service Tests ===\n');

// Enterprise factory
let r = new EnterpriseNotificationFactory().createEmailNotifier().send(new Notification('T','B','soc@corp.com', Priority.HIGH));
assert_(r.success,          'Enterprise email: success');
assert_(r.channel==='Email','Enterprise email: channel=Email');

r = new EnterpriseNotificationFactory().createSlackNotifier().send(new Notification('T','B','#soc', Priority.HIGH));
assert_(r.success,          'Enterprise slack: success');
assert_(r.channel==='Slack','Enterprise slack: channel=Slack');

r = new EnterpriseNotificationFactory().createPagerDutyNotifier().send(new Notification('T','B','on-call', Priority.CRITICAL));
assert_(r.success,               'Enterprise pagerduty: success');
assert_(r.channel==='PagerDuty', 'Enterprise pagerduty: channel=PagerDuty');

// Basic factory
r = new BasicNotificationFactory().createEmailNotifier().send(new Notification('T','B','admin@co.com', Priority.LOW));
assert_(r.success, 'Basic email: success');

// dispatchAllChannels
const svc = new NotificationService(new EnterpriseNotificationFactory());
const results = svc.dispatchAllChannels('Alert','Body','e@c.com','#ch', Priority.CRITICAL);
assert_(results.length === 3,                          'dispatchAll: 3 results');
assert_(results.every(r => r.success),                 'dispatchAll: all succeed');

// Same code different factory
const r1 = new NotificationService(new EnterpriseNotificationFactory()).dispatchAllChannels('S','B','e@e.com','#c', Priority.HIGH);
const r2 = new NotificationService(new BasicNotificationFactory()).dispatchAllChannels('S','B','e@e.com','#c', Priority.HIGH);
assert_(r1.every(r=>r.success), 'Enterprise all succeed');
assert_(r2.every(r=>r.success), 'Basic all succeed');

// Unknown channel throws
try { svc.dispatchSingleChannel('whatsapp', new Notification('S','B','r', Priority.LOW)); assert_(false, 'Unknown channel should throw'); }
catch(e) { assert_(true, 'Unknown channel correctly throws'); }

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
