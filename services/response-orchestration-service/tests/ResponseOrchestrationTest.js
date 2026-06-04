// response-orchestration-service/tests/ResponseOrchestrationTest.js

const IncidentResponseFacade        = require('../src/services/facade/IncidentResponseFacade');
const AggressiveContainmentStrategy = require('../src/services/strategy/AggressiveContainmentStrategy');
const BalancedResponseStrategy      = require('../src/services/strategy/BalancedResponseStrategy');
const ConservativeStrategy          = require('../src/services/strategy/ConservativeStrategy');
const WatchAndWaitStrategy          = require('../src/services/strategy/WatchAndWaitStrategy');
const ResponseStrategySelector      = require('../src/services/strategy/ResponseStrategySelector');
const AuditLogDecorator             = require('../src/services/decorator/AuditLogDecorator');
const ApprovalGateDecorator         = require('../src/services/decorator/ApprovalGateDecorator');
const MetricsDecorator              = require('../src/services/decorator/MetricsDecorator');
const BlockIPAction                 = require('../src/services/executor/BlockIPAction');
const EscalateAction                = require('../src/services/executor/EscalateAction');
const Incident                      = require('../../../shared/domain/Incident');
const { Status }                    = require('../src/domain/outcome/ActionOutcome');

let passed = 0, failed = 0;
const uid = () => Math.random().toString(36).slice(2);
const incident = (sev, crit) => new Incident(uid(), sev, 'UNDER_TRIAGE', '1.2.3.4', crit);
const target   = { identifier: '1.2.3.4', critical: false };
const critTarget = { identifier: '1.2.3.4', critical: true };

function assert_(cond, name) { if (cond) { console.log(`  PASS: ${name}`); passed++; } else { console.log(`  FAIL: ${name}`); failed++; } }

console.log('=== Response Orchestration Tests ===\n');

// Strategy tests
assert_(new AggressiveContainmentStrategy().determineActions(incident('CRITICAL',true)).length === 4, 'Aggressive: 4 actions');
assert_(new BalancedResponseStrategy().determineActions(incident('HIGH',true)).length > 0,            'Balanced: has actions');
assert_(new ConservativeStrategy().determineActions(incident('MEDIUM',false)).length === 1,           'Conservative: 1 action');
assert_(new WatchAndWaitStrategy().determineActions(incident('LOW',false)).length === 0,              'WatchAndWait: 0 actions');

const sel = new ResponseStrategySelector();
assert_(sel.select(incident('CRITICAL',true)).getName()  === 'AggressiveContainment', 'Selector: CRITICAL → Aggressive');
assert_(sel.select(incident('HIGH',false)).getName()     === 'BalancedResponse',      'Selector: HIGH → Balanced');
assert_(sel.select(incident('MEDIUM',false)).getName()   === 'Conservative',          'Selector: MEDIUM → Conservative');
assert_(sel.select(incident('LOW',false)).getName()      === 'WatchAndWait',          'Selector: LOW → WatchAndWait');

// Decorator tests
const block = new BlockIPAction('1.2.3.4', 60);
let o = new AuditLogDecorator(block).execute(target);
assert_(o.status === Status.SUCCESS,      'AuditDecorator: passes SUCCESS through');
assert_(o.actionType === 'BLOCK_IP',      'AuditDecorator: action type preserved');

o = new ApprovalGateDecorator(new BlockIPAction('1.2.3.4',60), true).execute(target);
assert_(o.status === Status.SUCCESS,      'ApprovalDecorator: non-critical proceeds');

const metrics = new MetricsDecorator(new BlockIPAction('1.2.3.4',60));
assert_(metrics.getTotalExecutions() === 0, 'Metrics: starts at 0');
metrics.execute(target); metrics.execute(target);
assert_(metrics.getTotalExecutions() === 2, 'Metrics: tracks 2 executions');
assert_(metrics.getSuccessCount()    === 2, 'Metrics: 2 successes');

const escalate = new EscalateAction('test', 'analyst-001');
assert_(!escalate.isReversible(), 'EscalateAction: not reversible');

// Facade tests
const facade = new IncidentResponseFacade();
const p1 = facade.assessAndRespond(incident('CRITICAL', true));
assert_(p1.strategyUsed === 'AggressiveContainment', 'Facade CRITICAL: AggressiveContainment');
assert_(p1.outcomes.length > 0,                      'Facade CRITICAL: has outcomes');

const p2 = facade.assessAndRespond(incident('LOW', false));
assert_(p2.strategyUsed === 'WatchAndWait',  'Facade LOW: WatchAndWait');
assert_(p2.outcomes.length === 0,            'Facade LOW: no outcomes');

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
