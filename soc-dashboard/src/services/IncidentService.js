// PATTERN: MVC (Service Layer)
// RATIONALE: Business logic for incident management

const { IncidentModel, INCIDENT_STATES } = require('../models/IncidentModel');

class IncidentService {
    constructor(incidentRepository, eventBus) {
        this.incidentRepository = incidentRepository;
        this.eventBus = eventBus;
        this.incidents = new Map(); // In-memory storage for demo
    }

    async getAll(filters = {}) {
        const incidents = Array.from(this.incidents.values());
        
        if (filters.queue === 'open') {
            return incidents.filter(i => i.state !== INCIDENT_STATES.CLOSED);
        }
        if (filters.queue === 'active') {
            return incidents.filter(i => 
                i.state !== INCIDENT_STATES.CLOSED && 
                i.state !== INCIDENT_STATES.POST_INCIDENT_REVIEW
            );
        }
        
        return incidents;
    }

    async getById(id) {
        return this.incidents.get(id) || null;
    }

    async create(incidentData) {
        const incident = new IncidentModel(incidentData);
        this.incidents.set(incident.id, incident);
        
        // Publish event (Observer pattern)
        if (this.eventBus) {
            this.eventBus.publishIncidentCreated(incident.toJSON());
        }
        
        return incident;
    }

    async updateState(id, action) {
        const incident = this.incidents.get(id);
        if (!incident) {
            throw new Error('Incident not found');
        }
        
        let newState;
        switch (action) {
            case 'START_TRIAGE':
                newState = INCIDENT_STATES.UNDER_TRIAGE;
                break;
            case 'START_CONTAINMENT':
                newState = INCIDENT_STATES.CONTAINMENT;
                break;
            case 'COMPLETE_CONTAINMENT':
                newState = INCIDENT_STATES.ERADICATION;
                break;
            case 'CLOSE':
                newState = INCIDENT_STATES.CLOSED;
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }
        
        const transition = incident.transitionTo(newState, 'analyst');
        
        // Publish state change event
        if (this.eventBus) {
            this.eventBus.publishIncidentStateChanged(incident.toJSON(), transition.oldState, transition.newState);
        }
        
        return transition;
    }

    async executeAction(id, actionType, parameters) {
        const incident = this.incidents.get(id);
        if (!incident) {
            throw new Error('Incident not found');
        }
        
        const action = {
            type: actionType,
            parameters: parameters,
            status: 'SUCCESS'
        };
        
        incident.addResponseAction(action);
        
        // Publish action executed event
        if (this.eventBus) {
            this.eventBus.publishResponseActionExecuted(action, 'SUCCESS');
        }
        
        return action;
    }
}

module.exports = IncidentService;