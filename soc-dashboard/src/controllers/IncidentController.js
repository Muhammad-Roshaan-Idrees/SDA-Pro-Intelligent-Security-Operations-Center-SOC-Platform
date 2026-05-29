// PATTERN: MVC (Controller)
// RATIONALE: Handles HTTP requests for incident management

class IncidentController {
    constructor(incidentService) {
        this.incidentService = incidentService;
    }

    async getIncidents(req, res) {
        try {
            const { queue, limit = 50, offset = 0 } = req.query;
            const incidents = await this.incidentService.getAll({ queue, limit, offset });
            res.json({
                success: true,
                data: incidents,
                pagination: { limit, offset, total: incidents.length },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getIncidentById(req, res) {
        try {
            const { id } = req.params;
            const incident = await this.incidentService.getById(id);
            if (!incident) {
                return res.status(404).json({ success: false, error: 'Incident not found' });
            }
            res.json({ success: true, data: incident, timestamp: new Date().toISOString() });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateIncidentState(req, res) {
        try {
            const { id } = req.params;
            const { action } = req.body;
            const result = await this.incidentService.updateState(id, action);
            res.json({ success: true, data: result, timestamp: new Date().toISOString() });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async executeManualAction(req, res) {
        try {
            const { id } = req.params;
            const { actionType, parameters } = req.body;
            const result = await this.incidentService.executeAction(id, actionType, parameters);
            res.json({ success: true, data: result, timestamp: new Date().toISOString() });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = IncidentController;