// response-orchestration-service/src/domain/action/ResponseAction.js
// PATTERN: Decorator (Component Interface base class)

class ResponseAction {
  execute(target)      { throw new Error('execute() must be implemented'); }
  rollback(target)     { throw new Error('rollback() must be implemented'); }
  isReversible()       { return false; }
  getActionType()      { throw new Error('getActionType() must be implemented'); }
}

module.exports = ResponseAction;
