// Shared event schemas - From document Section 4 (Asynchronous Events table)

const EVENT_TYPES = {
    ALERT_INGESTED: 'AlertIngested',
    ALERT_ENRICHED: 'AlertEnriched',
    INCIDENT_CREATED: 'IncidentCreated',
    INCIDENT_STATE_CHANGED: 'IncidentStateChanged',
    RESPONSE_ACTION_EXECUTED: 'ResponseActionExecuted',
    THREAT_INTEL_UPDATED: 'ThreatIntelUpdated'
};

const EVENT_PUBLISHER_SUBSCRIBER = {
    AlertIngested: { publisher: 'Alert Ingestion', subscribers: ['Enrichment', 'Dashboard', 'Audit'] },
    AlertEnriched: { publisher: 'Enrichment', subscribers: ['Correlation', 'Dashboard', 'Audit'] },
    IncidentCreated: { publisher: 'Incident Management', subscribers: ['Dashboard', 'Notification', 'Response Orchestration'] },
    IncidentStateChanged: { publisher: 'Incident Management', subscribers: ['Dashboard', 'Audit', 'Metrics'] },
    ResponseActionExecuted: { publisher: 'Response Orchestration', subscribers: ['Dashboard', 'Audit', 'Notification'] },
    ThreatIntelUpdated: { publisher: 'Threat Intel', subscribers: ['Enrichment'] }
};

module.exports = { EVENT_TYPES, EVENT_PUBLISHER_SUBSCRIBER };