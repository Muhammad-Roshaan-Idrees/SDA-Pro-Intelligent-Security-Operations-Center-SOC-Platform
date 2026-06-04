// Simple runner for notification-service to keep container alive and demonstrate service
const NotificationService = require('./services/NotificationService');
const svc = new NotificationService();
console.log('Notification service started (demo).');
setInterval(()=>{}, 1000);
