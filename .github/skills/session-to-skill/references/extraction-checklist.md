# Extraction checklist: the six ingredients

Work through each row. "Generalize to" is the default move; "Keep as-is" is
the exception, used only when the value truly won't change across future
runs of the skill (e.g. a fixed API endpoint, a company name).

| # | Ingredient | Look for | Generalize to | Keep as-is when |
|---|-----------|----------|----------------|------------------|
| 1 | Prompts | The user's literal asks across the session | The recurring task shape + 2-3 trigger phrases for `description` | Never — prompts are always paraphrased, not quoted |
| 2 | Memory | CLAUDE.md entries, remembered preferences, prior session notes referenced | A restated convention/preference the skill should follow | The fact is a durable repo/org convention unlikely to change (house style, license) |
| 3 | Results | Computed numbers, generated files, PR/issue links, report conclusions | A command or instruction that recomputes the value ("run `X` to get the current count") | The result is a fixed artifact the skill is meant to reproduce byte-for-byte (a template, a fixed schema) |
| 4 | Scripts | Ad hoc shell/Python/etc. run during the session | A named, parameterized file under `scripts/`, with args instead of hard-coded values | The script only ever makes sense with the exact one-off inputs from this session (rare — usually still worth parameterizing) |
| 5 | Reference docs | Docs, specs, URLs the session consulted | A link, or a copied excerpt in `references/` if small and load-bearing | The doc is huge and only tangentially relevant — link instead of copying |
| 6 | Skills used | Other skills invoked mid-session | A composition note ("hands off to `<skill>` for X") | Never copy another skill's body in — always compose by reference |

## Frozen-output smell test

Before finalizing, grep the draft `SKILL.md` and any `references/*.md` for:
- Specific dates, counts, or IDs that read as answers rather than methods.
- Named people, PR numbers, or filenames that were incidental to *this*
  session rather than structural to the task.
- Sentences phrased as past-tense conclusions ("we found 47 items") instead
  of present-tense instructions ("run this to find the items").

Any hit is a candidate to rewrite as a command, query, or placeholder.
