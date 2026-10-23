// The release's integrity: a pnpm pack of the build, extracted, against package.json's files and
// exports, its license, and its dependencies, by release.js's releaseProblems, as it stands and in
// scratch copies with one fault each. It packs the dist/ that mise run build writes.
// Adapted from spike-html-packages-foundation (5dd8a58): test/unit/release.test.js, on the
// components' pack, with the dependencies' faults.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { listFiles, releaseProblems } from "./release.js";

const root = join(import.meta.dirname, "../..");
const src = join(root, "src");
const scratches = [];

/** A new temporary directory, removed after the run. */
function scratchDir() {
  const scratch = mkdtempSync(join(tmpdir(), "release-"));
  scratches.push(scratch);
  return scratch;
}

// The pack under test: pnpm pack's tarball, extracted, its package/ directory.
let pack;
before(() => {
  const scratch = scratchDir();
  execFileSync("pnpm", ["pack", "--pack-destination", scratch], { cwd: root, stdio: "ignore" });
  const [tarball] = listFiles(scratch);
  execFileSync("tar", ["-xzf", join(scratch, tarball), "-C", scratch]);
  pack = join(scratch, "package");
});
after(() => {
  for (const scratch of scratches) rmSync(scratch, { recursive: true, force: true });
});

/** A scratch copy of the pack, `change` applied to it and its manifest, and its problems. */
function faulted(change) {
  const copy = join(scratchDir(), "package");
  cpSync(pack, copy, { recursive: true });
  const manifest = JSON.parse(readFileSync(join(copy, "package.json"), "utf8"));
  change(copy, manifest);
  writeFileSync(join(copy, "package.json"), JSON.stringify(manifest));
  return releaseProblems(copy, src);
}

const remove = (path) => (dir) => rmSync(join(dir, path));

describe("release pack", () => {
  test("the pack is package.json, README.md, LICENSE, and the build", () => {
    const built = listFiles(join(root, "dist")).map((path) => `dist/${path}`);
    assert.ok(built.length > 0, "mise run build wrote no dist/");
    assert.deepEqual(listFiles(pack), [...built, "LICENSE", "README.md", "package.json"].sort());
  });

  test("the pack is the release that files and exports declare", () => {
    assert.deepEqual(releaseProblems(pack, src), []);
  });

  test("the pack keeps the dependencies package.json declares, as written", () => {
    const packed = JSON.parse(readFileSync(join(pack, "package.json"), "utf8"));
    const source = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    assert.deepEqual(packed.dependencies, source.dependencies);
  });

  const foundation = "@jaimestill/spike-html-packages-foundation";
  const github = "github:JaimeStill/spike-html-packages-foundation";
  const faults = {
    "a source .css with no built copy": [
      remove("dist/status-badge.css"),
      "src/status-badge.css has no built dist/status-badge.css",
    ],
    "a .ts module with no emitted .js": [
      remove("dist/entry-lit-shadow.js"),
      "src/entry-lit-shadow.ts has no built dist/entry-lit-shadow.js",
    ],
    "a .ts module with no emitted .d.ts": [
      remove("dist/pagination-lit-shadow.d.ts"),
      "src/pagination-lit-shadow.ts has no built dist/pagination-lit-shadow.d.ts",
    ],
    "a stray built file": [
      (dir) => writeFileSync(join(dir, "dist/old.js"), ""),
      "dist/old.js is built from no source",
    ],
    "a stray file in the pack": [
      (dir) => writeFileSync(join(dir, "notes.md"), ""),
      "notes.md is packed but isn't the build, LICENSE, README.md, package.json",
    ],
    "a pack without its README": [remove("README.md"), "the pack has no README.md"],
    "an export at a missing file": [
      (_, copy) => (copy.exports["./gone.css"] = "./dist/gone.css"),
      'exports["./gone.css"] resolves to ./dist/gone.css, which isn\'t built',
    ],
    "a pattern export whose other condition is missing": [
      (_, copy) => (copy.exports["./*.js"] = { types: "./dist/*.ts", default: "./dist/*.js" }),
      'exports["./status-badge.js"] resolves to ./dist/status-badge.ts, which isn\'t built',
    ],
    "a built file no export reaches": [
      (_, copy) => delete copy.exports["./*.css"],
      "dist/status-badge.css is reachable through no export",
    ],
    "a pattern export that reaches nothing": [
      (_, copy) => (copy.exports["./apps/*.js"] = "./dist/apps/*.js"),
      'exports["./apps/*.js"] reaches no built file',
    ],
    "a pack without its LICENSE": [remove("LICENSE"), "LICENSE is missing"],
    "a LICENSE that isn't Apache 2.0": [
      (dir) => writeFileSync(join(dir, "LICENSE"), "All rights reserved.\n"),
      "LICENSE isn't the Apache License 2.0",
    ],
    "a package that declares another license": [
      (_, copy) => (copy.license = "MIT"),
      "package.json declares license MIT, not Apache-2.0",
    ],
    "a build outside files": [
      (_, copy) => (copy.files = ["dist/status-badge.js"]),
      "dist/entry-lit-shadow.js isn't under package.json's files",
    ],
    "lit by a range": [
      (_, copy) => (copy.dependencies.lit = "^3.3.3"),
      "package.json declares lit ^3.3.3, not an exact pin",
    ],
    "lit by a tag": [
      (_, copy) => (copy.dependencies.lit = "latest"),
      "package.json declares lit latest, not an exact pin",
    ],
    "the foundation by a #semver: range": [
      (_, copy) => (copy.dependencies[foundation] = `${github}#semver:^0.1.0`),
      `package.json declares ${foundation} ${github}#semver:^0.1.0, not an exact pin`,
    ],
    "the foundation by a branch": [
      (_, copy) => (copy.dependencies[foundation] = `${github}#main`),
      `package.json declares ${foundation} ${github}#main, not an exact pin`,
    ],
    "the foundation by a commit": [
      (_, copy) => (copy.dependencies[foundation] = `${github}#29d16c0`),
      `package.json declares ${foundation} ${github}#29d16c0, not an exact pin`,
    ],
    "the foundation by its default branch": [
      (_, copy) => (copy.dependencies[foundation] = github),
      `package.json declares ${foundation} ${github}, not an exact pin`,
    ],
    "the foundation from the registry": [
      (_, copy) => (copy.dependencies[foundation] = "0.1.0"),
      `package.json declares ${foundation} 0.1.0, not an exact pin`,
    ],
    "the foundation by a local path": [
      (_, copy) => (copy.dependencies[foundation] = "link:../spike-html-packages-foundation"),
      `package.json declares ${foundation} link:../spike-html-packages-foundation, not an exact pin`,
    ],
    "a missing dependency": [
      (_, copy) => delete copy.dependencies.lit,
      "package.json doesn't declare lit",
    ],
    "no dependencies": [
      (_, copy) => delete copy.dependencies,
      `package.json doesn't declare ${foundation}`,
    ],
    "an undeclared extra dependency": [
      (_, copy) => (copy.dependencies["lit-html"] = "3.3.3"),
      "package.json declares lit-html, which no release needs",
    ],
  };
  for (const [fault, [change, problem]] of Object.entries(faults)) {
    test(`fails on ${fault}`, () => {
      const problems = faulted(change);
      assert.ok(problems.includes(problem), `expected: ${problem}\ngot: ${problems.join("\n")}`);
    });
  }
});
