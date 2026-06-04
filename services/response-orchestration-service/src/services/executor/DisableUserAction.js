// response-orchestration-service/src/services/executor/DisableUserAction.js

const ResponseAction = require('../../domain/action/ResponseAction');
const { ActionOutcome, Status } = require('../../domain/outcome/ActionOutcome');

class DisableUserAction extends ResponseAction {
  execute(target) {
    const start = Date.now();
    console.log(`[DisableUserAction] Disabling user: ${target.identifier}`);
    return new ActionOutcome('DISABLE_USER', Status.SUCCESS, `User ${target.identifier} disabled.`, Date.now() - start);
  }
  rollback(target) { return new ActionOutcome('DISABLE_USER', Status.ROLLED_BACK, `User ${target.identifier} re-enabled.`, 0); }
  isReversible()   { return true; }
  getActionType()  { return 'DISABLE_USER'; }
}

module.exports = DisableUserAction;
