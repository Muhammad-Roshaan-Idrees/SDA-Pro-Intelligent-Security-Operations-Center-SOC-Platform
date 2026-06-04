// middleware/src/AlertEnrichmentPipeline.js
// Assembles the full 6-handler enrichment pipeline.
//
// Chain order (exact as per project spec):
//   DeduplicationHandler → GeoIPHandler → ThreatIntelHandler
//   → AssetContextHandler → ClassificationHandler → RoutingHandler

const DeduplicationHandler  = require('./deduplication/DeduplicationHandler');
const GeoIPHandler           = require('./enrichment/GeoIPHandler');
const ThreatIntelHandler     = require('./enrichment/ThreatIntelHandler');
const AssetContextHandler    = require('./enrichment/AssetContextHandler');
const ClassificationHandler  = require('./classification/ClassificationHandler');
const RoutingHandler         = require('./routing/RoutingHandler');

class AlertEnrichmentPipeline {
  constructor() {
    const h1 = new DeduplicationHandler();
    const h2 = new GeoIPHandler();
    const h3 = new ThreatIntelHandler();
    const h4 = new AssetContextHandler();
    const h5 = new ClassificationHandler();
    const h6 = new RoutingHandler();

    // Link: h1 → h2 → h3 → h4 → h5 → h6
    h1.setNext(h2).setNext(h3).setNext(h4).setNext(h5).setNext(h6);

    this._head = h1;
  }

  process(alert) {
    console.log(`\n[Pipeline] ===== Processing: ${alert.id} =====`);
    const result = this._head.handle(alert);
    console.log(`[Pipeline] ===== Done: ${result} =====\n`);
    return result;
  }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  console.log('=== SDA-Pro: Middleware Pipeline (Chain of Responsibility) ===\n');

  const pipeline = new AlertEnrichmentPipeline();

  const a1 = { id: 'ALT-001', sourceIp: '185.220.101.1', sourceType: 'Splunk', severity: 'MEDIUM', rawPayload: '{}' };
  pipeline.process(a1);
  console.log('Enriched a1:', JSON.stringify(a1, null, 2));

  const a2 = { id: 'ALT-002', sourceIp: '10.0.1.55', sourceType: 'CrowdStrike', severity: 'HIGH', rawPayload: '{}' };
  pipeline.process(a2);
  console.log('Enriched a2:', JSON.stringify(a2, null, 2));

  // Duplicate of a1 — should be dropped
  const a3 = { id: 'ALT-001', sourceIp: '185.220.101.1', sourceType: 'Splunk', severity: 'MEDIUM', rawPayload: '{}' };
  pipeline.process(a3);
  console.log('a3 duplicate flag:', a3.duplicate);

  console.log('\n=== Middleware demo complete ===');
}

module.exports = AlertEnrichmentPipeline;
