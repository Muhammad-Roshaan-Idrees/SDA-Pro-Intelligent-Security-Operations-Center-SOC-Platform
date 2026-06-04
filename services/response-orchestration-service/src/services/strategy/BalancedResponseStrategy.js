// response-orchestration-service/src/services/strategy/BalancedResponseStrategy.js
// PATTERN: Strategy — Balanced Response (HIGH incidents)

const BlockIPAction  = require('../executor/BlockIPAction');
const EscalateAction = require('../executor/EscalateAction');

class BalancedResponseStrategy {
  determineActions(incident) {
    console.log(`[BalancedResponseStrategy] Selecting actions for: ${incident.toString()}`);
    const actions = [ new BlockIPAction(incident.affectedAsset, 240) ];
    if (incident.assetCritical || incident.severity === 'CRITICAL') {
      actions.push(new EscalateAction('HIGH incident on critical asset', 'tier3-analyst-002'));
    }
    return actions;
  }
  getName()        { return 'BalancedResponse'; }
  getDescription() { return 'Block IP; escalate only for critical assets.'; }
}

module.exports = BalancedResponseStrategy;
