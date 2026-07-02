#!/usr/bin/env python3
"""Validate a Copilot SKILL.md against the frontmatter/layout rules in
references/skill-format-spec.md. No third-party dependencies.

Usage:
    scripts/validate_skill.py .github/skills/<skill-name>
"""
import re
import sys
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.DOTALL)


def parse_frontmatter(text):
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None, text
    raw, body = match.groups()
    fields = {}
    key = None
    for line in raw.splitlines():
        if re.match(r"^[a-zA-Z_][\w-]*:", line):
            key, _, value = line.partition(":")
            fields[key.strip()] = value.strip().strip(">").strip()
        elif key and line.startswith((" ", "\t")):
            fields[key] = (fields[key] + " " + line.strip()).strip()
    return fields, body


def validate(skill_dir: Path):
    errors = []
    warnings = []

    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        return [f"missing {skill_md}"], warnings

    text = skill_md.read_text()
    fields, body = parse_frontmatter(text)
    if fields is None:
        return ["SKILL.md has no --- frontmatter block"], warnings

    name = fields.get("name", "")
    description = fields.get("description", "")

    if not name:
        errors.append("frontmatter missing required field: name")
    elif not NAME_RE.match(name):
        errors.append(f"name '{name}' must be lowercase, hyphen-separated")
    elif name != skill_dir.name:
        errors.append(f"name '{name}' must match directory name '{skill_dir.name}'")

    if not description:
        errors.append("frontmatter missing required field: description")
    elif len(description) < 20:
        warnings.append("description is very short; include what the skill does AND when to use it")
    elif len(description) > 1024:
        warnings.append("description is long; consider trimming to keep context cost low")

    if not body.strip():
        errors.append("SKILL.md body is empty; add workflow instructions")

    return errors, warnings


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2

    skill_dir = Path(argv[1])
    if not skill_dir.is_dir():
        print(f"error: {skill_dir} is not a directory")
        return 2

    errors, warnings = validate(skill_dir)

    for warning in warnings:
        print(f"warning: {warning}")
    for error in errors:
        print(f"error: {error}")

    if errors:
        print(f"FAIL: {skill_dir.name}")
        return 1

    print(f"OK: {skill_dir.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
