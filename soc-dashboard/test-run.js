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