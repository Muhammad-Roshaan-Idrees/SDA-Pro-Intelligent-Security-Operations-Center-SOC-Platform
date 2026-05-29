# ADR-005: Real-Time Push Strategy

## Status

Accepted

## Context

SOC Dashboard requires updates within 2 seconds when incidents change or new alerts arrive.

## Decision

**WebSockets + Observer Pattern:**

- WebSockets for bidirectional dashboard communication
- Observer pattern: EventBus notifies DashboardUpdater
- DashboardUpdater broadcasts to all connected clients

## Justification

- WebSockets provide full-duplex communication
- Observer pattern (Section 4.1) is specifically designed for this use case
- <2 second latency achieved

## Consequences

- WebSocket server must manage client connections
- Reconnection logic required on client side
- Fallback to SSE for browsers without WebSocket support
