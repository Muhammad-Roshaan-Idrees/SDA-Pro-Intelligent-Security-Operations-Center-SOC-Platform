// Bootstrap subscribers and run quick verification for EventBus
require('./src/bootstrap');
const EventBus = require('./src/publisher/EventBusPublisher.js');

// Test 1: Singleton Pattern
const bus1 = EventBus.getInstance();
const bus2 = EventBus.getInstance();
console.log('✓ Singleton Pattern:', bus1 === bus2 ? 'WORKING' : 'FAILED');

// Test 2: Observer Pattern
let eventReceived = false;
class MyObserver {
    update(event) {
        eventReceived = true;
        console.log('✓ Event received:', event.type);
    }
}

const observer = new MyObserver();
bus1.attach('TestEvent', observer);
bus1.notify({ type: 'TestEvent', data: 'Hello' });
console.log('✓ Observer Pattern:', eventReceived ? 'WORKING' : 'FAILED');

// Test 3: Domain Events (will be consumed by wired subscribers)
console.log('\n--- Testing Domain Events (subscribers should react) ---');
bus1.publishIncidentCreated({ id: 'INC-001', severity: 'HIGH' });
bus1.publishResponseActionExecuted({ type: 'BLOCK_IP' }, 'SUCCESS');
bus1.publishAlertIngested({ id: 'ALT-001', source: 'Splunk' });

console.log('\n✅ EventBus quick verification complete.');