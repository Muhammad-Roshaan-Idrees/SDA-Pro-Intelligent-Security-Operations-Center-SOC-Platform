// response-orchestration-service/src/services/decorator/AuditLogDecorator.js
// PATTERN: Decorator — Audit Log

const ResponseActionDecorator = require('./ResponseActionDecorator');

class AuditLogDecorator extends ResponseActionDecorator {
  execute(target) {
    console.log(`[AuditLogDecorator] PRE  | ${new Date().toISOString()} | Action:${this._wrapped.getActionType()} | Target:${target.identifier}`);
    const outcome = this._wrapped.execute(target);
    console.log(`[AuditLogDecorator] POST | ${new Date().toISOString()} | Result:${outcome.status} | ${outcome.message}`);
    return outcome;
  }
  rollback(target) {
    console.log(`[AuditLogDecorator] ROLLBACK | ${new Date().toISOString()} | Action:${this._wrapped.getActionType()}`);
    const outcome = this._wrapped.rollback(target);
    console.log(`[AuditLogDecorator] ROLLBACK RESULT | ${outcome.status}`);
    return outcome;
  }
}

module.exports = AuditLogDecorator;
