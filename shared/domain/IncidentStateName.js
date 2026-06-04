// shared/domain/IncidentStateName.js

const IncidentStateName = Object.freeze({
  NEW: 'NEW',
  UNDER_TRIAGE: 'UNDER_TRIAGE',
  CONTAINMENT: 'CONTAINMENT',
  ERADICATION: 'ERADICATION',
  RECOVERY: 'RECOVERY',
  POST_INCIDENT_REVIEW: 'POST_INCIDENT_REVIEW',
  CLOSED: 'CLOSED'
});

module.exports = IncidentStateName;
