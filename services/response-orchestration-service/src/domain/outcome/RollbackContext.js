// response-orchestration-service/src/domain/outcome/RollbackContext.js

class RollbackContext {
  constructor(incidentId) { this.incidentId = incidentId; this.rollbackOutcomes = []; }
  addRollbackOutcome(o)   { this.rollbackOutcomes.push(o); }
  toString()              { return `RollbackContext{incidentId='${this.incidentId}', rollbacks=${this.rollbackOutcomes.length}}`; }
}

module.exports = RollbackContext;
