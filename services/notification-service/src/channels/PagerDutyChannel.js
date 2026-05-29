// PATTERN: Abstract Factory (Product)
// RATIONALE: Creates PagerDuty notification channel

class PagerDutyChannel {
    constructor(config = {}) {
        this.apiKey = config.apiKey || 'pagerduty_api_key';
        this.serviceId = config.serviceId || 'service_123';
        this.fromEmail = config.fromEmail || 'alerts@sdapro.com';
    }

    async send(notification) {
        const { title, message, severity, incidentId } = notification;
        
        const pagerDutyEvent = {
            payload: {
                summary: title || 'SDA-Pro Security Alert',
                timestamp: new Date().toISOString(),
                severity: severity || 'critical',
                source: incidentId || `incident_${Date.now()}`
            },
            routing_key: this.apiKey,
            event_action: 'trigger',
            client: 'SDA-Pro SOC Platform',
            client_url: 'https://sdapro.example.com'
        };
        
        console.log(`[PagerDutyChannel] Creating alert: ${pagerDutyEvent.payload.summary}`);
        console.log(`[PagerDutyChannel] Severity: ${pagerDutyEvent.payload.severity}`);
        
        // In production, use @pagerduty/pdjs
        // For demo, simulate successful send
        return {
            success: true,
            channel: 'pagerduty',
            incidentId: `pd_${Date.now()}`,
            sentAt: new Date().toISOString()
        };
    }

    getName() {
        return 'PagerDutyChannel';
    }
}

module.exports = PagerDutyChannel;