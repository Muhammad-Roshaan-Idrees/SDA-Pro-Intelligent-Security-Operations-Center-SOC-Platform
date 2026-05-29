// PATTERN: Repository
// RATIONALE: Data access layer for audit logs

class AuditRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
        this.auditTable = [];
    }

    async save(auditEntry) {
        // In production, this would insert into PostgreSQL
        this.auditTable.push(auditEntry);
        console.log(`[AuditRepository] Saved audit entry: ${auditEntry.id}`);
        return auditEntry;
    }

    async findById(id) {
        return this.auditTable.find(entry => entry.id === id);
    }

    async findAll(filters = {}) {
        let results = [...this.auditTable];
        
        if (filters.eventType) {
            results = results.filter(e => e.eventType === filters.eventType);
        }
        if (filters.limit) {
            results = results.slice(0, filters.limit);
        }
        
        return results;
    }

    async deleteOlderThan(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const initialCount = this.auditTable.length;
        this.auditTable = this.auditTable.filter(entry => 
            new Date(entry.timestamp) >= cutoffDate
        );
        
        return { deleted: initialCount - this.auditTable.length };
    }
}

module.exports = AuditRepository;