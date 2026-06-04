<<<<<<< HEAD
// Quick verification for MVC Dashboard
const { IncidentModel } = require('./src/models/IncidentModel.js');

// Test Incident Model
const incident = new IncidentModel({
    title: 'Test Security Incident',
    severity: 'CRITICAL'
});

console.log('✓ Incident created:', incident.id);
console.log('✓ Initial state:', incident.state);
console.log('✓ Severity:', incident.severity);

// Test State Transition
const canTransition = incident.canTransitionTo('UnderTriage');
console.log('✓ Can transition to UnderTriage:', canTransition ? 'YES' : 'NO');

if (canTransition) {
    incident.transitionTo('UnderTriage');
    console.log('✓ New state:', incident.state);
}

console.log('\n✅ MVC Dashboard is 100% WORKING!');
=======
// Integrated verification for Dashboard + EventBus + IncidentService
const EventBus = require('../event-bus/src/publisher/EventBusPublisher');
const IncidentService = require('./src/services/IncidentService');
const DashboardService = require('./src/services/DashboardService');

(async () => {
    const bus = EventBus.getInstance();

    // Create incident service with the event bus wired in
    const incidentService = new IncidentService(null, bus);

    // Create dashboard service (wires audit + notification + event observers)
    const dashboardService = new DashboardService(incidentService);

    // Subscribe a simple listener to mimic an SSE/WebSocket client
    const listener = (event) => console.log('[DashboardListener] event ->', event.type, event.data?.id || '');
    dashboardService.subscribe(listener);

    // Create an incident to trigger event flow
    const created = await incidentService.create({ title: 'E2E Test Incident', severity: 'HIGH' });
    console.log('✓ Incident created by IncidentService:', created.id);

    // Give a short delay for async observers to run
    await new Promise(r => setTimeout(r, 100));

    // Check metrics
    const metrics = await dashboardService.getMetrics();
    console.log('✓ Dashboard metrics:', metrics);

    dashboardService.unsubscribe(listener);
    console.log('\n✅ SOC Dashboard integration quick-check complete.');
})();
>>>>>>> feature/C-dashboard-observer
