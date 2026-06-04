// response-orchestration-service/src/services/strategy/WatchAndWaitStrategy.js
// PATTERN: Strategy — Watch and Wait (LOW incidents)

class WatchAndWaitStrategy {
  determineActions(incident) {
    console.log(`[WatchAndWaitStrategy] LOW severity — no automated actions. Queued for analyst: ${incident.id}`);
    return [];
  }
  getName()        { return 'WatchAndWait'; }
  getDescription() { return 'No automated actions — analyst review only.'; }
}

module.exports = WatchAndWaitStrategy;
