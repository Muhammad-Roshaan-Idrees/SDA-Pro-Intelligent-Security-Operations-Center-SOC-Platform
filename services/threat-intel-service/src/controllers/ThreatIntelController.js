// threat-intel-service/src/controllers/ThreatIntelController.js
// Wires adapter + proxy chain. Exposes POST /threat-intel/reputation

const VirusTotalAdapter  = require('../services/adapter/VirusTotalAdapter');
const MISPAdapter        = require('../services/adapter/MISPAdapter');
const ThreatIntelCache   = require('../services/cache/ThreatIntelCache');
const CachingProxy       = require('../services/proxy/CachingProxy');
const RateLimitProxy     = require('../services/proxy/RateLimitProxy');
const AccessControlProxy = require('../services/proxy/AccessControlProxy');

class ThreatIntelController {

  constructor(callerToken) {
    const cache = new ThreatIntelCache();

    // VirusTotal chain: AccessControl → Caching → RateLimit → Real Adapter
    const vtChain = new AccessControlProxy(
      new CachingProxy(new RateLimitProxy(new VirusTotalAdapter(), 4), cache),
      callerToken
    );

    // MISP chain
    const mispChain = new AccessControlProxy(
      new CachingProxy(new RateLimitProxy(new MISPAdapter(), 10), cache),
      callerToken
    );

    this._vtChain   = vtChain;
    this._mispChain = mispChain;
    this._cache     = cache;
  }

  /** POST /threat-intel/reputation → VirusTotal */
  checkWithVirusTotal(indicator, type) {
    console.log(`\n[ThreatIntelController] POST /threat-intel/reputation → VirusTotal`);
    return this._vtChain.checkReputation(indicator, type);
  }

  /** POST /threat-intel/reputation → MISP */
  checkWithMISP(indicator, type) {
    console.log(`\n[ThreatIntelController] POST /threat-intel/reputation → MISP`);
    return this._mispChain.checkReputation(indicator, type);
  }

  /** Check both providers, return higher-risk result */
  checkAllProviders(indicator, type) {
    const vt   = this.checkWithVirusTotal(indicator, type);
    const misp = this.checkWithMISP(indicator, type);
    return vt.score >= misp.score ? vt : misp;
  }

  invalidateCache(indicator) { this._cache.invalidate(indicator); }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  console.log('=== SDA-Pro: Threat Intel Service ===\n');
  const ctrl = new ThreatIntelController('sda-response-service-token');

  console.log('--- Query 1: Malicious IP (cache miss) ---');
  console.log(ctrl.checkWithVirusTotal('185.220.101.1', 'IP_ADDRESS').toString());

  console.log('\n--- Query 2: Same IP (cache hit) ---');
  console.log(ctrl.checkWithVirusTotal('185.220.101.1', 'IP_ADDRESS').toString());

  console.log('\n--- Query 3: Cross-provider ---');
  console.log(ctrl.checkAllProviders('185.220.101.1', 'IP_ADDRESS').toString());

  console.log('\n--- Query 4: Clean IP ---');
  console.log(ctrl.checkWithVirusTotal('8.8.8.8', 'IP_ADDRESS').toString());

  console.log('\n--- Query 5: Unauthorized caller ---');
  try {
    new ThreatIntelController('bad-token').checkWithVirusTotal('1.2.3.4', 'IP_ADDRESS');
  } catch (e) {
    console.log('Caught (expected):', e.message);
  }

  console.log('\n=== Threat Intel Service demo complete ===');
}

module.exports = ThreatIntelController;
