// threat-intel-service/src/services/proxy/CachingProxy.js
// PATTERN: Proxy (Caching Proxy)
//
// Sits in front of a real ThreatIntelProvider and caches results.
// On cache HIT: returns stored result without calling the real provider.
// On cache MISS: delegates to real provider then stores result.

const ThreatIntelProvider = require('../adapter/ThreatIntelProvider');

class CachingProxy extends ThreatIntelProvider {

  constructor(realProvider, cache) {
    super();
    this._realProvider = realProvider;
    this._cache        = cache;
  }

  checkReputation(indicator, type) {
    if (this._cache.contains(indicator)) {
      console.log(`[CachingProxy] Cache HIT for: ${indicator}`);
      return this._cache.get(indicator);
    }
    console.log(`[CachingProxy] Cache MISS — forwarding to: ${this._realProvider.getProviderName()}`);
    const result = this._realProvider.checkReputation(indicator, type);
    this._cache.put(indicator, result);
    return result;
  }

  getProviderName() { return `CachingProxy → ${this._realProvider.getProviderName()}`; }
}

module.exports = CachingProxy;
