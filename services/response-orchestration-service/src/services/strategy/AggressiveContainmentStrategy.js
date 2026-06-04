// response-orchestration-service/src/services/strategy/AggressiveContainmentStrategy.js
// PATTERN: Strategy — Aggressive Containment (CRITICAL incidents)

const BlockIPAction        = require('../executor/BlockIPAction');
const IsolateEndpointAction = require('../executor/IsolateEndpointAction');
const DisableUserAction    = require('../executor/DisableUserAction');
const EscalateAction       = require('../executor/EscalateAction');

class AggressiveContainmentStrategy {
  determineActions(incident) {
    console.log(`[AggressiveContainmentStrategy] Selecting actions for: ${incident.toString()}`);
    return [
      new BlockIPAction(incident.affectedAsset, 1440),
      new IsolateEndpointAction(),
      new DisableUserAction(),
      new EscalateAction('CRITICAL incident — aggressive containment applied', 'tier3-analyst-001')
    ];
  }
  getName()        { return 'AggressiveContainment'; }
  getDescription() { return 'Max containment: block IP, isolate endpoint, disable user, escalate.'; }
}

module.exports = AggressiveContainmentStrategy;
