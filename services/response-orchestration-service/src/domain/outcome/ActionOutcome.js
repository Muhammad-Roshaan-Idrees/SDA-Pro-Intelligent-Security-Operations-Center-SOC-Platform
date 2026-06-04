// response-orchestration-service/src/domain/outcome/ActionOutcome.js

const Status = Object.freeze({ SUCCESS:'SUCCESS', FAILED:'FAILED', SKIPPED:'SKIPPED', ROLLED_BACK:'ROLLED_BACK' });

class ActionOutcome {
  constructor(actionType, status, message, executionTimeMs = 0) {
    this.actionType      = actionType;
    this.status          = status;
    this.message         = message;
    this.executionTimeMs = executionTimeMs;
  }
  isSuccess() { return this.status === Status.SUCCESS; }
  toString()  { return `ActionOutcome{type=${this.actionType}, status=${this.status}, msg='${this.message}', time=${this.executionTimeMs}ms}`; }
}

module.exports = { ActionOutcome, Status };
