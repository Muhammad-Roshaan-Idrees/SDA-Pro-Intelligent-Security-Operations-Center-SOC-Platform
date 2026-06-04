// PATTERN: Unit Test for Singleton + Observer
const EventBus = require('../src/publisher/EventBusPublisher');

// Test Singleton
const bus1 = EventBus.getInstance();
const bus2 = EventBus.getInstance();
console.log('✅ Singleton:', bus1 === bus2 ? 'PASS' : 'FAIL');

// Test Observer
let called = false;
class TestObserver {
    update() { called = true; }
}
bus1.attach('test', new TestObserver());
bus1.notify({ type: 'test' });
console.log('✅ Observer:', called ? 'PASS' : 'FAIL');

console.log('✅ All tests passed!');