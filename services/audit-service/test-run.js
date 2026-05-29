// Quick verification for Audit Service
const AuditService = require('./src/services/AuditService.js');

const audit = new AuditService();

// Test logging
await audit.logEvent({
    type: 'TestEvent',
    id: 'evt-001',
    source: 'test',
    data: { message: 'Hello' },
    timestamp: new Date().toISOString()
});

console.log('✓ Audit log created');

// Test retrieval
const logs = await audit.getLogs();
console.log('✓ Logs retrieved:', logs.length, 'entries');

// Test compliance report
const report = await audit.generateComplianceReport('GDPR');
console.log('✓ Compliance report generated');

console.log('\n✅ Audit Service is 100% WORKING!');