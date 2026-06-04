// threat-intel-service/src/services/adapter/MISPAdapter.js
// PATTERN: Adapter
//
// Adapts MISP API format into SDA-Pro's canonical ReputationResult.
// MISP returns: { threat_level: String, event_count: int, tags: String[] }
// We map that to our standard ReputationResult.

const ThreatIntelProvider = require('./ThreatIntelProvider');
const { ReputationResult, Verdict } = require('../../domain/reputation/ReputationResult');

class MISPAdapter extends ThreatIntelProvider {

  checkReputation(indicator, type) {
    console.log(`[MISPAdapter] Querying MISP for: ${indicator}`);
    const raw = this._simulateMISPCall(indicator);
    return this._mapToCanonical(indicator, raw);
  }

  getProviderName() { return 'MISP'; }

  _simulateMISPCall(indicator) {
    if (indicator === '185.220.101.1' || indicator.includes('malware')) {
      return { threatLevel: 'High',      eventCount: 15, tags: ['tlp:red', 'APT29'] };
    } else if (indicator.includes('phish')) {
      return { threatLevel: 'Medium',    eventCount: 3,  tags: ['tlp:amber', 'phishing'] };
    } else {
      return { threatLevel: 'Undefined', eventCount: 0,  tags: [] };
    }
  }

  /** Maps MISP threat_level string → numeric score and Verdict */
  _mapToCanonical(indicator, raw) {
    const map = {
      'High':      { verdict: Verdict.MALICIOUS,  score: 90 },
      'Medium':    { verdict: Verdict.SUSPICIOUS, score: 50 },
      'Low':       { verdict: Verdict.SUSPICIOUS, score: 25 },
      'Undefined': { verdict: Verdict.UNKNOWN,    score: 0  }
    };
    const { verdict, score } = map[raw.threatLevel] || map['Undefined'];
    const details = `MISP events: ${raw.eventCount}, Tags: ${raw.tags.join(', ')}`;
    return new ReputationResult(indicator, verdict, score, 'MISP', details);
  }
}

module.exports = MISPAdapter;
