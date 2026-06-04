// response-orchestration-service/src/services/strategy/ConservativeStrategy.js
// PATTERN: Strategy — Conservative (MEDIUM, non-critical)

const BlockIPAction = require('../executor/BlockIPAction');

class ConservativeStrategy {
  determineActions(incident) {
    console.log(`[ConservativeStrategy] Selecting actions for: ${incident.toString()}`);
    return [ new BlockIPAction(incident.affectedAsset, 30) ];
  }
  getName()        { return 'Conservative'; }
  getDescription() { return 'Short IP block only — minimal disruption.'; }
}

module.exports = ConservativeStrategy;
