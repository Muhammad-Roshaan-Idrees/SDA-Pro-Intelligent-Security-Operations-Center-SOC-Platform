// PATTERN: MVC (Controller)
// RATIONALE: Handles HTTP requests for dashboard metrics and real-time updates

class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }

    async getMetrics(req, res) {
        try {
            const metrics = await this.dashboardService.getMetrics();
            res.json({
                success: true,
                data: metrics,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRealtimeUpdates(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const listener = (event) => {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        };
        
        this.dashboardService.subscribe(listener);
        
        req.on('close', () => {
            this.dashboardService.unsubscribe(listener);
        });
    }

    async getDashboardSummary(req, res) {
        try {
            const summary = await this.dashboardService.getSummary();
            res.json({
                success: true,
                data: summary,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = DashboardController;