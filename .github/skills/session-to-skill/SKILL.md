---
name: session-to-skill
description: >
  Use this skill when asked to turn a past or current session into a reusable
  Copilot skill — trigger phrases like "turn this into a skill", "turn this
  session into a skill", "make this repeatable", "create a skill from what we
  just did", or "save this as a skill for next time". It mines a session's six
  ingredients (prompts, memory, results, scripts, reference documents, skills
  used), generalizes the one-off parts, and hands the result to
  create-update-skill to scaffold as a proper `.github/skills/<name>/SKILL.md`
  package. Not for authoring a skill from a plain description someone types
  fresh — that's create-update-skill directly.
license: MIT
---

# Session to Skill

Meta-skill that reverse-engineers a repeatable `SKILL.md` out of a session
that already happened, instead of starting from a description someone writes
up front. The hard part isn't the scaffolding (that's
`create-update-skill`'s job) — it's deciding what from the session is a
generalizable procedure versus a one-off fact that shouldn't be baked in.

## Step 1 — Identify the session to mine

The "session" can be:
- The current conversation, from the start or from a point the user indicates.
- A past transcript, log file, or exported chat the user points at.
- Just the artifacts a session left behind (a script, a PR, a set of edited
  files) when the conversation itself isn't available.

Ask the user to confirm scope if it's ambiguous which part of a long session
is the reusable procedure versus incidental exploration/dead ends.

## Step 2 — Extract the six ingredients

Work through each one. See `references/extraction-checklist.md` for a fuller
checklist with good/bad examples per ingredient.

1. **Prompts** — the user asks that drove the work. Distill the *recurring
   task shape*, not the literal wording, and pull out concrete trigger
   phrases for the new skill's `description`.
2. **Memory** — durable facts, preferences, or state referenced (CLAUDE.md
   entries, prior session notes, remembered config). Separate what's
   genuinely reusable context (a house style, a repo convention) from what's
   specific to this one session (a person's name, a one-time decision).
3. **Results** — outputs the session produced (files, PR links, computed
   values, report numbers). See the anti-pattern below — this is the
   ingredient most likely to leak stale data into the skill.
4. **Scripts** — any shell/Python/etc. snippets run ad hoc during the
   session. Promote genuinely reusable ones into the new skill's `scripts/`
   as named, parameterized files instead of leaving them as inline
   transcript fragments.
5. **Reference documents** — docs, specs, or URLs consulted along the way.
   Either link to them or, if small and load-bearing, copy the relevant
   excerpt into the new skill's `references/`.
6. **Skills used** — any other skills invoked during the session. Note them
   as dependencies the new skill composes with (e.g. "hands off to
   create-update-skill for scaffolding") — don't copy their content in.

## Step 3 — Generalize

For each ingredient extracted above, replace one-off values — specific
names, dates, counts, file paths, PR numbers — with either a placeholder the
user fills in, or better, a command/instruction that recomputes the value at
skill-run time. This step is the actual point of the skill; skip it and
you've just archived a transcript, not built a skill.

### Anti-pattern: baking in frozen output

Never write a session's answer into the skill as if it's still true:

> Bad: "The current open-PR count is 47."
> Good: "Run `gh pr list --state open | wc -l` to get the current open-PR
> count."

If the session computed a number, built a list, or reached a conclusion
using data that changes over time, the skill should capture the *method*
(the query, the script, the analysis steps), not the *snapshot*. This is
what makes the skill produce up-to-date results on every future run instead
of parroting stale ones.

## Step 4 — Name it and decide create vs. update

Derive a kebab-case name from the generalized task (not from the literal
session topic). Check whether `.github/skills/<name>/SKILL.md` already
exists to decide create vs. update, same as `create-update-skill` does.

## Step 5 — Scaffold via create-update-skill's rules

Don't reinvent the frontmatter/layout rules here — follow
`.github/skills/create-update-skill/references/skill-format-spec.md`
exactly (required `name`/`description` fields, `references/` /`scripts/`
/`assets/` layout, description-is-the-activation-signal principle). Only
add subdirectories for ingredients that actually produced reusable content
— e.g. no `scripts/` folder if step 2 found no script worth promoting.

## Step 6 — Validate

Run the same validator `create-update-skill` uses, since it already checks
everything this skill's output needs to satisfy:

```
python3 .github/skills/create-update-skill/scripts/validate_skill.py .github/skills/<name>
```

Fix `error:` lines before reporting done; use judgment on `warning:` lines.

## Step 7 — Show what changed

Summarize, per ingredient, what was generalized and what was deliberately
left out (e.g. "left out the specific PR number from step 2; the skill now
re-queries it"). This lets the user catch a case where you generalized
something that should have stayed a hard-coded fact, or vice versa.

## Out of scope

- Authoring a skill from a plain description with no session to mine — use
  `create-update-skill` directly.
- Saving a single script verbatim with no generalization — that's just
  copying a file, not building a skill.
- Custom instructions or prompt files — see the "Skills vs. custom
  instructions vs. prompt files" section in
  `create-update-skill`'s format spec for the boundary.
