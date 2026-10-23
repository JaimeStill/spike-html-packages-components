# spike-html-packages-components

The components layer of [spike-html-packages](https://github.com/JaimeStill/spike-html-packages):
the status badge, the entry, and the pagination, Lit with shadow roots, and their sheets. It is ES
modules with their type declarations and stylesheets, built on the foundation's v0.1.0 tag, and is
released by git tag.

## Install

Each release is a tag, `v<version>`, whose tree is the package as `pnpm pack` builds it:
`package.json`, this README, the LICENSE, and `dist/`. It depends on lit 3.3.3 and on
[the foundation](https://github.com/JaimeStill/spike-html-packages-foundation) by its tag,
`github:JaimeStill/spike-html-packages-foundation#v0.1.0`: a git dependency below the top level,
which npm and pnpm each refuse unless a guard allows it. Install it by the tag:

```
npm install --allow-git=all github:JaimeStill/spike-html-packages-components#v0.1.0
pnpm add --config.block-exotic-subdeps=false github:JaimeStill/spike-html-packages-components#v0.1.0
bun add github:JaimeStill/spike-html-packages-components#v0.1.0
```

- npm 12 refuses git dependencies unless `--allow-git` allows them; `root` allows only the ones
  the project declares itself, and the foundation is the components' own, so it takes `all`.
- pnpm refuses a git dependency below the top level (`ERR_PNPM_EXOTIC_SUBDEP`) while
  `blockExoticSubdeps` is on; a project turns it off for good with `blockExoticSubdeps: false` in
  its `pnpm-workspace.yaml`.
- bun needs no guard.

Each GitHub release also carries the tarball.

## Use

The package is `@jaimestill/spike-html-packages-components`. Each module defines its element when
it is imported, and the element's shadow root adopts the foundation's reset and elements sheets,
then its own. The modules import `lit` and the foundation by package name and their sheets as CSS
module scripts, so a page reaches them through an import map or a bundler, and links the
foundation's `page.css`:

```html
<link rel="stylesheet" href="node_modules/@jaimestill/spike-html-packages-foundation/dist/page.css" />
<script type="module">
  import "@jaimestill/spike-html-packages-components/status-badge.js";
</script>
<sl-status-badge label="ready"></sl-status-badge>
```

- `./status-badge.js`: `sl-status-badge`, a label; a click dispatches `badge-select`.
- `./entry-lit-shadow.js`: `sl-entry-lit-shadow`, one directory or file of a document hierarchy,
  as a button; it dispatches `open`.
- `./pagination-lit-shadow.js`: `sl-pagination-lit-shadow`, a page of entries between its summary
  and its controls; it dispatches `page-change` and `page-size-change`.
- `./*.css`: each component's sheet, which its module imports itself.

`demo/components.html` is a page on all three, with its import map.

## Development

Tasks run through [mise](https://mise.jdx.dev):

```
mise run install    # the pinned tools, and node_modules with the foundation at its tag; reads the network
mise run check      # lint, types, build, and the unit and browser tiers; reads no network
mise run build      # src/ into dist/
mise run demo       # serve the components demo page on dist/
mise run currency   # report every tool, package, and action pin, and the foundation's tag, behind its latest
```

A push to main whose `package.json` version has no tag yet releases it: the check, then the pack
committed and tagged, and a GitHub release from `CHANGELOG.md`.

## License

[Apache License 2.0](LICENSE).
