// shared/domain/Incident.js

class Incident {
  constructor(id, severity, currentState, affectedAsset, assetCritical) {
    this.id            = id;
    this.severity      = severity;
    this.currentState  = currentState;
    this.affectedAsset = affectedAsset;
    this.assetCritical = assetCritical;
  }

  toString() {
    return `Incident{id=${this.id}, severity=${this.severity}, state=${this.currentState}, asset=${this.affectedAsset}}`;
  }
}

module.exports = Incident;
