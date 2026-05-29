# ADR-004: Threat Intel Caching Strategy

## Status

Accepted

## Context

External APIs like VirusTotal have rate limits (e.g., 4 requests per second). Repeated queries for same indicator are expensive.

## Decision

**Redis-based Caching with TTL:**

- Cache key: `threat:{indicator_type}:{indicator_value}`
- TTL: 1 hour for malicious indicators, 24 hours for benign
- Cache-aside pattern (Proxy pattern from Section 4.1)

## Justification

- Redis provides fast lookups for enrichment pipeline
- Reduces external API calls by ~80%
- Proxy pattern encapsulates caching logic

## Consequences

- Cache invalidation on threat feed updates
- Memory usage monitored
- Stale data possible within TTL window
