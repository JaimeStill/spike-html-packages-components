#!/usr/bin/env bash
# Fails naming mise run install when a tool a task needs is missing: the node_modules tooling, and
# the dependencies the build reads, lit and the foundation at its tag.
# Adapted from spike-html-packages-foundation (5dd8a58): scripts/preflight.sh, with lit and the
# foundation, as spike-html-packages (c2b4a19) checked lit, and without the browser tier.
set -euo pipefail

fail() {
  echo "preflight: $1 isn't installed; run mise run install" >&2
  exit 1
}

for bin in eslint prettier; do
  [[ -x node_modules/.bin/$bin ]] || fail "$bin (devDependencies)"
done
for package in lit @jaimestill/spike-html-packages-foundation; do
  [[ -f node_modules/$package/package.json ]] || fail "$package (dependencies)"
done
