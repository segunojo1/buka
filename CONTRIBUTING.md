# Contributing to Buka

Thank you for your interest in contributing! We welcome bug reports, features, docs, and tests.

## Getting Started
- Fork and clone the repo
- Install deps: `pnpm install`
- Create `.env.local` (see README)
- Run dev server: `pnpm dev`

## Branching
- Base: `main`
- Feature: `feat/<short-name>`
- Fix: `fix/<short-name>`
- Docs: `docs/<short-name>`

## Commits
Use conventional commits:
- `feat: add nearby filter`
- `fix: clustering of markers`
- `docs: improve README`

## Pull Requests
- Keep PRs focused; include tests where reasonable
- Describe changes, rationale, screenshots (if UI)
- Link related issues
- Pass lint/build checks

## Code Style
- TypeScript, React (App Router)
- Tailwind CSS for styling
- Keep components accessible and responsive

## Running Tests
Add your testing strategy here if you introduce tests.

## Reporting Issues
Open a GitHub issue with:
- Expected vs actual
- Steps to reproduce
- Environment info (OS, browser, Node)
- Screenshots/logs when helpful
