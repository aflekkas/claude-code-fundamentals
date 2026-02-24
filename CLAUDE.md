# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `bun run dev` (Next.js dev server)
- **Build:** `bun run build`
- **Start production:** `bun run start`
- **Lint:** `bun run lint`
- **Lint with auto-fix:** `bun run lint:fix`

Package manager is **bun** (see `bun.lock`).

## Architecture

This is a Next.js 16 app using the App Router with React 19, TypeScript, and Tailwind CSS v4.

- `app/` — App Router pages and layouts (no `src/` directory; code lives at the project root)
- `app/layout.tsx` — Root layout with Geist font configuration
- `app/page.tsx` — Home page
- `app/globals.css` — Global styles (Tailwind v4 import)
- `public/` — Static assets

### Key details

- Tailwind CSS v4 is configured via `@tailwindcss/postcss` (PostCSS plugin, not the older `tailwind.config.js` approach)
- TypeScript path alias `@/*` maps to `./src/*` (defined in `tsconfig.json`)
- ESLint uses flat config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`

## Notion Task Tracking (MANDATORY)

A Notion MCP server is connected to this project. **Whenever you work on a task that originates from Notion, you MUST comment on it to maintain a record of work.** This is non-negotiable.

### Workflow

1. **Starting work** — When you begin working on a Notion task, add a page-level comment noting that work has started and what approach you plan to take.
2. **During work** — Comment with meaningful progress updates (e.g., files changed, decisions made, blockers encountered).
3. **Completing work** — Add a final comment summarizing what was done, files modified, and any follow-up items.

### How to comment on a Notion task

Use `mcp__notion__notion-create-comment` with the task's `page_id`:

```
page_id: "<page-uuid>"
rich_text: [{ "text": { "content": "Your comment here" } }]
```

To comment on specific content within a page, also provide `selection_with_ellipsis` with ~10 chars from the start and end of the target text (e.g., `"# Section Ti...tle content"`).

To reply to an existing discussion thread, include `discussion_id`.

### How to read comments on a task

Use `mcp__notion__notion-get-comments` with the task's `page_id`. Set `include_all_blocks: true` to see comments on child blocks as well.

### Key rules

- **Always** comment when starting, progressing on, and completing a Notion task
- Keep comments concise but informative — future you (and teammates) should understand what happened
- If a task is blocked or deferred, comment explaining why before moving on
