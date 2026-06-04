// threat-intel-service/src/domain/intel/ThreatIndicator.js

class ThreatIndicator {
  constructor(type, value, feedSource, riskScore) {
    this.type       = type;
    this.value      = value;
    this.feedSource = feedSource;
    this.riskScore  = riskScore;
  }

  toString() {
    return `ThreatIndicator{type='${this.type}', value='${this.value}', source='${this.feedSource}', risk=${this.riskScore}}`;
  }
}

module.exports = ThreatIndicator;
