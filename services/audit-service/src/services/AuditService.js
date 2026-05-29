// PATTERN: Observer (Consumer)
// RATIONALE: Consumes events from EventBus for immutable audit logging

class AuditService {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
        this.auditLogs = []; // In-memory storage for demo
    }

    // Called by Observer pattern when events are published
    async logEvent(event) {
        const auditEntry = {
            id: this.generateId(),
            eventType: event.type,
            eventId: event.id,
            source: event.source,
            data: event.data,
            timestamp: event.timestamp,
            createdAt: new Date().toISOString()
        };

        this.auditLogs.unshift(auditEntry); // Add to beginning (newest first)
        
        // Store in repository (PostgreSQL in production)
        if (this.auditRepository) {
            await this.auditRepository.save(auditEntry);
        }
        
        console.log(`[AuditService] Logged: ${event.type} at ${event.timestamp}`);
        return auditEntry;
    }

    async getLogs(filters = {}) {
        let logs = [...this.auditLogs];
        
        if (filters.eventType) {
            logs = logs.filter(l => l.eventType === filters.eventType);
        }
        if (filters.startDate) {
            logs = logs.filter(l => l.timestamp >= filters.startDate);
        }
        if (filters.endDate) {
            logs = logs.filter(l => l.timestamp <= filters.endDate);
        }
        
        return logs.slice(0, filters.limit || 100);
    }

    async getByIncidentId(incidentId) {
        return this.auditLogs.filter(log => 
            log.data?.incident?.id === incidentId || 
            log.data?.incidentId === incidentId
        );
    }

    async generateComplianceReport(type) {
        const report = {
            type: type,
            generatedAt: new Date().toISOString(),
            totalEvents: this.auditLogs.length,
            eventsByType: {},
            timeline: []
        };

        // Group by event type
        this.auditLogs.forEach(log => {
            report.eventsByType[log.eventType] = (report.eventsByType[log.eventType] || 0) + 1;
        });

        // Get last 7 days timeline
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        report.timeline = this.auditLogs
            .filter(log => new Date(log.timestamp) >= last7Days)
            .map(log => ({ date: log.timestamp.split('T')[0], eventType: log.eventType }));

        return report;
    }

    generateId() {
        return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = AuditService;