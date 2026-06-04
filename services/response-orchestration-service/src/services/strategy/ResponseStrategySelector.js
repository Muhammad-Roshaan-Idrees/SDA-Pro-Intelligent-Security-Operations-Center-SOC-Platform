// response-orchestration-service/src/services/strategy/ResponseStrategySelector.js

const AggressiveContainmentStrategy = require('./AggressiveContainmentStrategy');
const BalancedResponseStrategy      = require('./BalancedResponseStrategy');
const ConservativeStrategy          = require('./ConservativeStrategy');
const WatchAndWaitStrategy          = require('./WatchAndWaitStrategy');

class ResponseStrategySelector {
  select(incident) {
    const { severity, assetCritical } = incident;
    console.log(`[StrategySelector] severity=${severity}, assetCritical=${assetCritical}`);
    let strategy;
    if      (severity === 'CRITICAL')                                    strategy = new AggressiveContainmentStrategy();
    else if (severity === 'HIGH' || (severity === 'MEDIUM' && assetCritical)) strategy = new BalancedResponseStrategy();
    else if (severity === 'MEDIUM')                                      strategy = new ConservativeStrategy();
    else                                                                 strategy = new WatchAndWaitStrategy();
    console.log(`[StrategySelector] Selected: ${strategy.getName()}`);
    return strategy;
  }
}

module.exports = ResponseStrategySelector;
