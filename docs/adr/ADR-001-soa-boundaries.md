# ADR-001: SOA vs. Microservices vs. Modular Monolith

## Status

Accepted

## Context

SDA-Pro requires 8 services to work together. We need to choose an architecture style.

## Decision

**SOA (Service-Oriented Architecture)** with clear service boundaries:

| Service                | Responsibility                       |
| ---------------------- | ------------------------------------ |
| Alert Ingestion        | Ingest alerts from external sources  |
| Enrichment             | Add context to alerts                |
| Incident Management    | Track incident lifecycle             |
| Response Orchestration | Execute response actions             |
| Threat Intel           | Query external threat feeds          |
| Notification           | Send alerts to Email/Slack/PagerDuty |
| Audit                  | Immutable logging for compliance     |
| Identity               | Authentication and authorization     |

## Justification

- Each service has single responsibility
- Services communicate via REST (sync) and EventBus (async)
- Team of 3 students can work in parallel on different services

## Consequences

- Clear ownership: Student A (3 services), Student B (3 services), Student C (2 services)
- EventBus enables loose coupling
- Contract testing required between services
