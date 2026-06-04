// response-orchestration-service/src/services/decorator/MetricsDecorator.js
// PATTERN: Decorator — Metrics

const ResponseActionDecorator = require('./ResponseActionDecorator');

class MetricsDecorator extends ResponseActionDecorator {
  constructor(wrappedAction) { super(wrappedAction); this._total = 0; this._success = 0; this._fail = 0; this._totalMs = 0; }

  execute(target) {
    const start   = Date.now();
    const outcome = this._wrapped.execute(target);
    const elapsed = Date.now() - start;
    this._total++; this._totalMs += elapsed;
    outcome.isSuccess() ? this._success++ : this._fail++;
    console.log(`[MetricsDecorator] executions=${this._total}, success=${this._success}, fail=${this._fail}, avgMs=${Math.floor(this._totalMs/this._total)}`);
    return outcome;
  }

  getTotalExecutions() { return this._total; }
  getSuccessCount()    { return this._success; }
  getFailureCount()    { return this._fail; }
}

module.exports = MetricsDecorator;
