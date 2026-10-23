# spike-html-packages-components

spike-html-packages-components is the components layer of
[spike-html-packages](https://github.com/JaimeStill/spike-html-packages): the status badge, the
entry, and the pagination, Lit with shadow roots, and their sheets. It is built on the
foundation's v0.1.0 tag as a consumer installs it, and released by tag, as the Go workspace's
repositories are.
This context records only working knowledge the code and the README do not express.

## Capability map

The README lists the subpaths; the sources and their doc comments are authoritative for the API.

- **status badge**: `status-badge.ts` and `status-badge.css`.
- **entry**: `entry-lit-shadow.ts` and `entry-shadow.css`.
- **pagination**: `pagination-lit-shadow.ts` and `pagination-shadow.css`, which holds entries in its slot.
- Each shadow root adopts the installed foundation's `baseline/reset.css` and
  `baseline/elements.css`, then its own sheet; the elements are defined through the foundation's
  `dom.js`.

## Layout

- `src/`: the sources, the only home of the layer's code; `mise run build` writes `dist/`, which
  main never holds.
- `test/unit/`: the lint over `layers-tree.js`'s tree, and `release.js`'s checks on a `pnpm pack`
  of `dist/`.
- `test/browser/`: `node --test` on `dist/` in the pinned chrome-headless-shell; `support/` holds
  the pipe driver, the static server, the probe, and the restyle case. The server's `/deps/`
  serves lit's packages from lit's pnpm store directory and the foundation from `node_modules/`,
  since pnpm keeps lit's own dependencies out of the top-level `node_modules/`.
- `test/fixtures/`: the components page the cases load.
- `demo/`: the components page, on `dist/`, and `documents.js`, its fixture and the probe's.
- `scripts/`: one script per task that needs more than one command.

## Tasks

- `mise run install`: the pins and node_modules; pnpm fetches the foundation's tag from GitHub,
  and the lockfile records the tag's commit. A github: dependency at the top level needs no pnpm
  guard; only a consumer of the components, where the foundation sits below the top level, does.
- `mise run check`: `lint` (ESLint, Prettier, shellcheck, and actionlint), `types` (typescript-go,
  on the sources and on the browser cases' in-page modules against `dist/`), `build`,
  `test:unit`, and `test:browser`; reads no network once `mise run install` has run, and writes
  only `dist/`.
- `mise run demo`: the demo page, on a fresh build.
- `mise run currency`: reads the network, so CI never runs it. It checks the foundation's github:
  tag against the foundation's latest GitHub release.

## Releases

`release.yml` cuts `v<version>` on a push to main when `package.json`'s version has no tag on the
remote; its header comment lists the steps. A version bump, with its changelog section, is what
releases, and a push that bumps nothing ends green. A new foundation release reaches the
components only by a bump of the github: tag in `package.json`.
