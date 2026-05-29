// PATTERN: MVC (Model)
// RATIONALE: Data model for incidents with state management

const INCIDENT_STATES = {
    NEW: 'New',
    UNDER_TRIAGE: 'UnderTriage',
    CONTAINMENT: 'Containment',
    ERADICATION: 'Eradication',
    RECOVERY: 'Recovery',
    POST_INCIDENT_REVIEW: 'PostIncidentReview',
    CLOSED: 'Closed'
};

class IncidentModel {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.title = data.title || '';
        this.description = data.description || '';
        this.severity = data.severity || 'MEDIUM';
        this.state = data.state || INCIDENT_STATES.NEW;
        this.sourceAlerts = data.sourceAlerts || [];
        this.assetId = data.assetId || null;
        this.assignedTo = data.assignedTo || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.timeline = data.timeline || [];
        this.responseActions = data.responseActions || [];
    }

    canTransitionTo(newState) {
        const validTransitions = {
            [INCIDENT_STATES.NEW]: [INCIDENT_STATES.UNDER_TRIAGE, INCIDENT_STATES.CLOSED],
            [INCIDENT_STATES.UNDER_TRIAGE]: [INCIDENT_STATES.CONTAINMENT, INCIDENT_STATES.CLOSED],
            [INCIDENT_STATES.CONTAINMENT]: [INCIDENT_STATES.ERADICATION],
            [INCIDENT_STATES.ERADICATION]: [INCIDENT_STATES.RECOVERY],
            [INCIDENT_STATES.RECOVERY]: [INCIDENT_STATES.POST_INCIDENT_REVIEW],
            [INCIDENT_STATES.POST_INCIDENT_REVIEW]: [INCIDENT_STATES.CLOSED],
            [INCIDENT_STATES.CLOSED]: []
        };
        return validTransitions[this.state]?.includes(newState) || false;
    }

    transitionTo(newState, actor = 'system') {
        if (!this.canTransitionTo(newState)) {
            throw new Error(`Invalid state transition from ${this.state} to ${newState}`);
        }
        
        const oldState = this.state;
        this.state = newState;
        this.updatedAt = new Date().toISOString();
        
        this.timeline.push({
            timestamp: new Date().toISOString(),
            action: 'STATE_TRANSITION',
            from: oldState,
            to: newState,
            actor: actor
        });
        
        return { oldState, newState };
    }

    addResponseAction(action) {
        this.responseActions.push({
            ...action,
            executedAt: new Date().toISOString()
        });
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            severity: this.severity,
            state: this.state,
            sourceAlerts: this.sourceAlerts,
            assetId: this.assetId,
            assignedTo: this.assignedTo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            timeline: this.timeline,
            responseActions: this.responseActions
        };
    }
}

module.exports = { IncidentModel, INCIDENT_STATES };