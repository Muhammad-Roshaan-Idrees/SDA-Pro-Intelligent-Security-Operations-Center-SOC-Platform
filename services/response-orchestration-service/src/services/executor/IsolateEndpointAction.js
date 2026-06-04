// response-orchestration-service/src/services/executor/IsolateEndpointAction.js

const ResponseAction = require('../../domain/action/ResponseAction');
const { ActionOutcome, Status } = require('../../domain/outcome/ActionOutcome');

class IsolateEndpointAction extends ResponseAction {
  execute(target) {
    const start = Date.now();
    console.log(`[IsolateEndpointAction] Isolating: ${target.identifier}`);
    console.log('[IsolateEndpointAction] EDR containment command sent (mock).');
    return new ActionOutcome('ISOLATE_ENDPOINT', Status.SUCCESS, `Endpoint ${target.identifier} isolated.`, Date.now() - start);
  }
  rollback(target) {
    console.log(`[IsolateEndpointAction] Releasing isolation: ${target.identifier}`);
    return new ActionOutcome('ISOLATE_ENDPOINT', Status.ROLLED_BACK, `Endpoint ${target.identifier} restored.`, 0);
  }
  isReversible()  { return true; }
  getActionType() { return 'ISOLATE_ENDPOINT'; }
}

module.exports = IsolateEndpointAction;
