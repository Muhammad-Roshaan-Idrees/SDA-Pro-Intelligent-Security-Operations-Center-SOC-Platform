# ADR-003: Database Strategy

## Status

Accepted

## Context

SDA-Pro needs to store incidents, alerts, audit logs, and threat intel cache.

## Decision

**PostgreSQL + Redis Hybrid:**

### PostgreSQL (Relational):

- Incident records (with state transitions)
- Audit logs (immutable, compliance)
- Alert archive (normalized alerts)

### Redis (In-memory):

- Threat intel cache (TTL-based)
- Session store for dashboard users
- Rate limiting counters

## Justification

- PostgreSQL ensures ACID compliance for incidents and audits
- Redis provides sub-millisecond latency for threat intel lookups
- Document stores not needed - alert schema is consistent after normalization

## Consequences

- Two databases to manage
- Redis persistence configured for cache recovery
- Audit logs append-only in PostgreSQL
