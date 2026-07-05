# Confluence Structure for ADRs, LLDs & Operations Support

A documentation structure for a platform engineering team spanning Confluent Cloud
Kafka & Flink, AWS API Gateway (externally exposed APIs), and Autosys batch
workload automation — designed to be referenced by both the product/platform
team and the Cloud Operations team without maintaining two copies of the truth.

## Core principle: organize by document type first, domain second, service third

The product team thinks in decisions and designs; Cloud Operations thinks in
services and incidents. A structure organized purely by domain forces both
teams to dig through unrelated content types. One organized purely by type
forces Ops to search four different domain folders during an incident. The
fix is a three-level hierarchy — **type → domain → service** — plus one
connective page per service that cross-links all three.

Domain tags used throughout (as Confluence labels and page chips):

| Tag | Domain |
|---|---|
| `stream` | Kafka & Flink |
| `api-gw` | AWS API Gateway |
| `batch` | Autosys |
| `cross` | Platform-wide / cross-cutting |

## Space layout

A single shared Confluence space (`PLATFORM`) with view access for both teams;
edit rights differ by section (see [Permissions](#who-owns-what) below).
Utility pages — indexes and templates — are prefixed with an underscore so
they sort to the top of their folder.

```
Home
├── _Start Here                      (how to file a doc, links to templates)
├── Architecture Review Board        (governance cadence, meeting notes)
│
├── 01 · Decisions (ADR)
│   ├── _ADR Index                   (auto-built, Page Properties Report)
│   ├── _ADR Template
│   ├── Streaming                    [stream]
│   ├── API Gateway                  [api-gw]
│   ├── Autosys / Batch              [batch]
│   └── Cross-Platform               [cross]
│
├── 02 · Designs (LLD)
│   ├── _LLD Index                   (auto-built, Page Properties Report)
│   ├── _LLD Template
│   ├── Streaming                    [stream]
│   ├── API Gateway                  [api-gw]
│   ├── Autosys / Batch              [batch]
│   └── Cross-Platform               [cross]
│
├── 03 · Operations
│   ├── _Runbook Template
│   ├── Service Catalog              (the connective index — see below)
│   ├── Streaming Ops                [stream]  cluster health, topic/DR runbooks
│   ├── API Gateway Ops              [api-gw]  throttling, key rotation, WAF
│   ├── Autosys Ops                  [batch]   job calendars, rerun/restart SOPs
│   ├── Incident Postmortems
│   └── On-Call & Escalation
│
├── 04 · Tech Debt
│   ├── _Tech Debt Register          (auto-built, Page Properties Report)
│   ├── _Tech Debt Template
│   ├── Streaming                    [stream]
│   ├── API Gateway                  [api-gw]
│   ├── Autosys / Batch              [batch]
│   └── Cross-Platform               [cross]
│
└── 05 · Reference
    ├── Naming Conventions & Labels
    ├── Glossary
    └── Environments & Access
```

## Service Catalog: one page per real thing running in production

Example pages: `orders.events.v1` (Kafka topic), `/payments/v2` (API), `EOD_SETTLE_001` (Autosys job).

Every Kafka topic, API, Flink job, and Autosys job gets exactly one catalog
page carrying its domain tag, its owning team, and links out to its ADR(s),
its LLD, its runbook, and its dashboard. This is the page Cloud Ops opens
during an incident — it doesn't need to know the ADR folder structure to find
the design rationale behind a service it's paging on. The catalog page is
where the type-first and domain-first views meet.

## Tech Debt Register: tracking known compromises without losing them

An ADR is sometimes "accepted, but with a known trade-off" — a shortcut taken
to hit a delivery date, a deprecated client library still in use, a manual
step that should be automated. Without a dedicated home, these live in
someone's head or a stale Jira label. The Tech Debt Register gives them a
page of their own, cross-linked back to the ADR/LLD/Service Catalog page that
introduced the trade-off, so the debt is visible to whoever owns that service
next — including Cloud Ops, who often discovers debt first via an incident.

## Templates

Every ADR, LLD, and runbook is built from a Confluence page template carrying
a **Page Properties** macro (status, owner, domain, related links) at the
top. This metadata is what powers the auto-built indexes and the catalog
links.

### ADR (`ADR-<DOMAIN>-<NNN>`)

1. **Status** — proposed / accepted / rejected / superseded
2. **Context** — the forces at play
3. **Decision**
4. **Alternatives considered**
5. **Consequences** — good and bad
6. **Related LLD** / Jira epic
7. **Owner, reviewers, date**

### LLD (`LLD-<DOMAIN>-<NNN>`)

1. **Overview & scope**
2. **Requirements** — functional, NFRs, SLAs
3. **Architecture diagram**
4. **Interfaces** — schemas, topics, contracts
5. **Failure modes & recovery**
6. **Capacity & scaling**
7. **Security & monitoring**
8. **Ops handoff checklist** — required last section, filled in with Cloud
   Ops before sign-off. It becomes the seed of the runbook.

### Runbook (`OPS-<DOMAIN>-<SERVICE>`)

1. **Service summary** + links to ADR / LLD / dashboard
2. **Normal operation** — health checks, key metrics
3. **Failure scenarios** & remediation steps
4. **Escalation path** & ownership
5. **Maintenance procedures**
6. **DR / failover steps**
7. **Change log**

### Tech Debt Entry (`TD-<DOMAIN>-<NNN>`)

1. **Status** — identified / prioritized / in progress / resolved / accepted risk
2. **Category** — security, performance, scalability, maintainability, deprecated dependency, missing automation
3. **Description & root cause**
4. **Impact if unaddressed** — severity + blast radius
5. **Proposed remediation** & effort estimate
6. **Related ADR / LLD / Service Catalog page**
7. **Owner, date identified, target review date**

## Governance: ADR lifecycle

Status lives in the Page Properties macro, not in the title — so an ADR's URL
never has to change when its status does.

```
Draft → In Review → Accepted → Superseded
```

- **Draft** — author writing, not yet shared
- **In Review** — Architecture Review Board
- **Accepted** — binding, linked from LLD
- **Superseded** — linked forward to its replacement

## Governance: tech debt lifecycle

```
Identified → Prioritized → In Progress → Resolved
                  └──────────────→ Accepted Risk
```

- **Identified** — logged by whoever finds it (either team)
- **Prioritized** — triaged by the Architecture Review Board against severity and effort
- **In Progress** — remediation underway, linked to a Jira ticket
- **Resolved** — closed out, linked commit/PR or config change
- **Accepted Risk** — a valid terminal state; documented reason required, revisited at the target review date

## Taxonomy: labels that power the auto-indexes

Confluence labels are the only thing making the `_ADR Index` and `_LLD Index`
pages self-maintaining, via a **Page Properties Report** macro filtered by
label. Apply all that are relevant to every page.

| Facet | Values | Applied to |
|---|---|---|
| Type | `adr` · `lld` · `runbook` · `postmortem` · `tech-debt` | every page |
| Domain | `streaming` · `api-gateway` · `autosys` · `cross-platform` | every page |
| Status | `draft` · `in-review` · `accepted` · `deprecated` | ADR, LLD |
| Environment | `prod` · `nonprod` | runbooks |
| Severity | `low` · `medium` · `high` · `critical` | tech debt entries |

## Who owns what

Everyone gets view access across the whole space — the split below is edit
permissions, set at the folder level in Confluence's page restrictions.

| Document | Product / Platform team | Cloud Operations |
|---|---|---|
| ADR | **Author** | Reviewer (ops impact) |
| LLD | **Author** | Reviewer, required sign-off on Ops Handoff section |
| Runbook | Reviewer, technical accuracy | **Author & maintainer** |
| Service Catalog page | Co-author at launch | **Maintainer thereafter** |
| Postmortem | Co-author | **Author** (incident owner) |
| Tech Debt entry | **Author** (either team may log) | Reviewer, prioritization input |

## Automation notes

- Use Confluence's **Page Properties** macro on every ADR/LLD/runbook page to
  carry status, owner, domain, and related-links metadata.
- Use the **Page Properties Report** macro (filtered by label) to build the
  `_ADR Index` and `_LLD Index` pages so they never need hand maintenance as
  content grows.
- Link every ADR/LLD to its Jira epic or story so decision history is
  traceable from delivery tracking as well as from Confluence.

## Worked examples

One filled sample per template, showing the level of detail expected in
each field.

### Sample ADR — `ADR-STREAM-014`

| Field | Content |
|---|---|
| **Title** | Adopt Confluent Schema Registry with Avro for Order Events |
| **Status** | Accepted |
| **Context** | `orders.events.v1` consumers (3 internal, 1 partner-facing via API Gateway) keep breaking on producer field changes. No shared contract exists today; producers ship whatever JSON shape is convenient. |
| **Decision** | All new Kafka topics register an Avro schema in Confluent Schema Registry with `BACKWARD` compatibility enforced at the registry level. Existing topics migrate on their next breaking change. |
| **Alternatives considered** | (1) JSON Schema — weaker type guarantees, larger payloads. (2) Protobuf — better typing, but no existing team tooling; would require new codegen pipeline. |
| **Consequences** | + Compile-time contract safety, smaller payloads, safe evolution. − Producers need codegen step in CI; one-time migration effort for 6 existing topics. |
| **Related LLD** | `LLD-STREAM-014` · Jira `PLAT-118` |
| **Owner / reviewers / date** | J. Alvarez (author) · Cloud Ops, API Gateway lead (reviewers) · 2026-03-02 |

### Sample LLD — `LLD-API-GW-007`

| Field | Content |
|---|---|
| **Overview & scope** | Rate limiting for the partner-facing `/payments/v2` API, exposed via AWS API Gateway. Covers usage-plan design, key issuance, and throttling behavior; excludes partner onboarding workflow. |
| **Requirements** | 500 req/s sustained, 1000 req/s burst per partner key. 99.9% availability SLA. Throttled requests must return `429` with `Retry-After`. |
| **Architecture diagram** | Partner → API Gateway (usage plan + API key) → Lambda authorizer → VPC Link → internal payments service. |
| **Interfaces** | API Gateway usage plan per partner tier (Bronze/Silver/Gold); API key stored in Secrets Manager; contract in `payments-api-v2.yaml` (OpenAPI). |
| **Failure modes & recovery** | Authorizer Lambda cold start latency spike → provisioned concurrency of 2. Downstream payments service degradation → circuit breaker returns cached `503` with backoff hint. |
| **Capacity & scaling** | Usage plans reviewed quarterly against partner growth; API Gateway scales automatically, VPC Link concurrency capped and alarmed at 80%. |
| **Security & monitoring** | WAF rate-based rule as a backstop below the usage-plan limit; CloudWatch alarms on 4xx/5xx rate and p99 latency; key rotation every 90 days. |
| **Ops handoff checklist** | ✅ Runbook `OPS-API-GW-PAYMENTS` drafted · ✅ Dashboards linked · ✅ On-call briefed on key-rotation SOP · ✅ Escalation contact for partner confirmed |

### Sample Runbook — `OPS-BATCH-EOD`

| Field | Content |
|---|---|
| **Service summary** | `EOD_SETTLE_001` — Autosys job, runs nightly 23:30 UTC, settles the day's transactions. Links: `ADR-BATCH-004`, `LLD-BATCH-004`, Grafana dashboard `autosys-eod`. |
| **Normal operation** | Job box `EOD_SETTLE_001` completes in ~40 min; watch `JOBS_RUNNING` and `EXIT_CODE` in the Autosys dashboard; success event posts to `#batch-ops`. |
| **Failure scenarios & remediation** | *Upstream feed late* → hold box auto-waits until 01:00 UTC, page on-call if still waiting after that. *Non-zero exit* → check job log in `/logs/eod_settle/`, rerun from last successful checkpoint via `sendevent -E FORCE_STARTJOB`. |
| **Escalation path** | Cloud Ops on-call (PagerDuty `batch-ops`) → Settlement platform lead → Product owner, in that order, 15-min response SLA. |
| **Maintenance procedures** | Calendar changes (holiday schedules) require a change ticket + Autosys calendar update, tested in UAT box first. |
| **DR / failover steps** | If the primary Autosys instance is down, failover job definitions are pre-loaded on the DR instance; manual trigger required, see `DR-BATCH-RUNBOOK`. |
| **Change log** | 2026-01-14 — added checkpoint-based rerun (was full-rerun only). |

### Sample Tech Debt entry — `TD-STREAM-009`

| Field | Content |
|---|---|
| **Status** | Accepted Risk |
| **Category** | Deprecated dependency |
| **Description & root cause** | All Kafka consumers still pinned to client library `2.8.x`, EOL'd by Confluent. Upgrade was deferred during the Q3 migration crunch. |
| **Impact if unaddressed** | Medium severity — no current CVE, but blocks adoption of newer exactly-once semantics improvements and will block future broker upgrades. |
| **Proposed remediation** | Bump to `3.6.x` client across 6 services; estimated 3 days per service including regression testing. |
| **Related page** | `ADR-STREAM-014`, Service Catalog `orders.events.v1` |
| **Owner / dates** | M. Chen (identified 2026-02-10) · reviewed quarterly, next review 2026-08-01 |
