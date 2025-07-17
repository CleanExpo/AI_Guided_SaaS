# Project-Specific Danger Mode

**🏗️ Toggle `--dangerously-skip-permissions` for this project only**

This command enables or disables danger mode specifically for the current project without affecting your global Claude Code settings. Perfect for project-specific automation needs.

## What This Does

- Creates/updates `.claude/settings.local.json` in current project
- Project settings override global settings
- Enables danger mode only when working in this project
- Leaves global settings unchanged

## Usage

`/danger-project [on|off]` - Toggle project-specific danger mode

## Examples

- `/danger-project on` - Enable for this project
- `/danger-project off` - Disable for this project
- `/danger-project` - Show current project status

## Safety Features

- ✅ Project isolation - doesn't affect other projects
- ✅ Automatic backup of project settings
- ✅ Comprehensive logging
- ✅ Global settings remain unchanged

## Project vs Global Settings

- **Global**: Affects all Claude commands everywhere
- **Project**: Only affects commands in this specific project
- **Priority**: Project settings override global settings
- **Isolation**: Each project can have different settings

## When to Use

- Project requires frequent automated operations
- Different safety requirements per project
- Testing danger mode on specific projects
- Collaborative projects with team consensus
- CI/CD pipelines for specific projects

---

**Managing project-specific danger mode...**

Current project: `/mnt/d/AI Guided SaaS`

Please run: `node /mnt/d/AI\ Guided\ SaaS/scripts/danger-project.js $ARGUMENTS`

**Arguments**: $ARGUMENTS