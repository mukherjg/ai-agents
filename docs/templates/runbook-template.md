<!--
Copy this page into Confluence under: 03 · Operations > <Domain> Ops
Rename the page to: OPS-<DOMAIN>-<SERVICE>: <Service Name> Runbook
Apply labels: runbook, one of [streaming | api-gateway | autosys | cross-platform], environment
Attach the Page Properties macro using the metadata table below as its fields.
Replace every [bracketed] placeholder before publishing.
Owned and maintained by Cloud Operations; Product/Platform team reviews for technical accuracy.
-->

# OPS-[DOMAIN]-[SERVICE]: [Service Name] Runbook

| Field | Value |
|---|---|
| Domain | [Streaming / API Gateway / Autosys / Cross-Platform] |
| Environment | [prod / nonprod] |
| Owning team | [team] |
| On-call rotation | [PagerDuty/Opsgenie schedule name] |
| Related ADR | [ADR-DOMAIN-NNN] |
| Related LLD | [LLD-DOMAIN-NNN] |
| Service Catalog page | [link] |
| Dashboard | [link] |
| Last reviewed | [YYYY-MM-DD] |

## 1. Service Summary

[One paragraph: what this service/job/topic/API does, who depends on it,
and what breaks if it's down. Link the architecture diagram from the LLD
rather than duplicating it.]

## 2. Normal Operation

[What "healthy" looks like — expected run duration, throughput, latency
range, queue depth, or job completion window. List the health checks and
where to view them.]

| Signal | Healthy range | Where to check |
|---|---|---|
| [e.g. job duration] | [~40 min] | [dashboard link] |
| [e.g. consumer lag] | [< 1000 msgs] | [dashboard link] |
| [e.g. 5xx rate] | [< 0.1%] | [dashboard link] |

## 3. Common Failure Scenarios & Remediation

| Symptom | Likely cause | Remediation | Escalate if |
|---|---|---|---|
| [e.g. job exits non-zero] | [upstream feed missing] | [check log at `[path]`, rerun via `[command]`] | [still failing after 1 retry] |
| [e.g. 429 spike] | [partner exceeding usage plan] | [confirm with partner, temporarily raise plan if approved] | [sustained > 15 min] |
| [e.g. consumer lag growing] | [downstream consumer stalled] | [check consumer group `[name]`, restart if stuck] | [lag not recovering in 10 min] |

## 4. Escalation Path & Ownership

1. [On-call rotation / PagerDuty schedule] — response SLA: [X min]
2. [Secondary: team lead]
3. [Tertiary: product owner]

[Note any external dependency escalation paths — Confluent Cloud support,
AWS support, partner contact — with ticket/severity conventions.]

## 5. Maintenance Procedures

[Routine operational tasks: scaling, key/secret rotation, calendar or
schedule changes, cluster/broker upgrades, certificate renewal. State
where each is tested before being applied to production.]

- [ ] [Procedure] — tested in [environment] before prod

## 6. DR / Failover Steps

[Step-by-step failover procedure if the primary region/cluster/instance
is unavailable. State whether failover is automatic or requires a manual
trigger, and who is authorized to trigger it.]

## 7. Security & Access

[Who has access to what (break-glass procedure if applicable), how
secrets are retrieved, and any compliance-driven access review cadence.]

## 8. Change Log

| Date | Change | Author |
|---|---|---|
| [YYYY-MM-DD] | [what changed and why] | [name] |
