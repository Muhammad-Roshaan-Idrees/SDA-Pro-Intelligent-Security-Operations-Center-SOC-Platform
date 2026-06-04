// response-orchestration-service/src/services/facade/IncidentResponseFacade.js
// PATTERN: Facade
//
// Single entry point for all response orchestration.
// Hides: strategy selection, decorator assembly, execution, rollback.

const ResponseStrategySelector = require('../strategy/ResponseStrategySelector');
const AuditLogDecorator        = require('../decorator/AuditLogDecorator');
const ApprovalGateDecorator    = require('../decorator/ApprovalGateDecorator');
const MetricsDecorator         = require('../decorator/MetricsDecorator');

class IncidentResponseFacade {
  constructor() { this._selector = new ResponseStrategySelector(); }

  assessAndRespond(incident) {
    console.log(`\n===== [IncidentResponseFacade] START — ${incident.toString()} =====`);

    const strategy = this._selector.select(incident);
    const plan     = { incidentId: incident.id, strategyUsed: strategy.getName(), outcomes: [] };
    const actions  = strategy.determineActions(incident);
    const target   = { identifier: incident.affectedAsset, critical: incident.assetCritical };

    if (actions.length === 0) {
      console.log('[Facade] No actions — watch-and-wait mode.');
      console.log('===== [IncidentResponseFacade] END =====\n');
      return plan;
    }

    for (const raw of actions) {
      // Decorator chain: AuditLog → ApprovalGate → Metrics → Real Action
      const decorated = new MetricsDecorator(new ApprovalGateDecorator(new AuditLogDecorator(raw), true));
      const outcome   = decorated.execute(target);
      plan.outcomes.push(outcome);
      console.log(`[Facade] Outcome: ${outcome.toString()}`);
      if (!outcome.isSuccess() && raw.isReversible()) {
        console.log(`[Facade] FAILED — rolling back: ${raw.getActionType()}`);
        raw.rollback(target);
      }
    }

    console.log(`===== [IncidentResponseFacade] END — strategy=${plan.strategyUsed}, outcomes=${plan.outcomes.length} =====\n`);
    return plan;
  }

  rollbackResponsePlan(plan, incident) {
    console.log(`[Facade] ROLLBACK for incident: ${incident.id}`);
    return plan.outcomes
      .filter(o => o.isSuccess())
      .map(o => { console.log(`[Facade] Rolling back: ${o.actionType}`); return o; });
  }
}

module.exports = IncidentResponseFacade;
