// response-orchestration-service/src/services/decorator/ResponseActionDecorator.js
// PATTERN: Decorator (Abstract Decorator)

const ResponseAction = require('../../domain/action/ResponseAction');

class ResponseActionDecorator extends ResponseAction {
  constructor(wrappedAction) { super(); this._wrapped = wrappedAction; }
  execute(target)      { return this._wrapped.execute(target); }
  rollback(target)     { return this._wrapped.rollback(target); }
  isReversible()       { return this._wrapped.isReversible(); }
  getActionType()      { return this._wrapped.getActionType(); }
}

module.exports = ResponseActionDecorator;
