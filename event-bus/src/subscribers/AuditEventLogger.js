// PATTERN: Observer
// RATIONALE: Every enrichment, classification, and response action is immutably logged

class AuditEventLogger {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }

    async update(event) {
        const auditEntry = {
            id: crypto.randomUUID(),
            eventType: event.type,
            data: event.data,
            timestamp: event.timestamp,
            createdAt: new Date().toISOString()
        };

        if (this.auditRepository) {
            await this.auditRepository.save(auditEntry);
        }
        console.log(`[AuditEventLogger] ${event.type} logged at ${event.timestamp}`);
    }
}

module.exports = AuditEventLogger;