// response-orchestration-service/src/controllers/ResponseOrchestrationController.js

const IncidentResponseFacade = require('../services/facade/IncidentResponseFacade');
const Incident               = require('../../../../shared/domain/Incident');

class ResponseOrchestrationController {
  constructor() { this._facade = new IncidentResponseFacade(); }

  /** POST /incidents/:id/respond */
  respond(incident) {
    console.log(`\n[ResponseOrchestrationController] POST /incidents/${incident.id}/respond`);
    return this._facade.assessAndRespond(incident);
  }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const { v4: uuidv4 } = { v4: () => Math.random().toString(36).slice(2) };
  console.log('=== SDA-Pro: Response Orchestration Service ===\n');

  const ctrl = new ResponseOrchestrationController();

  console.log('===== SCENARIO 1: CRITICAL Incident =====');
  const p1 = ctrl.respond(new Incident(uuidv4(), 'CRITICAL', 'UNDER_TRIAGE', '185.220.101.1', true));
  console.log(`Plan: strategy=${p1.strategyUsed}, outcomes=${p1.outcomes.length}`);

  console.log('\n===== SCENARIO 2: HIGH Incident =====');
  const p2 = ctrl.respond(new Incident(uuidv4(), 'HIGH', 'UNDER_TRIAGE', '10.0.0.55', false));
  console.log(`Plan: strategy=${p2.strategyUsed}, outcomes=${p2.outcomes.length}`);

  console.log('\n===== SCENARIO 3: LOW Incident =====');
  const p3 = ctrl.respond(new Incident(uuidv4(), 'LOW', 'NEW', '10.0.0.99', false));
  console.log(`Plan: strategy=${p3.strategyUsed}, outcomes=${p3.outcomes.length}`);

  console.log('\n=== Response Orchestration Service demo complete ===');
}

module.exports = ResponseOrchestrationController;
