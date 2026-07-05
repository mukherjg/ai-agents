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
└── 04 · Reference
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

## Taxonomy: labels that power the auto-indexes

Confluence labels are the only thing making the `_ADR Index` and `_LLD Index`
pages self-maintaining, via a **Page Properties Report** macro filtered by
label. Apply all that are relevant to every page.

| Facet | Values | Applied to |
|---|---|---|
| Type | `adr` · `lld` · `runbook` · `postmortem` | every page |
| Domain | `streaming` · `api-gateway` · `autosys` · `cross-platform` | every page |
| Status | `draft` · `in-review` · `accepted` · `deprecated` | ADR, LLD |
| Environment | `prod` · `nonprod` | runbooks |

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

## Automation notes

- Use Confluence's **Page Properties** macro on every ADR/LLD/runbook page to
  carry status, owner, domain, and related-links metadata.
- Use the **Page Properties Report** macro (filtered by label) to build the
  `_ADR Index` and `_LLD Index` pages so they never need hand maintenance as
  content grows.
- Link every ADR/LLD to its Jira epic or story so decision history is
  traceable from delivery tracking as well as from Confluence.
