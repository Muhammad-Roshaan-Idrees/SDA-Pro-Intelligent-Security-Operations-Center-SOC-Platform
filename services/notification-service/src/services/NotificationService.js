// PATTERN: Service Layer
// RATIONALE: Orchestrates notification delivery across channels

const NotificationFactory = require('./NotificationFactory');

class NotificationService {
    constructor(config = {}) {
        this.channels = config.channels || NotificationFactory.createEnterpriseNotifiers();
        this.deliveryHistory = [];
    }

    async dispatch(notification) {
        const { channel, to, subject, message, severity, incidentId } = notification;
        
        const channelMap = {
            'email': this.channels.email,
            'slack': this.channels.slack,
            'pagerduty': this.channels.pagerduty
        };
        
        const notifier = channelMap[channel];
        
        if (!notifier) {
            throw new Error(`Unknown channel: ${channel}`);
        }
        
        const result = await notifier.send({
            to,
            subject,
            body: message,
            message,
            severity,
            incidentId
        });
        
        // Log delivery
        this.deliveryHistory.push({
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            channel: channel,
            recipient: to,
            message: message,
            result: result,
            sentAt: new Date().toISOString()
        });
        
        console.log(`[NotificationService] Dispatched ${channel} notification to ${to}`);
        return result;
    }

    async dispatchToAll(notification) {
        const channels = ['email', 'slack', 'pagerduty'];
        const results = [];
        
        for (const channel of channels) {
            try {
                const result = await this.dispatch({ ...notification, channel });
                results.push(result);
            } catch (error) {
                console.error(`Failed to send via ${channel}:`, error.message);
                results.push({ success: false, channel, error: error.message });
            }
        }
        
        return results;
    }

    async getDeliveryHistory(limit = 50) {
        return this.deliveryHistory.slice(0, limit);
    }

    async getStats() {
        const stats = {
            total: this.deliveryHistory.length,
            byChannel: {},
            bySuccess: { success: 0, failed: 0 }
        };
        
        this.deliveryHistory.forEach(delivery => {
            // By channel
            stats.byChannel[delivery.channel] = (stats.byChannel[delivery.channel] || 0) + 1;
            
            // By success
            if (delivery.result?.success) {
                stats.bySuccess.success++;
            } else {
                stats.bySuccess.failed++;
            }
        });
        
        return stats;
    }
}

module.exports = NotificationService;