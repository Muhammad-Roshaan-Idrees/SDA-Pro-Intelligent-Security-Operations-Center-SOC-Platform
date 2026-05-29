// PATTERN: Observer
// RATIONALE: Dispatches notifications to Email, Slack, PagerDuty based on events

class NotificationDispatcher {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }

    update(event) {
        if (event.type === 'IncidentCreated') {
            this.sendIncidentNotification(event.data);
        }
        
        if (event.type === 'ResponseActionExecuted') {
            this.sendActionNotification(event.data);
        }
        
        if (event.type === 'IncidentStateChanged') {
            this.sendStateChangeNotification(event.data);
        }
    }

    sendIncidentNotification(incident) {
        const message = {
            channel: 'email',
            to: 'soc-analysts@company.com',
            subject: `[ALERT] New Incident: ${incident.id}`,
            body: `Severity: ${incident.severity}\nPlease investigate immediately.`
        };
        
        if (this.notificationService) {
            this.notificationService.dispatch(message);
        }
        console.log(`[NotificationDispatcher] Sent incident notification for ${incident.id}`);
    }

    sendActionNotification(data) {
        console.log(`[NotificationDispatcher] Action ${data.action?.type} completed with result: ${data.result}`);
    }

    sendStateChangeNotification(data) {
        console.log(`[NotificationDispatcher] Incident ${data.incident?.id} changed from ${data.oldState} to ${data.newState}`);
    }
}

module.exports = NotificationDispatcher;