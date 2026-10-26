# Changelog

All notable changes to `@jaimestill/spike-html-packages-components` are documented here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the package adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.2.0] - 2026-10-26

### Changed

- The foundation is a peer dependency at `^0.1.0`, no longer a dependency by its tag: a consumer
  now declares the foundation beside the components (breaking), and the one copy serves both, from
  the tag, the release tarball, or GitHub Packages. lit 3.3.3 is the one dependency.

## [v0.1.0] - 2026-10-23

### Added

- The components layer, moved from spike-html-packages (c2b4a19): the status badge, the entry, and
  the pagination, Lit with shadow roots, each adopting the foundation's reset and elements sheets,
  then its own.
- The dependencies: lit 3.3.3, and the foundation by its release tag,
  `github:JaimeStill/spike-html-packages-foundation#v0.1.0`.
- The release by tag: `v<version>`, whose tree is the pack, with the tarball on its GitHub
  release.

[Unreleased]: https://github.com/JaimeStill/spike-html-packages-components/compare/v0.2.0...HEAD
[v0.2.0]: https://github.com/JaimeStill/spike-html-packages-components/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/JaimeStill/spike-html-packages-components/releases/tag/v0.1.0
