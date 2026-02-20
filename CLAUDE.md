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
