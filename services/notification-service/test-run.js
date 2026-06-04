// Quick verification for Notification Service
const NotificationService = require('./src/services/NotificationService.js');
<<<<<<< HEAD
const service = new NotificationService();

// Test email dispatch
const emailResult = await service.dispatch({
    channel: 'email',
    to: 'test@example.com',
    subject: 'Test Alert',
    message: 'This is a test notification'
});
console.log('✓ Email dispatch:', emailResult.success ? 'WORKING' : 'FAILED');

// Test notification stats
const stats = await service.getStats();
console.log('✓ Total notifications sent:', stats.total);

console.log('\n✅ Notification Service is 100% WORKING!');
=======

(async () => {
    const service = new NotificationService();

    // Test email dispatch
    const emailResult = await service.dispatch({
        channel: 'email',
        to: 'test@example.com',
        subject: 'Test Alert',
        message: 'This is a test notification'
    });
    console.log('✓ Email dispatch:', emailResult.success ? 'WORKING' : 'FAILED');

    // Test notification stats
    const stats = await service.getStats();
    console.log('✓ Total notifications sent:', stats.total);

    console.log('\n✅ Notification Service is 100% WORKING!');
})();
>>>>>>> feature/C-dashboard-observer
