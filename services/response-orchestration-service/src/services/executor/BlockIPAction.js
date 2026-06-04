// response-orchestration-service/src/services/executor/BlockIPAction.js
// Concrete response action: Block an IP at the firewall (mock).

const ResponseAction = require('../../domain/action/ResponseAction');
const { ActionOutcome, Status } = require('../../domain/outcome/ActionOutcome');

class BlockIPAction extends ResponseAction {
  constructor(ipToBlock, durationMinutes) { super(); this._ip = ipToBlock; this._dur = durationMinutes; }

  execute(target) {
    const start = Date.now();
    console.log(`[BlockIPAction] Blocking IP: ${this._ip} for ${this._dur} min`);
    console.log('[BlockIPAction] Firewall rule applied (mock).');
    return new ActionOutcome('BLOCK_IP', Status.SUCCESS, `IP ${this._ip} blocked for ${this._dur} min`, Date.now() - start);
  }

  rollback(target) {
    console.log(`[BlockIPAction] Rolling back block for: ${this._ip}`);
    return new ActionOutcome('BLOCK_IP', Status.ROLLED_BACK, `IP ${this._ip} unblocked.`, 0);
  }

  isReversible()  { return true; }
  getActionType() { return 'BLOCK_IP'; }
}

module.exports = BlockIPAction;
