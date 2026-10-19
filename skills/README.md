# Gebeta Maps agent skills

Skills that teach AI coding agents (Claude Code, Codex, Cursor, Copilot, …) to build with the
Gebeta Maps SDK quickly and correctly. Format follows the open `SKILL.md` convention used by
[maplibre-agent-skills](https://github.com/maplibre/maplibre-agent-skills): one folder per
skill, YAML front matter (`name`, `description`) and optional `references/` loaded on demand.

| Skill                 | Use when                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `gebeta-maps`         | Adding a Gebeta map, auth (backend token exchange), geocoding, directions, navigation, clustering, geofencing; React/CDN/Node setup; debugging blank maps / 401s / "not initialized"       |
| `gebeta-maps-recipes` | Any map feature on a Gebeta map (the whole map-examples gallery) — camera, sources, layers, expressions, heatmaps, clusters, 3D, terrain, markers, popups, Amharic labels, events, plugins |

Generated code uses **only Gebeta names**: `@gebeta/*` packages, the `gebeta` namespace
(`gebeta.Marker`, `gebeta.Popup`, controls…) and `sdk.addMarker` / `sdk.addPopup`. These need
`@gebeta/js` / `@gebeta/react` newer than 3.0.12.

Content is verified against the SDK source and the live Gebeta styles, and it calls out where
the old public docs were out of date.

## Install

### Any agent (skills CLI)

```bash
npx skills add AfriGebeta/Gebeta-SDK-JS                 # pick agents interactively
npx skills add AfriGebeta/Gebeta-SDK-JS -a claude-code  # Claude Code
npx skills add AfriGebeta/Gebeta-SDK-JS -a codex        # OpenAI Codex
npx skills add AfriGebeta/Gebeta-SDK-JS -a cursor       # Cursor
npx skills add AfriGebeta/Gebeta-SDK-JS --skill gebeta-maps -g   # one skill, globally
```

### Claude Code (manual)

```bash
# project-level (commit it so your team gets it)
mkdir -p .claude/skills && cp -r path/to/Gebeta-SDK-JS/skills/gebeta-* .claude/skills/
# or user-level
cp -r path/to/Gebeta-SDK-JS/skills/gebeta-* ~/.claude/skills/
```

### Codex (manual)

```bash
mkdir -p ~/.codex/skills && cp -r path/to/Gebeta-SDK-JS/skills/gebeta-* ~/.codex/skills/
```

### Other assistants

Paste `gebeta-maps/SKILL.md` (and the relevant `references/*.md`) into the chat or your rules
file (`.cursor/rules/`, `.github/copilot-instructions.md`, `AGENTS.md`).

## Try it

Ask your agent, e.g.:

- "Add a Gebeta map to this React app with a search box and route between two places."
- "Show our delivery zones as geofences and alert when a driver leaves one."
- "Make the map 3D with terrain and extruded buildings around Meskel Square."
- "Switch the map labels to Amharic."

## Contributing

- Verify every API claim against `packages/*/src` — not just `docs/`.
- Keep `SKILL.md` short (rules + index); put long recipes in `references/`.
- Keep user-facing code Gebeta-only (no `maplibregl` / `maplibre-gl` imports).
- When the SDK upgrades its map engine, revisit the **v5+** markers in
  `gebeta-maps-recipes/SKILL.md`.
