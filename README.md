# claude-hud-bedrock

A fork of [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) that adds **real-time cost tracking** to the Claude Code statusline — powered by [ccusage](https://github.com/ryoppippi/ccusage).

```
[Sonnet | Bedrock] │ my-project git:(main)
Context ████░░░░░░ 38% │ Usage ██░░░░░░░░ 18%
$13.78 / $1338.01
```

The last line shows **today's cost / this month's cumulative cost**, updated every 30 seconds.

## Requirements

- [Claude Code](https://claude.ai/code) v1.0.80+
- Node.js 18+
- [ccusage](https://github.com/ryoppippi/ccusage) (via `bunx` — no install needed)
- [Bun](https://bun.sh) (for `bunx`)

## Setup

**1. Clone and build**

```bash
git clone https://github.com/nina-oh/claude-hud-bedrock.git
cd claude-hud-bedrock
npm install
npm run build
```

**2. Add to Claude Code settings**

Add this to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node /absolute/path/to/claude-hud-bedrock/dist/index.js"
  }
}
```

If you have the original `claude-hud` plugin enabled, disable it to avoid conflicts:

```json
{
  "enabledPlugins": {
    "claude-hud@claude-hud": false
  }
}
```

**3. Restart Claude Code**

The statusline will appear immediately. If `ccusage` has no data yet, the cost line is silently omitted.

## How it works

- On each statusline update, `getDailyCostData()` reads from an in-memory cache (TTL: 30s)
- On cache miss, runs `bunx ccusage daily --json` to get today's cost and month total
- If `ccusage` is unavailable or times out, falls back to the last cached value silently
- All other claude-hud elements (context bar, usage bar, git, tools, agents, todos) are unchanged

## Configuration

All original claude-hud config options work as-is. One new flag is available in `~/.claude/plugins/claude-hud/config.json`:

```json
{
  "display": {
    "showDailyCost": true
  }
}
```

Set to `false` to hide the cost line.

## Credits

- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — original statusline HUD
- [hanoseok/McDuck](https://github.com/hanoseok/McDuck) — inspiration for ccusage-based cost tracking
- [ryoppippi/ccusage](https://github.com/ryoppippi/ccusage) — Claude Code usage CLI

## License

MIT — see [LICENSE](./LICENSE)
