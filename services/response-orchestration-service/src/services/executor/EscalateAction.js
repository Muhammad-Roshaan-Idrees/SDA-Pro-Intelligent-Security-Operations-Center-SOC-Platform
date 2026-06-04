// response-orchestration-service/src/services/executor/EscalateAction.js

const ResponseAction = require('../../domain/action/ResponseAction');
const { ActionOutcome, Status } = require('../../domain/outcome/ActionOutcome');

class EscalateAction extends ResponseAction {
  constructor(reason, analystId) { super(); this._reason = reason; this._analystId = analystId; }
  execute(target) {
    const start = Date.now();
    console.log(`[EscalateAction] Escalating to: ${this._analystId} | Reason: ${this._reason}`);
    return new ActionOutcome('ESCALATE_TO_TIER3', Status.SUCCESS, `Escalated to ${this._analystId}.`, Date.now() - start);
  }
  rollback(target) { return new ActionOutcome('ESCALATE_TO_TIER3', Status.SKIPPED, 'Escalation not reversible.', 0); }
  isReversible()   { return false; }
  getActionType()  { return 'ESCALATE_TO_TIER3'; }
}

module.exports = EscalateAction;
