# ADR-002: Synchronous vs. Asynchronous Inter-Service Communication

## Status

Accepted

## Context

Services need to communicate. Some operations need immediate response, others don't.

## Decision

**Hybrid Approach:**

### Synchronous (REST/gRPC) - for critical paths:

- Dashboard → Identity: `GET /identity/analysts/{id}`
- Dashboard → Incident Management: `GET /incidents`
- Response Orchestration → Threat Intel: `POST /threat-intel/reputation`

### Asynchronous (Event Bus) - for non-critical:

- `AlertIngested` → Enrichment, Dashboard, Audit
- `IncidentCreated` → Dashboard, Notification, Response Orchestration
- `ResponseActionExecuted` → Dashboard, Audit, Notification

## Justification

- Dashboard needs immediate responses for user actions
- Event-driven decouples services for better scalability
- Observer pattern (Section 4.1) requires async events

## Consequences

- EventBus with RabbitMQ as message broker
- Eventual consistency for audit and notifications
- Idempotent event handlers required
