// threat-intel-service/src/services/adapter/ThreatIntelProvider.js
// PATTERN: Adapter (Target Interface)
//
// All external threat intel providers must extend this class.
// Adapters bridge each provider's format to SDA-Pro's canonical ReputationResult.

class ThreatIntelProvider {
  /**
   * Check reputation of an indicator (IP, domain, hash, URL).
   * @param {string} indicator - value to check e.g. "185.220.101.1"
   * @param {string} type      - indicator type e.g. "IP_ADDRESS"
   * @returns {ReputationResult}
   */
  checkReputation(indicator, type) {
    throw new Error('checkReputation() must be implemented by adapter');
  }

  getProviderName() {
    throw new Error('getProviderName() must be implemented by adapter');
  }
}

module.exports = ThreatIntelProvider;
