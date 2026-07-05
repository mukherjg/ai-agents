<!--
Copy this page into Confluence under: 02 · Designs (LLD) > <Domain>
Rename the page to: LLD-<DOMAIN>-<NNN>: <Feature / Service Name>
Apply labels: lld, one of [streaming | api-gateway | autosys | cross-platform], status
Attach the Page Properties macro using the metadata table below as its fields.
Replace every [bracketed] placeholder before publishing.
-->

# LLD-[DOMAIN]-[NNN]: [Feature / Service Name]

| Field | Value |
|---|---|
| Status | [Draft / In Review / Accepted / Deprecated] |
| Domain | [Streaming / API Gateway / Autosys / Cross-Platform] |
| Owner | [name] |
| Reviewers | [names — must include Cloud Ops reviewer] |
| Related ADR(s) | [ADR-DOMAIN-NNN] |
| Related Jira epic | [KEY-NNN] |
| Service Catalog page | [link] |
| Last updated | [YYYY-MM-DD] |

## 1. Overview & Scope

[What is being built and why, in 3-5 sentences. State explicitly what is
**out of scope** — this is the section people skip and then argue about
later.]

## 2. Requirements

**Functional**
- [ ]

**Non-functional / SLAs**
| Requirement | Target |
|---|---|
| Throughput | [e.g. 500 req/s sustained, 1000 req/s burst] |
| Latency | [e.g. p99 < 200ms] |
| Availability | [e.g. 99.9%] |
| Data retention | [e.g. 7 days on topic, 90 days archived] |

## 3. Architecture Diagram

[Embed or link the diagram. Show every component the request/message
touches, including the ones outside your team's direct ownership — e.g.
Confluent Cloud cluster, Flink job, API Gateway stage, VPC Link, Autosys
job box.]

## 4. Interfaces

[List every schema, topic, API contract, or job dependency this design
introduces or changes.]

| Interface | Type | Contract / Schema | Owner |
|---|---|---|---|
| [e.g. `orders.events.v1`] | Kafka topic | [Avro schema link] | [team] |
| [e.g. `/payments/v2`] | REST API | [OpenAPI spec link] | [team] |
| [e.g. `EOD_SETTLE_001`] | Autosys job | [job definition link] | [team] |

## 5. Data Flow

[Describe the path a single unit of work takes end to end — one request,
one event, one job run — including what happens on the happy path and
where it can branch.]

## 6. Failure Modes & Recovery

| Failure | Detection | Recovery |
|---|---|---|
| [e.g. downstream service degraded] | [alarm / metric] | [circuit breaker, retry policy, manual step] |
| [e.g. upstream feed late] | [monitor] | [wait window, escalation] |

## 7. Capacity & Scaling

[Current load, expected growth, scaling mechanism (auto vs. manual), and
the review cadence for revisiting capacity assumptions.]

## 8. Security & Compliance

[AuthN/AuthZ model, secrets management, data classification, any
regulatory requirement (PCI, PII handling), network exposure — especially
relevant for anything reachable from outside the company via API Gateway.]

## 9. Monitoring & Alerting

| Metric | Dashboard | Alert threshold | Pages |
|---|---|---|---|
| [e.g. p99 latency] | [link] | [value] | [on-call rotation] |
| [e.g. consumer lag] | [link] | [value] | [on-call rotation] |

## 10. Rollback Plan

[How to undo this change safely if it fails in production — schema
rollback, feature flag, previous job version, API Gateway stage
rollback, etc. If rollback is not possible, say so explicitly and state
the compensating control.]

## 11. Ops Handoff Checklist

Required before this LLD moves to **Accepted**. Complete jointly with
Cloud Operations — this becomes the seed of the runbook.

- [ ] Runbook drafted at `OPS-[DOMAIN]-[SERVICE]`
- [ ] Dashboards linked and accessible to on-call
- [ ] On-call rotation briefed on new failure modes
- [ ] Escalation contacts confirmed
- [ ] Alert thresholds tuned and tested (not just configured)
- [ ] Service Catalog page created/updated

## 12. Open Questions / Risks

- [ ]

## 13. Appendix / References

[Links to prior art, benchmarks, related postmortems, vendor docs.]
