// response-orchestration-service/src/services/decorator/ApprovalGateDecorator.js
// PATTERN: Decorator — Approval Gate

const ResponseActionDecorator = require('./ResponseActionDecorator');
const { ActionOutcome, Status } = require('../../domain/outcome/ActionOutcome');

class ApprovalGateDecorator extends ResponseActionDecorator {
  constructor(wrappedAction, requireApprovalForCritical) {
    super(wrappedAction);
    this._requireApproval = requireApprovalForCritical;
  }

  execute(target) {
    if (this._requireApproval && target.critical) {
      console.log(`[ApprovalGateDecorator] Critical asset — checking approval for: ${target.identifier} (mock: auto-approved)`);
    } else {
      console.log('[ApprovalGateDecorator] No approval required — proceeding.');
    }
    return this._wrapped.execute(target);
  }
}

module.exports = ApprovalGateDecorator;
