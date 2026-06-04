// middleware/src/enrichment/AssetContextHandler.js
// PATTERN: Chain of Responsibility — Handler 2 (enrichment): Enrich with context (Asset)

const EnrichmentHandler = require('../EnrichmentHandler');

class AssetContextHandler extends EnrichmentHandler {
  doEnrich(alert) {
    console.log(`[AssetContextHandler] CMDB lookup for: ${alert.sourceIp}`);
    const owner = this._lookup(alert.sourceIp);
    alert.assetOwner = owner;
    console.log(`[AssetContextHandler] Owner: ${owner}`);
    return 'CONTINUE';
  }

  _lookup(ip) {
    if (ip.startsWith('10.0.1'))    return 'Finance-Department / CFO-Workstation';
    if (ip.startsWith('10.0.2'))    return 'Engineering-Department / Build-Server';
    if (ip.startsWith('10.0.3'))    return 'HR-Department / HR-Portal-Server';
    if (ip.startsWith('192.168.'))  return 'Internal-Network / Unknown-Asset';
    return 'External / No-Asset-Record';
  }
}

module.exports = AssetContextHandler;
