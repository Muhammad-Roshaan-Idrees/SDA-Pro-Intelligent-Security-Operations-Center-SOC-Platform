// middleware/tests/MiddlewareTest.js

const AlertEnrichmentPipeline = require('../src/AlertEnrichmentPipeline');

let passed = 0, failed = 0;
function assert_(cond, name) { if (cond) { console.log(`  PASS: ${name}`); passed++; } else { console.log(`  FAIL: ${name}`); failed++; } }
const alert = (id, ip, sev) => ({ id, sourceIp: ip, sourceType: 'Splunk', severity: sev, rawPayload: '{}' });

console.log('=== Middleware Pipeline Tests ===\n');

// Deduplication
let p = new AlertEnrichmentPipeline();
const first = alert('DUP-1', '1.2.3.4', 'MEDIUM');
const dup   = alert('DUP-1', '1.2.3.4', 'MEDIUM');
p.process(first);
const dupResult = p.process(dup);
assert_(dupResult.startsWith('DROPPED'), 'Duplicate alert is DROPPED');
assert_(dup.duplicate === true,          'Duplicate flag set to true');

p = new AlertEnrichmentPipeline();
const unique = alert('UNIQUE-1', '1.2.3.4', 'MEDIUM');
const uniqueResult = p.process(unique);
assert_(!uniqueResult.startsWith('DROPPED'), 'Unique alert NOT dropped');
assert_(unique.duplicate === false,           'Unique alert duplicate=false');

// GeoIP
p = new AlertEnrichmentPipeline();
const torAlert = alert('TOR-1', '185.220.1.1', 'HIGH');
p.process(torAlert);
assert_(torAlert.geoLocation && torAlert.geoLocation.includes('Tor'),      'Tor IP gets Tor geo label');

p = new AlertEnrichmentPipeline();
const intAlert = alert('INT-1', '192.168.1.10', 'LOW');
p.process(intAlert);
assert_(intAlert.geoLocation && intAlert.geoLocation.includes('Internal'), 'Internal IP gets Internal label');

// ThreatIntel
p = new AlertEnrichmentPipeline();
const malAlert = alert('MAL-1', '185.220.101.1', 'MEDIUM');
p.process(malAlert);
assert_(malAlert.reputationScore >= 80, 'Malicious IP score >= 80');

p = new AlertEnrichmentPipeline();
const intTIAlert = alert('INTI-1', '10.0.0.5', 'LOW');
p.process(intTIAlert);
assert_(intTIAlert.reputationScore === 0, 'Internal IP score = 0');

// AssetContext
p = new AlertEnrichmentPipeline();
const finAlert = alert('FIN-1', '10.0.1.22', 'MEDIUM');
p.process(finAlert);
assert_(finAlert.assetOwner && finAlert.assetOwner.includes('Finance'), '10.0.1.x maps to Finance');

// Full pipeline
p = new AlertEnrichmentPipeline();
const full = alert('FULL-1', '185.220.101.1', 'MEDIUM');
const fullResult = p.process(full);
assert_(!fullResult.startsWith('DROPPED'),      'Full pipeline: not dropped');
assert_(full.geoLocation   != null,             'Full pipeline: geoLocation set');
assert_(full.reputationScore >= 80,             'Full pipeline: score >= 80');
assert_(full.assetOwner    != null,             'Full pipeline: assetOwner set');
assert_(full.classifiedSeverity === 'CRITICAL', 'Full pipeline: classified as CRITICAL');
assert_(!full.duplicate,                        'Full pipeline: not duplicate');

// Multiple alerts — only duplicate dropped
p = new AlertEnrichmentPipeline();
const r1 = p.process(alert('M-1', '1.2.3.4', 'LOW'));
const r2 = p.process(alert('M-2', '5.6.7.8', 'MEDIUM'));
const r3 = p.process(alert('M-1', '1.2.3.4', 'LOW'));
assert_(!r1.startsWith('DROPPED'), 'Alert 1: not dropped');
assert_(!r2.startsWith('DROPPED'), 'Alert 2: not dropped');
assert_( r3.startsWith('DROPPED'), 'Alert 3 (dup): dropped');

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
