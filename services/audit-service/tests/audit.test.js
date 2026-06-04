const AuditService = require('../src/services/AuditService');

const audit = new AuditService();
audit.logEvent({ type: 'Test', data: {}, timestamp: new Date() });
const logs = audit.getLogs();
console.log('✅ Audit Service:', logs.length > 0 ? 'PASS' : 'FAIL');