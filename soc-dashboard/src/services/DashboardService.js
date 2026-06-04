// DashboardService: bridges EventBus -> dashboard listeners, audit, notifications
const EventBusPublisher = require('../../event-bus/src/publisher/EventBusPublisher');

const AuditServiceClass = require('../../services/audit-service/src/services/AuditService');
const AuditRepository = require('../../services/audit-service/src/repositories/AuditRepository');
const NotificationService = require('../../services/notification-service/src/services/NotificationService');
const NotificationDispatcher = require('../../event-bus/src/subscribers/NotificationDispatcher');

class DashboardService {
    constructor(incidentService = null) {
        this.incidentService = incidentService;
        this.listeners = new Set();

        // Event bus observer
        this.eventBus = EventBusPublisher.getInstance();

        // Local integrations
        this.auditService = new AuditServiceClass(new AuditRepository());
        this.notificationService = new NotificationService();
        this.notificationDispatcher = new NotificationDispatcher(this.notificationService);

        // Attach observer to domain events
        const self = this;
        this.observer = {
            update(event) {
                // Fire-and-forget audit logging
                try { self.auditService.logEvent(event); } catch (e) { /* ignore */ }

                // Forward to notification dispatcher (non-blocking)
                try { self.notificationDispatcher.update(event); } catch (e) { /* ignore */ }

                // Notify registered dashboard listeners (SSE/WebSocket handlers)
                self.listeners.forEach(listener => {
                    try { listener(event); } catch (e) { /* ignore listener errors */ }
                });
            },
            getObserverId() { return 'DashboardServiceObserver'; }
        };

        // Subscribe to relevant domain events
        ['IncidentCreated', 'IncidentStateChanged', 'ResponseActionExecuted', 'AlertIngested', 'AlertEnriched']
            .forEach(t => this.eventBus.attach(t, this.observer));
    }

    subscribe(listener) {
        this.listeners.add(listener);
    }

    unsubscribe(listener) {
        this.listeners.delete(listener);
    }

    async getMetrics() {
        const incidents = this.incidentService?.getAll ? await this.incidentService.getAll() : [];
        const byState = {};
        (incidents || []).forEach(i => { byState[i.state] = (byState[i.state] || 0) + 1; });
        return { total: incidents.length, byState };
    }

    async getSummary() {
        const incidents = this.incidentService?.getAll ? await this.incidentService.getAll() : [];
        const recent = (incidents || []).slice(0, 10);
        return { total: incidents.length, recent };
    }
}

module.exports = DashboardService;
