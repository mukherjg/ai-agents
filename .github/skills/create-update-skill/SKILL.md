---
name: create-update-skill
description: >
  Use this skill to author a new GitHub Copilot agent skill or update an
  existing one in this repo's .github/skills registry, given a prompt
  describing the desired behavior and any reference material (docs, URLs,
  existing files, examples). Trigger for requests like "create a skill
  for X", "add a Copilot skill that does Y", "update the <name> skill to
  also handle Z", or "turn this into a skill".
license: MIT
---

# Create/Update Skill

Meta-skill for authoring other `.github/skills/*/SKILL.md` files in this
repo. Read `references/skill-format-spec.md` first — it is the canonical
summary of GitHub's skill format (directory layout, required frontmatter,
activation model) that every skill produced here must satisfy.

## Inputs to gather before writing anything

1. **Prompt** — what should the skill do, and in response to what kind of
   request should Copilot activate it?
2. **References** (optional) — URLs, existing docs, code samples, or files
   the user points at. These inform the skill's instructions; they are not
   pasted in verbatim unless small enough to be directly useful.
3. **Target name** — derive a kebab-case name from the prompt if the user
   didn't give one (e.g. "a skill that reviews Terraform for CIS
   compliance" → `terraform-cis-review`).

## Decide: create or update

Check whether `.github/skills/<name>/SKILL.md` already exists.

- **Exists → update.** Read the current `SKILL.md` and any
  `references/`/`scripts/`/`assets/` in full before changing anything.
  Preserve the existing structure and trigger phrases unless the prompt
  explicitly asks to change them — an update should read as an incremental
  diff, not a rewrite. If the change is substantial, note it briefly at the
  top of the body (e.g. "Updated to also cover …") only if the skill already
  used that convention; don't invent a changelog format that isn't there.
- **Doesn't exist → create.** Scaffold the directory:
  ```
  .github/skills/<name>/
  ├── SKILL.md
  ├── references/   # only if there's material too long for the body
  ├── scripts/      # only if a runnable helper is genuinely needed
  └── assets/       # only if templates/samples are genuinely needed
  ```
  Don't create empty placeholder subdirectories — only add `references/`,
  `scripts/`, or `assets/` when there's real content for them.

## Writing the frontmatter

- `name`: kebab-case, must equal the directory name.
- `description`: the single field Copilot uses to decide whether to load
  the skill. State *what it does* and *when to use it*, and include a
  couple of literal phrases a user might type. Weak, generic descriptions
  are the most common reason a new skill never activates — don't write one.
- `license`: omit unless the skill is meant to be shared/redistributed
  outside this repo.

## Writing the body

- Open with a one-paragraph restatement of purpose.
- Give the agent an ordered workflow, not prose background — it should be
  able to follow the body as steps.
- Add explicit out-of-scope / "do not use for" notes when the skill's
  boundary could be confused with another skill's.
- Push anything long (schemas, full API references, multi-page examples)
  into `references/*.md` and link to it instead of inlining it — every
  paragraph in `SKILL.md` itself is a token cost paid on every activation.
- If the user supplied reference material, synthesize it into instructions
  and, where it's genuinely a lookup table or spec the agent will need
  verbatim, save it into `references/` rather than summarizing it away.

## Validate before finishing

Run the bundled validator against the skill you just created or updated:

```
python3 .github/skills/create-update-skill/scripts/validate_skill.py .github/skills/<name>
```

Fix anything it reports as `error:`; treat `warning:` lines as judgment
calls (e.g. a short description may be fine for a narrow skill). Do not
report the task done while the validator is failing.

## Out of scope

- Custom instructions (`.github/copilot-instructions.md`) — always-on,
  repo-wide guidance. Don't route "make Copilot always follow X" requests
  here; that's a custom instruction, not a skill.
- Prompt files (`.github/prompts/*.prompt.md`) — user-invoked one-off
  prompts. Don't route those requests here either.
- This skill only manages skills under `.github/skills/`. If asked to
  create a skill for another agent surface (e.g. Claude Code's
  `.claude/skills/`), say so explicitly rather than silently writing to the
  wrong directory.
