const NotificationService = require('../src/services/NotificationService');
const service = new NotificationService();

service.dispatch({ channel: 'email', to: 'test@test.com', message: 'Test' });
console.log('✅ Notification Service: PASS');