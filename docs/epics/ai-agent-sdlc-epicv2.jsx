import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const EPIC = {
  key: "PLAT-001",
  title: "Establish Structured AI Agent Skills Framework for SDLC Productivity",
  status: "To Do",
  priority: "High",
  labels: ["ai-agents", "sdlc", "platform-engineering", "dx"],
  summary:
    "Define, build, and operationalize a governed library of reusable AI agent skills that accelerate every phase of the software development lifecycle — from requirements through deployment and incident response.",
  description:
    "Engineering teams lose significant time to repetitive, low-cognition work across SDLC phases: scaffolding repos, writing boilerplate pipelines, generating test cases, triaging incidents, and authoring runbooks. This epic establishes a structured, versioned framework for AI agent skills that can be composed into agentic workflows, enabling engineers to delegate these tasks while retaining human oversight at critical gates. Skills must be installable, testable, documented, and governed under a clear ownership model.",
  businessValue:
    "Reduce per-feature cycle time by 30%+ through automated SDLC task delegation. Improve code quality consistency and security posture via standardised AI-assisted reviews. Free senior engineers from toil to focus on architecture and high-value work.",
  acceptanceCriteria: [
    { id: "AC-1", category: "Framework", criterion: "A canonical AI Agent Skill specification (SKILL.md schema) is defined and published to the internal developer portal, covering: skill metadata, input/output contracts, tool permissions, human approval gates, and retry logic." },
    { id: "AC-2", category: "Framework", criterion: "A versioned skill registry exists (Git-backed) where skills are discoverable by SDLC phase, tool chain, and team. At least one skill per each of the 5 core SDLC phases is published at v1.0." },
    { id: "AC-3", category: "Governance", criterion: "Each skill includes a CODEOWNERS entry, a changelog, and a minimum test suite with ≥1 happy-path and ≥1 failure scenario validated in CI." },
    { id: "AC-4", category: "Governance", criterion: "A human-in-the-loop (HITL) gate policy is documented and enforced: any skill action that mutates production infrastructure, merges code, or opens external tickets must pause for explicit human approval before proceeding." },
    { id: "AC-5", category: "Integration", criterion: "Skills are consumable from at least two developer surfaces: Claude Code CLI and a Harness pipeline step, with no manual copy-paste of skill payloads." },
    { id: "AC-6", category: "Integration", criterion: "Skill execution emits structured telemetry (start, complete, fail, approval-waited, approval-granted) to the team's observability stack (e.g., CloudWatch or Datadog), enabling audit trails." },
    { id: "AC-7", category: "Quality", criterion: "A skill evaluation harness exists that measures task completion rate, hallucination rate, and time-saved vs. manual baseline. Baseline metrics are captured for ≥3 skills before rollout." },
    { id: "AC-8", category: "Quality", criterion: "All skills pass a security review checklist: no hardcoded secrets, no unrestricted shell execution without scoped permissions, secrets retrieved via Vault/SSM only." },
    { id: "AC-9", category: "Adoption", criterion: "An onboarding guide (< 15 min read) enables any platform engineer to install, run, and contribute a new skill without 1:1 help. Validated by dry run with ≥2 engineers not on the authoring team." },
    { id: "AC-10", category: "Adoption", criterion: "A skill usage dashboard is available showing: installs per skill, daily active runs, HITL approval frequency, and error rates — enabling data-driven prioritisation of future skill development." },
  ],
  stories: [
    { key: "PLAT-002", title: "Define AI Agent Skill Specification and Schema", points: 5, phase: "Foundation", priority: "Critical", description: "Author the canonical SKILL.md schema that all agent skills must conform to. Define metadata fields (name, version, author, tools, permissions), input/output contracts, invocation modes (interactive vs. autonomous), and HITL gate declarations. Publish to the developer portal.", acceptanceCriteria: ["Schema covers all required fields and is validated with JSON Schema or similar", "At least one reference skill is updated to comply with the schema", "Published and linkable from the internal portal"], dependencies: [] },
    { key: "PLAT-003", title: "Bootstrap Versioned Skill Registry (Git + CI)", points: 5, phase: "Foundation", priority: "Critical", description: "Create a Git repository structure for the skill registry with CODEOWNERS, per-skill directories, a CI pipeline that validates schema conformance and runs skill test suites on every PR, and a release tagging convention (semver).", acceptanceCriteria: ["Registry repo scaffolded with CODEOWNERS and branch protection", "CI validates SKILL.md schema on every PR", "Skills are tagged and released via semver", "README documents contribution workflow"], dependencies: ["PLAT-002"] },
    { key: "PLAT-004", title: "Build SDLC Requirements & Design Phase Skill", points: 8, phase: "SDLC — Plan", priority: "High", description: "Create an AI agent skill for the planning phase: given a Jira epic or feature brief, the agent produces structured user stories with acceptance criteria, a high-level technical design doc (Mermaid architecture diagram + ADR stub), and a risk register. HITL gate required before any Jira ticket creation.", acceptanceCriteria: ["Skill accepts epic description and produces stories, design doc, and risk register", "HITL gate pauses before writing to Jira", "Output format matches team templates", "Evaluated against 2 real epics with quality score ≥ 4/5 from reviewers"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-005", title: "Build Code Generation & Scaffolding Skill", points: 8, phase: "SDLC — Build", priority: "High", description: "Create a skill that scaffolds new microservices or Helm charts from a specification: generates project structure, Dockerfile, Helm chart skeleton, Terraform module stubs, and a basic CI pipeline YAML. Integrates with internal Nexus and EKS conventions.", acceptanceCriteria: ["Skill generates a runnable scaffold from a service spec", "Output passes Hadolint and Checkov static checks", "Generated pipeline YAML is valid Harness YAML", "Skill is runnable from Claude Code CLI"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-006", title: "Build AI-Assisted Code & Security Review Skill", points: 8, phase: "SDLC — Build", priority: "High", description: "Create a skill that performs AI-assisted PR review: checks for security anti-patterns (OWASP Top 10), flags missing tests, reviews Dockerfile and Terraform for CIS compliance, and posts structured review comments to GitHub. Read-only; no auto-merge capability.", acceptanceCriteria: ["Skill runs against any PR URL and produces structured feedback", "Flags ≥90% of known test fixtures containing OWASP issues", "Posts comments to GitHub PR via API (no direct merge)", "False positive rate documented and < 15% on benchmark set"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-007", title: "Build Automated Test Generation Skill", points: 8, phase: "SDLC — Test", priority: "High", description: "Create a skill that generates unit, integration, and contract test stubs for a given service or module. Supports Java/Spring and Python. Integrates with the repo-analyzer skill to understand existing test patterns and coverage gaps.", acceptanceCriteria: ["Generates test stubs for ≥80% of public functions/methods", "Generated tests are syntactically valid and pass compilation", "Skill respects existing test framework (JUnit5, pytest) detected from repo", "Coverage delta report produced showing pre/post estimate"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-008", title: "Build CI/CD Pipeline Orchestration Skill (EKS/Harness)", points: 13, phase: "SDLC — Deploy", priority: "High", description: "Formalize and package the existing EKS deployment agent as a governed skill. Includes full pipeline definition (CI: build → Trivy/Grype/Hadolint/Checkov → Nexus push; CD: environment/region matrix via Helm), HITL gates before production promotion, and structured deployment telemetry.", acceptanceCriteria: ["Skill encapsulates full CI + CD pipeline as described in team architecture", "HITL gate required before any prod environment promotion", "Deployment events emitted to observability stack", "Rollback trigger available as a separate skill action", "Runnable from both Claude Code and Harness pipeline step"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-009", title: "Build Incident Response & RCA Skill", points: 8, phase: "SDLC — Operate", priority: "High", description: "Create an AI agent skill for incident management: given an alert or Kafka incident context, the agent performs triage (severity classification, impacted services, blast radius), drafts an incident timeline, and generates a structured RCA report with 5-Whys. Integrates with PagerDuty/Jira for ticket creation (HITL gated).", acceptanceCriteria: ["Skill classifies severity with ≥85% accuracy on benchmark incident set", "RCA report follows team's structured template", "Jira/PagerDuty ticket creation requires explicit HITL approval", "Skill is runnable within 2 minutes of alert trigger"], dependencies: ["PLAT-002", "PLAT-003"] },
    { key: "PLAT-010", title: "Implement HITL Gate Policy and Enforcement Layer", points: 5, phase: "Foundation", priority: "Critical", description: "Design and implement the human-in-the-loop (HITL) approval gate mechanism used across all skills. The gate must: pause agent execution, surface context to the approver (what action, what target, what risk), support approve/reject/modify, and log the decision with actor and timestamp.", acceptanceCriteria: ["Gate library is importable by any skill", "Approvals surfaced via Slack message with action buttons (or CLI prompt)", "All approval events logged to audit store", "Gate is bypassable only via explicit --override flag with reason (logged)"], dependencies: ["PLAT-002"] },
    { key: "PLAT-011", title: "Build Skill Evaluation Harness and Baseline Metrics", points: 5, phase: "Foundation", priority: "Medium", description: "Build an evaluation framework that measures skill quality: task completion rate, output quality score (rubric-based), time-saved vs. manual baseline, HITL trigger frequency, and error/hallucination rate. Capture baselines for the first three shipped skills.", acceptanceCriteria: ["Eval harness runs as a CLI tool against any skill + fixture set", "Outputs structured report with all 5 metrics", "Baselines captured for PLAT-004, PLAT-005, PLAT-007", "Results published to skill registry alongside skill metadata"], dependencies: ["PLAT-003"] },
    { key: "PLAT-012", title: "Engineer Onboarding Guide and Skill Usage Dashboard", points: 5, phase: "Adoption", priority: "Medium", description: "Author a concise onboarding guide (< 15-min read) covering: skill installation, first run, contribution workflow, and HITL policy. Build a lightweight usage dashboard (Grafana or similar) showing installs, daily runs, approval frequency, and error rates per skill.", acceptanceCriteria: ["Onboarding guide validated with ≥2 engineers not on authoring team", "Dashboard live and accessible to entire platform team", "All 5 dashboard KPIs visible", "Guide linked from skill registry README"], dependencies: ["PLAT-003", "PLAT-010"] },
  ],
};

// ─── KPI DATA ─────────────────────────────────────────────────────────────────

const KPI_GROUPS = [
  {
    id: "value",
    label: "Value Delivered",
    icon: "📈",
    description: "Outcomes that demonstrate business and engineering impact to stakeholders",
    color: { bg: "#EFF6FF", border: "#BFDBFE", heading: "#1E40AF", tag: "#DBEAFE", tagText: "#1D4ED8" },
    kpis: [
      {
        id: "KV-1",
        name: "Feature Cycle Time Reduction",
        category: "Speed",
        what: "Average calendar days from story creation to production deployment, compared to pre-skill baseline.",
        target: "≥ 30% reduction within 90 days of first 3 skills in prod",
        baseline: "Measure avg cycle time across last 10 features before rollout",
        how: "Jira lead time report (story created → deployed). Compare 30-day rolling avg pre vs. post.",
        source: "Jira + Harness deployment events",
        linked: ["PLAT-004", "PLAT-005", "PLAT-008"],
      },
      {
        id: "KV-2",
        name: "Toil Hours Reclaimed per Engineer per Week",
        category: "Productivity",
        what: "Hours saved on low-cognition repetitive tasks (scaffolding, ticket writing, test stub creation, runbooks) per engineer using skills.",
        target: "≥ 4 hrs/engineer/week reclaimed across plan + build + operate phases",
        baseline: "Time-track 2 sprints manually for each task category before launch",
        how: "Skill telemetry time-saved field + quarterly engineer survey (10-min). Cross-validate both.",
        source: "Skill execution telemetry + survey",
        linked: ["PLAT-004", "PLAT-005", "PLAT-007", "PLAT-009"],
      },
      {
        id: "KV-3",
        name: "Security Defect Escape Rate",
        category: "Quality",
        what: "% of PRs reaching staging/prod with a OWASP Top 10 or CIS-benchmark violation, compared to baseline.",
        target: "≥ 50% reduction in security defect escapes within 60 days of code review skill rollout",
        baseline: "Count security-related prod incidents / hotfixes in last 3 months",
        how: "Track PLAT-006 PR review findings caught vs. total PRs. Defects that escape = not flagged by skill and found in staging/prod.",
        source: "GitHub PR comments + Jira security bug labels + Trivy/Grype scan results",
        linked: ["PLAT-006", "PLAT-008"],
      },
      {
        id: "KV-4",
        name: "Mean Time to Resolve (MTTR) Incidents",
        category: "Reliability",
        what: "Average time from alert fire to incident resolution (Jira closed), segmented by severity tier.",
        target: "≥ 25% reduction in MTTR for P2/P3 incidents within 60 days of incident skill rollout",
        baseline: "Avg MTTR per severity from PagerDuty/Jira last quarter",
        how: "PagerDuty alert timestamp → Jira resolution timestamp. Compare pre/post skill adoption cohorts.",
        source: "PagerDuty + Jira + skill execution logs",
        linked: ["PLAT-009"],
      },
      {
        id: "KV-5",
        name: "Test Coverage Delta per PR",
        category: "Quality",
        what: "Average increase in code coverage (line/branch) on PRs where the test generation skill was used vs. unassisted PRs.",
        target: "≥ 15 percentage-point coverage lift on skill-assisted PRs vs. control group",
        baseline: "Current avg coverage from last 20 PRs in each service",
        how: "CI pipeline reports coverage delta per PR. Tag skill-assisted vs. unassisted. Compute avg delta per cohort.",
        source: "JaCoCo / pytest-cov reports in Harness CI",
        linked: ["PLAT-007"],
      },
      {
        id: "KV-6",
        name: "Skill Reuse Rate",
        category: "Platform Health",
        what: "% of new feature work initiated that uses ≥1 published skill, as a proxy for framework adoption and compounding ROI.",
        target: "≥ 60% of new stories/PRs use at least one skill within 6 months of first GA release",
        baseline: "0% at launch",
        how: "Skill telemetry: count unique feature branches that invoke ≥1 skill. Denominator = total new feature branches opened.",
        source: "Skill execution telemetry + GitHub branch data",
        linked: ["PLAT-003", "PLAT-012"],
      },
    ],
  },
  {
    id: "personal",
    label: "Your Personal Productivity",
    icon: "⚡",
    description: "KPIs tracking Gautam's individual engineering throughput and skill-building velocity",
    color: { bg: "#F0FDF4", border: "#BBF7D0", heading: "#166534", tag: "#DCFCE7", tagText: "#166534" },
    kpis: [
      {
        id: "KP-1",
        name: "Skills Shipped per Sprint",
        category: "Velocity",
        what: "Number of new or updated skills merged to the registry per 2-week sprint. Measures build momentum and output consistency.",
        target: "≥ 1 new skill shipped per sprint; ≥ 1 existing skill improved per sprint",
        baseline: "0 at project start",
        how: "Git tag count per sprint window in skill registry. Exclude WIP branches — only merged + tagged releases count.",
        source: "Skill registry Git tags + sprint dates",
        linked: ["PLAT-003"],
      },
      {
        id: "KP-2",
        name: "Time from Idea to First Running Skill",
        category: "Velocity",
        what: "Clock time from creating a skill scaffold to first successful end-to-end execution (happy path passing). Measures your design-to-ship speed.",
        target: "< 3 days for a medium-complexity skill (8 pts) after framework is stable",
        baseline: "Capture time for PLAT-004 as the calibration anchor",
        how: "Log idea date (Jira story created) → first green CI run on skill's test suite. Track per skill.",
        source: "Jira timestamps + CI pipeline logs",
        linked: ["PLAT-002", "PLAT-003"],
      },
      {
        id: "KP-3",
        name: "HITL Override Rate (Personal)",
        category: "Quality",
        what: "% of your own skill runs where you triggered --override (bypassed approval gate). A high rate signals scope creep or trust drift — should stay low.",
        target: "< 5% of your skill runs use --override; all overrides have a logged reason",
        baseline: "0% at launch — capture from first run",
        how: "Audit log filter: actor = you + override flag = true. Divide by your total skill invocations.",
        source: "HITL audit log (PLAT-010)",
        linked: ["PLAT-010"],
      },
      {
        id: "KP-4",
        name: "Skill Contribution Ratio",
        category: "Impact",
        what: "Ratio of skills you've authored vs. skills authored by others on the team. Tracks whether the framework is landing and reducing your single-threaded bottleneck.",
        target: "By month 4: team contributes ≥ 2 skills without your direct authorship",
        baseline: "100% your own at launch",
        how: "CODEOWNERS + Git blame per skill directory. Count distinct primary authors.",
        source: "Skill registry Git history",
        linked: ["PLAT-003", "PLAT-012"],
      },
      {
        id: "KP-5",
        name: "Context-Switch Interruptions Avoided",
        category: "Focus",
        what: "Estimated reduction in ad-hoc interruptions (Slack pings, pairing requests) for repetitive tasks that are now delegated to skills. Proxy for deep-work time reclaimed.",
        target: "≥ 30% reduction in interruptions tagged 'how-do-I-scaffold / how-do-I-write-tests / can-you-review' after onboarding guide + skills are live",
        baseline: "Count relevant Slack thread types in 2-week pre-launch window",
        how: "Slack analytics (channel message volume in #platform-help for tagged request types) + subjective sprint retro score (1–5).",
        source: "Slack workspace analytics + sprint retro notes",
        linked: ["PLAT-012"],
      },
      {
        id: "KP-6",
        name: "Story Point Throughput (AI-Assisted vs. Unassisted Sprints)",
        category: "Velocity",
        what: "Your personal story point delivery rate in sprints where you heavily used AI agent skills vs. sprints without. Quantifies your direct productivity lift.",
        target: "≥ 25% higher pts/sprint in AI-assisted sprints vs. your trailing 6-sprint baseline",
        baseline: "Calculate your avg pts/sprint from last 6 sprints before skill usage",
        how: "Jira velocity report filtered to your assignee. Tag sprints as assisted (≥3 skill invocations) vs. baseline.",
        source: "Jira velocity report + skill telemetry",
        linked: ["PLAT-004", "PLAT-005", "PLAT-007", "PLAT-008"],
      },
    ],
  },
];

// ─── STYLE CONSTANTS ──────────────────────────────────────────────────────────

const PHASE_COLORS = {
  "Foundation": { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  "SDLC — Plan": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  "SDLC — Build": { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  "SDLC — Test": { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
  "SDLC — Deploy": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "SDLC — Operate": { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  "Adoption": { bg: "#F0FDFA", text: "#115E59", border: "#99F6E4" },
};

const PRIORITY_DOT = { Critical: "#EF4444", High: "#F97316", Medium: "#EAB308", Low: "#6B7280" };

const CATEGORY_COLORS = {
  Framework: { bg: "#EFF6FF", text: "#1D4ED8" },
  Governance: { bg: "#FDF4FF", text: "#7E22CE" },
  Integration: { bg: "#F0FDF4", text: "#166534" },
  Quality: { bg: "#FFF7ED", text: "#9A3412" },
  Adoption: { bg: "#F0FDFA", text: "#115E59" },
};

const KPI_CATEGORY_COLORS = {
  Speed: { bg: "#EFF6FF", text: "#1E40AF" },
  Productivity: { bg: "#F0FDF4", text: "#166534" },
  Quality: { bg: "#FFF7ED", text: "#9A3412" },
  Reliability: { bg: "#FDF4FF", text: "#7E22CE" },
  "Platform Health": { bg: "#F0FDFA", text: "#115E59" },
  Velocity: { bg: "#FFFBEB", text: "#92400E" },
  Impact: { bg: "#FEF9C3", text: "#854D0E" },
  Focus: { bg: "#EEF2FF", text: "#4338CA" },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Badge({ label, style }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, ...style }}>
      {label}
    </span>
  );
}

function PriorityDot({ priority }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_DOT[priority] || "#6B7280", display: "inline-block", flexShrink: 0 }} />
      {priority}
    </span>
  );
}

function ACRow({ ac, idx }) {
  const cat = CATEGORY_COLORS[ac.category] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
      <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#374151", marginTop: 1 }}>
        {idx + 1}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 4 }}>
          <Badge label={ac.category} style={{ background: cat.bg, color: cat.text }} />
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: "#1F2937", lineHeight: 1.6 }}>{ac.criterion}</p>
      </div>
    </div>
  );
}

function StoryCard({ story, isOpen, onToggle }) {
  const phase = PHASE_COLORS[story.phase] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, marginBottom: 8, background: "#FFF", overflow: "hidden", boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.07)" : "none" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ flexShrink: 0, fontSize: 11, fontFamily: "monospace", color: "#2563EB", fontWeight: 700, minWidth: 68 }}>{story.key}</span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{story.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Badge label={story.phase} style={{ background: phase.bg, color: phase.text, border: `1px solid ${phase.border}` }} />
          <PriorityDot priority={story.priority} />
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E40AF", color: "#FFF", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{story.points}</span>
          <span style={{ fontSize: 14, color: "#6B7280" }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>
      {isOpen && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #F3F4F6" }}>
          <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: "12px 0" }}>{story.description}</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", margin: "12px 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>Acceptance Criteria</p>
          {story.acceptanceCriteria.map((ac, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: i < story.acceptanceCriteria.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              <span style={{ flexShrink: 0, marginTop: 3, width: 16, height: 16, borderRadius: 3, border: "1.5px solid #D1D5DB", display: "inline-block" }} />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{ac}</span>
            </div>
          ))}
          {story.dependencies.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>DEPENDS ON</span>
              {story.dependencies.map(d => <Badge key={d} label={d} style={{ background: "#F3F4F6", color: "#374151", fontSize: 11 }} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KPICard({ kpi, color, isOpen, onToggle }) {
  const catColor = KPI_CATEGORY_COLORS[kpi.category] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <div style={{ border: `1px solid ${color.border}`, borderRadius: 8, marginBottom: 10, background: "#FFF", overflow: "hidden", boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.08)" : "none" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ flexShrink: 0, fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: color.heading, minWidth: 46 }}>{kpi.id}</span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{kpi.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Badge label={kpi.category} style={{ background: catColor.bg, color: catColor.text }} />
          <span style={{ fontSize: 14, color: "#6B7280" }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>
      {isOpen && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${color.border}` }}>
          <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: "12px 0 14px" }}>{kpi.what}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "🎯 Target", value: kpi.target, bg: "#F0FDF4", border: "#BBF7D0" },
              { label: "📏 Baseline", value: kpi.baseline, bg: "#FFFBEB", border: "#FDE68A" },
              { label: "🔬 How to Measure", value: kpi.how, bg: "#EFF6FF", border: "#BFDBFE" },
              { label: "📡 Data Source", value: kpi.source, bg: "#FDF4FF", border: "#E9D5FF" },
            ].map(({ label, value, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
                <div style={{ fontSize: 12.5, color: "#1F2937", lineHeight: 1.55 }}>{value}</div>
              </div>
            ))}
          </div>
          {kpi.linked.length > 0 && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>LINKED STORIES</span>
              {kpi.linked.map(s => <Badge key={s} label={s} style={{ background: color.tag, color: color.tagText, fontSize: 11 }} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("epic");
  const [openStory, setOpenStory] = useState(null);
  const [openKPI, setOpenKPI] = useState(null);
  const [acFilter, setAcFilter] = useState("All");
  const [kpiGroup, setKpiGroup] = useState("value");

  const acCategories = ["All", ...Array.from(new Set(EPIC.acceptanceCriteria.map(a => a.category)))];
  const filteredAC = acFilter === "All" ? EPIC.acceptanceCriteria : EPIC.acceptanceCriteria.filter(a => a.category === acFilter);
  const totalPoints = EPIC.stories.reduce((s, x) => s + x.points, 0);
  const phases = [...new Set(EPIC.stories.map(s => s.phase))];

  const activeGroup = KPI_GROUPS.find(g => g.id === kpiGroup);

  const TABS = [
    { id: "epic", label: "📋 Epic" },
    { id: "stories", label: `📝 Stories (${EPIC.stories.length})` },
    { id: "kpis", label: "📊 KPIs" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 880, margin: "0 auto", padding: "24px 16px", background: "#F9FAFB", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "#1E3A5F", borderRadius: 10, padding: "20px 24px", marginBottom: 20, color: "#FFF" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <span style={{ background: "#7C3AED", color: "#FFF", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>EPIC</span>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#93C5FD", fontWeight: 700 }}>{EPIC.key}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, background: "rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px" }}>🕐 {EPIC.status}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.4, color: "#F8FAFC" }}>{EPIC.title}</h1>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {EPIC.labels.map(l => <span key={l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 3, padding: "2px 7px", fontSize: 11, color: "#CBD5E1" }}>{l}</span>)}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 20, fontSize: 12, color: "#94A3B8", flexWrap: "wrap" }}>
          <span>📋 {EPIC.stories.length} stories</span>
          <span>📐 {totalPoints} story points</span>
          <span>✅ {EPIC.acceptanceCriteria.length} acceptance criteria</span>
          <span>📊 {KPI_GROUPS.reduce((a, g) => a + g.kpis.length, 0)} KPIs</span>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#E5E7EB", borderRadius: 7, padding: 3 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === t.id ? "#FFF" : "transparent", color: tab === t.id ? "#1E40AF" : "#6B7280", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── EPIC TAB ── */}
      {tab === "epic" && (
        <div>
          <div style={{ background: "#FFF", borderRadius: 8, padding: 20, marginBottom: 14, border: "1px solid #E5E7EB" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Summary</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{EPIC.summary}</p>
          </div>
          <div style={{ background: "#FFF", borderRadius: 8, padding: 20, marginBottom: 14, border: "1px solid #E5E7EB" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Description</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{EPIC.description}</p>
          </div>
          <div style={{ background: "#FFFBEB", borderRadius: 8, padding: 20, marginBottom: 14, border: "1px solid #FDE68A" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 12, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5 }}>💼 Business Value</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#78350F", lineHeight: 1.7 }}>{EPIC.businessValue}</p>
          </div>
          <div style={{ background: "#FFF", borderRadius: 8, padding: 20, border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>✅ Acceptance Criteria</h3>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {acCategories.map(c => (
                  <button key={c} onClick={() => setAcFilter(c)} style={{ padding: "3px 9px", border: "1px solid", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, borderColor: acFilter === c ? "#2563EB" : "#E5E7EB", background: acFilter === c ? "#EFF6FF" : "#FFF", color: acFilter === c ? "#1D4ED8" : "#6B7280" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {filteredAC.map((ac) => <ACRow key={ac.id} ac={ac} idx={EPIC.acceptanceCriteria.indexOf(ac)} />)}
          </div>
        </div>
      )}

      {/* ── STORIES TAB ── */}
      {tab === "stories" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {phases.map(p => {
              const c = PHASE_COLORS[p] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
              const count = EPIC.stories.filter(s => s.phase === p).length;
              const pts = EPIC.stories.filter(s => s.phase === p).reduce((a, s) => a + s.points, 0);
              return (
                <div key={p} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: c.text }}>{p}</span>
                  <span style={{ color: "#6B7280", marginLeft: 6 }}>{count} stories · {pts} pts</span>
                </div>
              );
            })}
          </div>
          {EPIC.stories.map(story => (
            <StoryCard key={story.key} story={story} isOpen={openStory === story.key} onToggle={() => setOpenStory(openStory === story.key ? null : story.key)} />
          ))}
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#1E40AF", fontWeight: 600 }}>Total Story Points</span>
            <span style={{ color: "#1E40AF", fontWeight: 700, fontSize: 16 }}>{totalPoints} pts</span>
          </div>
        </div>
      )}

      {/* ── KPI TAB ── */}
      {tab === "kpis" && (
        <div>
          {/* Group selector */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {KPI_GROUPS.map(g => (
              <button key={g.id} onClick={() => { setKpiGroup(g.id); setOpenKPI(null); }} style={{ flex: 1, padding: "12px 14px", border: `2px solid`, borderRadius: 8, cursor: "pointer", textAlign: "left", borderColor: kpiGroup === g.id ? g.color.heading : "#E5E7EB", background: kpiGroup === g.id ? g.color.bg : "#FFF", transition: "all 0.15s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{g.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: kpiGroup === g.id ? g.color.heading : "#374151" }}>{g.label}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{g.kpis.length} KPIs</div>
              </button>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: activeGroup.color.bg, border: `1px solid ${activeGroup.color.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13.5, color: activeGroup.color.heading, lineHeight: 1.6 }}>{activeGroup.description}</p>
          </div>

          {/* KPI cards */}
          {activeGroup.kpis.map(kpi => (
            <KPICard key={kpi.id} kpi={kpi} color={activeGroup.color} isOpen={openKPI === kpi.id} onToggle={() => setOpenKPI(openKPI === kpi.id ? null : kpi.id)} />
          ))}

          {/* Summary row */}
          <div style={{ marginTop: 16, background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 16 }}>
            <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>KPI Coverage by Category</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[...new Set([...KPI_GROUPS[0].kpis, ...KPI_GROUPS[1].kpis].map(k => k.category))].map(cat => {
                const c = KPI_CATEGORY_COLORS[cat] || { bg: "#F3F4F6", text: "#374151" };
                const count = [...KPI_GROUPS[0].kpis, ...KPI_GROUPS[1].kpis].filter(k => k.category === cat).length;
                return <Badge key={cat} label={`${cat} ×${count}`} style={{ background: c.bg, color: c.text, fontSize: 12 }} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
