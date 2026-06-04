// threat-intel-service/tests/ThreatIntelTest.js

const VirusTotalAdapter  = require('../src/services/adapter/VirusTotalAdapter');
const MISPAdapter        = require('../src/services/adapter/MISPAdapter');
const ThreatIntelCache   = require('../src/services/cache/ThreatIntelCache');
const CachingProxy       = require('../src/services/proxy/CachingProxy');
const RateLimitProxy     = require('../src/services/proxy/RateLimitProxy');
const AccessControlProxy = require('../src/services/proxy/AccessControlProxy');
const { Verdict }        = require('../src/domain/reputation/ReputationResult');

let passed = 0, failed = 0;

function assert_(condition, testName) {
  if (condition) { console.log(`  PASS: ${testName}`); passed++; }
  else           { console.log(`  FAIL: ${testName}`); failed++; }
}

console.log('=== Threat Intel Service Tests ===\n');

// ── Adapter Tests ─────────────────────────────────────────────────────────────
const vt = new VirusTotalAdapter();
let r = vt.checkReputation('185.220.101.1', 'IP_ADDRESS');
assert_(r.verdict === Verdict.MALICIOUS, 'VT: malicious IP returns MALICIOUS');
assert_(r.score >= 50,                   'VT: malicious IP score >= 50');

r = vt.checkReputation('8.8.8.8', 'IP_ADDRESS');
assert_(r.verdict === Verdict.CLEAN, 'VT: clean IP returns CLEAN');

const misp = new MISPAdapter();
r = misp.checkReputation('185.220.101.1', 'IP_ADDRESS');
assert_(r.verdict === Verdict.MALICIOUS, 'MISP: malicious IP returns MALICIOUS');
assert_(r.score === 90,                  'MISP: score = 90 for High threat level');

r = misp.checkReputation('1.2.3.4', 'IP_ADDRESS');
assert_(r.verdict === Verdict.UNKNOWN, 'MISP: unknown IP returns UNKNOWN');

// ── Proxy Tests ───────────────────────────────────────────────────────────────
const cache = new ThreatIntelCache();
const cachingProxy = new CachingProxy(new VirusTotalAdapter(), cache);
cachingProxy.checkReputation('185.220.101.1', 'IP_ADDRESS');  // miss
assert_(cache.size() === 1, 'CachingProxy: 1 entry after first call');
cachingProxy.checkReputation('185.220.101.1', 'IP_ADDRESS');  // hit
assert_(cache.size() === 1, 'CachingProxy: still 1 entry after second call (cache hit)');

const rateProxy = new RateLimitProxy(new VirusTotalAdapter(), 2);
rateProxy.checkReputation('1.1.1.1', 'IP_ADDRESS');
rateProxy.checkReputation('2.2.2.2', 'IP_ADDRESS');
r = rateProxy.checkReputation('3.3.3.3', 'IP_ADDRESS');
assert_(r.verdict === Verdict.UNKNOWN, 'RateLimitProxy: over-limit call returns UNKNOWN');

const acp = new AccessControlProxy(new VirusTotalAdapter(), 'sda-response-service-token');
try { acp.checkReputation('1.2.3.4', 'IP_ADDRESS'); assert_(true, 'AccessControlProxy: valid token passes'); }
catch (e) { assert_(false, 'AccessControlProxy: valid token SHOULD NOT throw'); }

const badAcp = new AccessControlProxy(new VirusTotalAdapter(), 'bad-token');
try { badAcp.checkReputation('1.2.3.4', 'IP_ADDRESS'); assert_(false, 'AccessControlProxy: bad token SHOULD throw'); }
catch (e) { assert_(true, 'AccessControlProxy: bad token correctly throws'); }

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
