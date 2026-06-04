const IdentityService = require('../src/services/IdentityService');
const service = new IdentityService();

service.authenticate('analyst1', 'password123').then(result => {
    console.log('✅ Identity Service:', result.success ? 'PASS' : 'FAIL');
});