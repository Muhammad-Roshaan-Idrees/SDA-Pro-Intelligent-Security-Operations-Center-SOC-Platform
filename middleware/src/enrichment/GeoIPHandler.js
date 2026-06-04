// middleware/src/enrichment/GeoIPHandler.js
// PATTERN: Chain of Responsibility — Handler 2: Enrich with context (GeoIP)

const EnrichmentHandler = require('../EnrichmentHandler');

class GeoIPHandler extends EnrichmentHandler {
  doEnrich(alert) {
    console.log(`[GeoIPHandler] Geo-IP lookup for: ${alert.sourceIp}`);
    const location = this._lookup(alert.sourceIp);
    alert.geoLocation = location;
    console.log(`[GeoIPHandler] Location: ${location}`);
    return 'CONTINUE';
  }

  _lookup(ip) {
    if (ip.startsWith('185.220'))                       return 'Tor Exit Node, Netherlands';
    if (ip.startsWith('10.') || ip.startsWith('192.168.')) return 'Internal Network, RFC1918';
    if (ip.startsWith('8.8'))                           return 'Mountain View, CA, USA (Google)';
    return 'Unknown Location';
  }
}

module.exports = GeoIPHandler;
