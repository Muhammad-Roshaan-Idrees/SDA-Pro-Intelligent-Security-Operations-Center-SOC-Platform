// middleware/src/enrichment/ThreatIntelHandler.js
// PATTERN: Chain of Responsibility — Handler 2 (enrichment): Enrich with context (ThreatIntel)

const EnrichmentHandler = require('../EnrichmentHandler');

class ThreatIntelHandler extends EnrichmentHandler {
  doEnrich(alert) {
    console.log(`[ThreatIntelHandler] Reputation lookup for: ${alert.sourceIp}`);
    const score = this._lookup(alert.sourceIp);
    alert.reputationScore = score;
    console.log(`[ThreatIntelHandler] Score: ${score}`);
    return 'CONTINUE';
  }

  _lookup(ip) {
    if (ip.startsWith('185.220'))                           return 95;
    if (ip.includes('evil') || ip.includes('malware'))     return 85;
    if (ip.startsWith('10.') || ip.startsWith('192.168.')) return 0;
    return 5;
  }
}

module.exports = ThreatIntelHandler;
