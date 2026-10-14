# AGENTS.md

## Repo snapshot

Angular 22 SSR application (`App_uno`), single npm package, no monorepo/workspaces. Source under `src/`; build output `dist/App_uno`.

## Commands

- Install: `npm ci` (lockfile present; `packageManager` is npm@11.12.1)
- Dev server: `npm start` → http://localhost:4200/ (development config, HMR)
- Build: `npm run build` (production by default) → `dist/App_uno` (browser + SSR server bundles; prerenders routes)
- Continuous dev build: `npm run watch`
- Serve built app: `npm run serve:ssr:App_uno` (requires prior build)
- Tests: `npm test` starts Vitest in watch mode in a TTY. For non-interactive runs use `npm test -- --watch=false`
  - Filter by name: `npm test -- --watch=false --filter='pattern'`
  - Filter by file (paths relative to `src/`): `npm test -- --watch=false --include app/app.spec.ts`
  - Coverage: `npm test -- --watch=false --coverage`
- Typecheck: `npx tsc --noEmit -p tsconfig.app.json` (source); `npx tsc --noEmit -p tsconfig.spec.json` (tests)
- Format: `npx prettier --write <files>` (config in `.prettierrc`; no lint or format scripts exist)

## Architecture

- Standalone bootstrap via `bootstrapApplication` in `main.ts` (browser) and `main.server.ts` (SSR).
- SSR config: `angular.json` uses `outputMode: "server"` with `src/server.ts` (Express). Static assets served from `public/`; compiled browser files served from `../browser`. Add API endpoints in `src/server.ts`.
- Config split: `src/app/app.config.ts` (client, `provideClientHydration`) vs `src/app/app.config.server.ts` (merges server rendering + server routes).
- Server routing is in `src/app/app.routes.server.ts`; it currently prerenders every path (`RenderMode.Prerender`).
- Client routes are in `src/app/app.routes.ts` (currently empty).
- Tests use Vitest + jsdom + Angular TestBed; default include is `**/*.spec.ts`; keep specs co-located with source.

## Project structure / conventions

- Organize features as component + service pairs (`componente-servicio`), keeping related component and service together.
- Put shared TypeScript interfaces in an `interfaces/` directory.
- Components must use a separate HTML template file (e.g. `templateUrl: './x.html'`); do not inline large/any templates in the `.ts`.

## Quirks

- `ng test` defaults to watch mode in a TTY; pass `--watch=false` for CI and agent runs.
- TypeScript config is strict (`noImplicitOverride`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, strict injection/input access); generated code must compile under it.
- `.vscode/tasks.json` runs `npm: start` and `npm: test` as background watchers; avoid launching duplicates.