// threat-intel-service/src/services/proxy/AccessControlProxy.js
// PATTERN: Proxy (Access Control Proxy)
//
// Blocks unauthorized callers before they reach the real provider.

const ThreatIntelProvider = require('../adapter/ThreatIntelProvider');

const VALID_TOKENS = new Set([
  'sda-response-service-token',
  'sda-enrichment-service-token',
  'admin-token'
]);

class AccessControlProxy extends ThreatIntelProvider {

  constructor(realProvider, callerToken) {
    super();
    this._realProvider = realProvider;
    this._callerToken  = callerToken;
  }

  checkReputation(indicator, type) {
    if (!VALID_TOKENS.has(this._callerToken)) {
      console.log(`[AccessControlProxy] UNAUTHORIZED — token: ${this._callerToken}`);
      throw new Error(`Unauthorized: invalid token '${this._callerToken}'`);
    }
    console.log(`[AccessControlProxy] Access GRANTED for token: ${this._callerToken}`);
    return this._realProvider.checkReputation(indicator, type);
  }

  getProviderName() { return `AccessControlProxy → ${this._realProvider.getProviderName()}`; }
}

module.exports = AccessControlProxy;
