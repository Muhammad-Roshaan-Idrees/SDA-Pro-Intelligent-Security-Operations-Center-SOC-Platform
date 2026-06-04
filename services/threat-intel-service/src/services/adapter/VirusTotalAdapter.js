// threat-intel-service/src/services/adapter/VirusTotalAdapter.js
// PATTERN: Adapter
//
// Adapts VirusTotal API response format into SDA-Pro's canonical ReputationResult.
// VirusTotal returns: { positives, total, verbose_msg }
// We map that to our standard ReputationResult.
// Uses hardcoded mock responses (no real API key needed).

const ThreatIntelProvider = require('./ThreatIntelProvider');
const { ReputationResult, Verdict } = require('../../domain/reputation/ReputationResult');

class VirusTotalAdapter extends ThreatIntelProvider {

  checkReputation(indicator, type) {
    console.log(`[VirusTotalAdapter] Querying VirusTotal for: ${indicator}`);
    const raw = this._simulateVirusTotalCall(indicator);
    return this._mapToCanonical(indicator, raw);
  }

  getProviderName() { return 'VirusTotal'; }

  // ── Private helpers ────────────────────────────────────────────────────────

  /** Simulates VirusTotal HTTP response with hardcoded mock data */
  _simulateVirusTotalCall(indicator) {
    if (indicator.startsWith('185.220') || indicator === '185.220.101.1') {
      return { positives: 52, total: 70, verboseMsg: 'Detected as malicious by 52 engines' };
    } else if (indicator.includes('suspicious')) {
      return { positives: 10, total: 70, verboseMsg: 'Flagged as suspicious by some engines' };
    } else {
      return { positives: 0,  total: 70, verboseMsg: 'No engines detected this as malicious' };
    }
  }

  /** Maps VirusTotal positives/total ratio → canonical Verdict + score */
  _mapToCanonical(indicator, raw) {
    const score = raw.total === 0 ? 0 : Math.floor((raw.positives * 100) / raw.total);
    let verdict;
    if (score >= 50)      verdict = Verdict.MALICIOUS;
    else if (score >= 15) verdict = Verdict.SUSPICIOUS;
    else if (score > 0)   verdict = Verdict.SUSPICIOUS;
    else                  verdict = Verdict.CLEAN;
    return new ReputationResult(indicator, verdict, score, 'VirusTotal', raw.verboseMsg);
  }
}

module.exports = VirusTotalAdapter;
