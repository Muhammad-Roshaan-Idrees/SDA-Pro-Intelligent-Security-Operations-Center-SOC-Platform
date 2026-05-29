// PATTERN: Singleton
// PATTERN: Observer
// RATIONALE: Single source of truth for event coordination across all services

class EventBusPublisher {
    static instance;
    observers = new Map();

    constructor() {
        if (EventBusPublisher.instance) {
            return EventBusPublisher.instance;
        }
        EventBusPublisher.instance = this;
    }

    static getInstance() {
        if (!EventBusPublisher.instance) {
            EventBusPublisher.instance = new EventBusPublisher();
        }
        return EventBusPublisher.instance;
    }

    attach(eventType, observer) {
        if (!this.observers.has(eventType)) {
            this.observers.set(eventType, []);
        }
        this.observers.get(eventType).push(observer);
    }

    detach(eventType, observer) {
        if (this.observers.has(eventType)) {
            const observers = this.observers.get(eventType);
            const index = observers.indexOf(observer);
            if (index > -1) observers.splice(index, 1);
        }
    }

    notify(event) {
        const observers = this.observers.get(event.type) || [];
        observers.forEach(observer => observer.update(event));
    }

    // Domain events from document Section 4 (Async Events table)
    publishAlertIngested(alert) {
        this.notify({ type: 'AlertIngested', data: alert, timestamp: new Date() });
    }

    publishAlertEnriched(alert) {
        this.notify({ type: 'AlertEnriched', data: alert, timestamp: new Date() });
    }

    publishIncidentCreated(incident) {
        this.notify({ type: 'IncidentCreated', data: incident, timestamp: new Date() });
    }

    publishIncidentStateChanged(incident, oldState, newState) {
        this.notify({ 
            type: 'IncidentStateChanged', 
            data: { incident, oldState, newState },
            timestamp: new Date()
        });
    }

    publishResponseActionExecuted(action, result) {
        this.notify({ 
            type: 'ResponseActionExecuted', 
            data: { action, result },
            timestamp: new Date()
        });
    }

    publishThreatIntelUpdated(intel) {
        this.notify({ type: 'ThreatIntelUpdated', data: intel, timestamp: new Date() });
    }
}

module.exports = EventBusPublisher;