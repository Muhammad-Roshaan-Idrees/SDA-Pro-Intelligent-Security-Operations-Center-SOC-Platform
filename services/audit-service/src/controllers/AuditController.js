// PATTERN: MVC (Controller)
// RATIONALE: Handles HTTP requests for audit logs and compliance reporting

class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }

    async getAuditLogs(req, res) {
        try {
            const { eventType, startDate, endDate, limit = 100 } = req.query;
            const logs = await this.auditService.getLogs({ eventType, startDate, endDate, limit });
            res.json({
                success: true,
                data: logs,
                count: logs.length,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getAuditByIncident(req, res) {
        try {
            const { incidentId } = req.params;
            const logs = await this.auditService.getByIncidentId(incidentId);
            res.json({ success: true, data: logs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getComplianceReport(req, res) {
        try {
            const { type } = req.params; // GDPR, SOC2
            const report = await this.auditService.generateComplianceReport(type);
            res.json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = AuditController;