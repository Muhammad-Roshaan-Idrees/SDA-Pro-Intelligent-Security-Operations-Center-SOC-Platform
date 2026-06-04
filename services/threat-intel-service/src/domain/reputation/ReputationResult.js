// threat-intel-service/src/domain/reputation/ReputationResult.js

const Verdict = Object.freeze({
  CLEAN: 'CLEAN',
  SUSPICIOUS: 'SUSPICIOUS',
  MALICIOUS: 'MALICIOUS',
  UNKNOWN: 'UNKNOWN'
});

class ReputationResult {
  constructor(indicator, verdict, score, source, details) {
    this.indicator = indicator;
    this.verdict   = verdict;
    this.score     = score;     // 0-100
    this.source    = source;
    this.details   = details;
  }

  toString() {
    return `ReputationResult{indicator='${this.indicator}', verdict=${this.verdict}, score=${this.score}, source='${this.source}'}`;
  }
}

module.exports = { ReputationResult, Verdict };
