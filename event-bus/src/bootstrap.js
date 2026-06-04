// Bootstrap for event-bus: attach subscribers to EventBus
const EventBus = require('./publisher/EventBusPublisher');
const NotificationDispatcher = require('./subscribers/NotificationDispatcher');
const DashboardUpdater = require('./subscribers/DashboardUpdater');

// Local services (from their packages)
const NotificationService = require('../../services/notification-service/src/services/NotificationService');
const AuditService = require('../../services/audit-service/src/services/AuditService');
const AuditRepository = require('../../services/audit-service/src/repositories/AuditRepository');

const bus = EventBus.getInstance();

// Notification subscriber
const notificationService = new NotificationService();
const notificationDispatcher = new NotificationDispatcher(notificationService);
bus.attach('IncidentCreated', notificationDispatcher);
bus.attach('ResponseActionExecuted', notificationDispatcher);
bus.attach('IncidentStateChanged', notificationDispatcher);

// Dashboard updater (simple websocket manager stub)
const websocketManager = {
    broadcast: (message) => {
        // In demo, just log; real app would push to connected WS clients
        console.log('[WebsocketManager] broadcast =>', message);
    }
};

const dashboardUpdater = new DashboardUpdater(websocketManager);
bus.attach('IncidentCreated', dashboardUpdater);
bus.attach('AlertEnriched', dashboardUpdater);
bus.attach('ResponseActionExecuted', dashboardUpdater);

// Audit wiring (keep a local audit service available for manual use)
const auditService = new AuditService(new AuditRepository());
// Attach a lightweight observer that logs to audit (optional)
bus.attach('IncidentCreated', { update: (e) => auditService.logEvent(e), getObserverId: () => 'BootstrapAuditObserver' });

console.log('EventBus bootstrap: NotificationDispatcher, DashboardUpdater, Audit observer attached.');

module.exports = { bus, notificationDispatcher, dashboardUpdater, auditService };
