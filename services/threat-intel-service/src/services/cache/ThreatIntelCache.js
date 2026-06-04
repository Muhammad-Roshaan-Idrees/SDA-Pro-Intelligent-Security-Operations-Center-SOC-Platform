// threat-intel-service/src/services/cache/ThreatIntelCache.js
// In-memory cache for reputation results. (Production: backed by Redis)

class ThreatIntelCache {
  constructor() {
    this._store = new Map();
  }

  get(indicator)                   { return this._store.get(indicator) || null; }
  put(indicator, result)           { this._store.set(indicator, result); console.log(`[ThreatIntelCache] Cached: ${indicator}`); }
  contains(indicator)              { return this._store.has(indicator); }
  invalidate(indicator)            { this._store.delete(indicator); console.log(`[ThreatIntelCache] Invalidated: ${indicator}`); }
  clear()                          { this._store.clear(); }
  size()                           { return this._store.size; }
}

module.exports = ThreatIntelCache;
