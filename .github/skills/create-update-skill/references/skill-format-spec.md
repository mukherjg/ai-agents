# GitHub Copilot Agent Skill format (reference)

Source of truth: GitHub's own docs ("Adding agent skills for GitHub Copilot",
"About agent skills") and the `github/awesome-copilot` skills gallery. This
file is a condensed reference for authoring skills in this repo — consult it
before writing or editing a `SKILL.md`.

## Directory layout

Project skills live in one of these repo-root directories (first match wins,
this repo uses `.github/skills`):

```
.github/skills/<skill-name>/
├── SKILL.md          # required
├── references/        # optional — markdown docs, lookup tables, specs
├── scripts/            # optional — executable helpers the agent may run
└── assets/            # optional — templates, sample files, icons
```

- One subdirectory per skill, named in kebab-case, matching `name:` in the
  frontmatter.
- Everything in the skill's directory is discoverable by the agent once the
  skill is activated — put bulky or rarely-needed material in `references/`
  instead of inlining it in `SKILL.md`, so the base context injection stays
  small.
- `scripts/` holds runnable utilities (Python, shell, Node, …) the agent can
  invoke directly rather than re-deriving logic in-context.

## SKILL.md frontmatter

YAML frontmatter at the top of the file:

```yaml
---
name: skill-name
description: >
  What the skill does and when Copilot should reach for it, phrased with
  concrete trigger language ("use when asked to X", "trigger for prompts
  like 'Y'").
license: MIT   # optional
---
```

- `name` (required): lowercase, hyphen-separated, must match the directory
  name.
- `description` (required): the single signal Copilot uses to decide
  whether to load the skill, so it must state both *what* the skill does and
  *when* to use it — vague descriptions cause the skill to never fire or to
  fire on unrelated prompts. Include a few literal trigger phrases users
  might type.
- `license` (optional): only needed if the skill is redistributed outside
  this repo.

## SKILL.md body

- Markdown, no fixed schema, but the effective pattern seen across
  high-quality skills is:
  1. One-paragraph restatement of purpose (redundant with `description` is
     fine — the agent may only skim frontmatter first).
  2. Ordered steps for the workflow the skill governs.
  3. Explicit "do not use for …" / out-of-scope notes to prevent
     misapplication.
  4. Pointers to `references/*.md` or `scripts/*` for anything detailed,
     rather than inlining it.
- Keep it concise. Skills are injected wholesale into the agent's context
  when activated — treat every paragraph as a token cost paid on every
  invocation.

## Activation model

Copilot decides whether to use a skill by matching the current prompt
against every discovered `SKILL.md`'s `name` + `description`. There is no
explicit invocation syntax the user has to type; a specific enough
`description` is what makes activation reliable. This is why the
description is the highest-leverage field to get right when creating or
updating a skill.

## Skills vs. custom instructions vs. prompt files

- **Custom instructions** (`.github/copilot-instructions.md`): always-on,
  short, applies to virtually every task in the repo (coding standards,
  house style).
- **Skills** (`.github/skills/*/SKILL.md`): loaded on demand, for detailed,
  task-specific workflows — this is what `create-update-skill` produces.
- **Prompt files** (`.github/prompts/*.prompt.md`): user-invoked, one-off
  slash-command-style prompts, not agent-discovered.

Use a skill (not a prompt file or custom instruction) when the task is
detailed enough to need its own workflow but shouldn't cost context on every
single prompt.
