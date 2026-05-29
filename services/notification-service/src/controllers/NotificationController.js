// PATTERN: MVC (Controller)
// RATIONALE: Handles HTTP requests for notifications

class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }

    async dispatchNotification(req, res) {
        try {
            const { channel, to, subject, message, severity, incidentId } = req.body;
            
            const result = await this.notificationService.dispatch({
                channel,
                to,
                subject,
                message,
                severity,
                incidentId
            });
            
            res.json({
                success: true,
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async dispatchToAll(req, res) {
        try {
            const { to, subject, message, severity, incidentId } = req.body;
            
            const results = await this.notificationService.dispatchToAll({
                to,
                subject,
                message,
                severity,
                incidentId
            });
            
            res.json({
                success: true,
                data: results,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getHistory(req, res) {
        try {
            const { limit = 50 } = req.query;
            const history = await this.notificationService.getDeliveryHistory(limit);
            res.json({ success: true, data: history });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getStats(req, res) {
        try {
            const stats = await this.notificationService.getStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = NotificationController;