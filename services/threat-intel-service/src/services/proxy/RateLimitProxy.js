// threat-intel-service/src/services/proxy/RateLimitProxy.js
// PATTERN: Proxy (Rate Limiting Proxy)
//
// Enforces a per-minute call limit. Excess calls return UNKNOWN result.

const ThreatIntelProvider = require('../adapter/ThreatIntelProvider');
const { ReputationResult, Verdict } = require('../../domain/reputation/ReputationResult');

class RateLimitProxy extends ThreatIntelProvider {

  constructor(realProvider, maxCallsPerMinute) {
    super();
    this._realProvider      = realProvider;
    this._maxCallsPerMinute = maxCallsPerMinute;
    this._callsThisMinute   = 0;
    this._windowStartMs     = Date.now();
  }

  checkReputation(indicator, type) {
    const now = Date.now();
    if (now - this._windowStartMs >= 60000) {
      this._callsThisMinute = 0;
      this._windowStartMs   = now;
    }
    if (this._callsThisMinute >= this._maxCallsPerMinute) {
      console.log(`[RateLimitProxy] RATE LIMIT EXCEEDED — max ${this._maxCallsPerMinute} calls/min`);
      return new ReputationResult(indicator, Verdict.UNKNOWN, 0,
        this._realProvider.getProviderName(), 'Rate limit exceeded — result unavailable.');
    }
    this._callsThisMinute++;
    console.log(`[RateLimitProxy] Call ${this._callsThisMinute}/${this._maxCallsPerMinute} → ${this._realProvider.getProviderName()}`);
    return this._realProvider.checkReputation(indicator, type);
  }

  getProviderName()      { return `RateLimitProxy → ${this._realProvider.getProviderName()}`; }
  getCallsThisMinute()   { return this._callsThisMinute; }
}

module.exports = RateLimitProxy;
