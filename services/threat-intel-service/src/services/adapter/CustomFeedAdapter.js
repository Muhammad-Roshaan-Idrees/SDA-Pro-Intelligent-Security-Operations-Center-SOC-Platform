// threat-intel-service/src/services/adapter/CustomFeedAdapter.js
// PATTERN: Adapter
//
// Adapts a custom internal CSV-based threat feed into canonical ReputationResult.
// Custom feed returns: "indicator,risk_score,category" (CSV format)

const ThreatIntelProvider = require('./ThreatIntelProvider');
const { ReputationResult, Verdict } = require('../../domain/reputation/ReputationResult');

class CustomFeedAdapter extends ThreatIntelProvider {

  checkReputation(indicator, type) {
    console.log(`[CustomFeedAdapter] Querying internal feed for: ${indicator}`);
    const csvLine = this._simulateLookup(indicator);
    return this._mapToCanonical(indicator, csvLine);
  }

  getProviderName() { return 'CustomFeed'; }

  _simulateLookup(indicator) {
    if (indicator === '185.220.101.1')   return `${indicator},95,botnet-c2`;
    if (indicator.includes('phish'))     return `${indicator},60,phishing`;
    return `${indicator},0,clean`;
  }

  /** Parses CSV → canonical ReputationResult */
  _mapToCanonical(indicator, csvLine) {
    const parts    = csvLine.split(',');
    const score    = parseInt(parts[1] || '0', 10);
    const category = parts[2] || 'unknown';
    let verdict;
    if (score >= 70)      verdict = Verdict.MALICIOUS;
    else if (score >= 30) verdict = Verdict.SUSPICIOUS;
    else                  verdict = Verdict.CLEAN;
    return new ReputationResult(indicator, verdict, score, 'CustomFeed', `Category: ${category}`);
  }
}

module.exports = CustomFeedAdapter;
