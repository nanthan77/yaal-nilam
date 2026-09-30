# Public website release

The website is the Next.js application in `web/`. Firebase Hosting target `main`
publishes `web/out` to `yaalnilam.com` and `yaal-nilam.web.app`. The repository-root
`index.html` is a separate prototype. Preview the actual app from `web/`.

## Preview first

```sh
cd web
npm ci
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Review the homepage, listing search and a real property detail in Tamil and
English on mobile, tablet and desktop. Commit the reviewed website source before
preparing a public release. Preserve unrelated work in the shared checkout.

At the September 30 review, all 11 public Firestore records were confirmed
historical samples with synthetic listing photos. They are excluded from the
public catalog, feeds and export; there are currently zero genuine public
property details to review. Test the honest empty and unavailable states now.
Any development fixture preview must be visibly identified as a sample, and must
not be reported as a real listing or real-property verification.

## Check and prepare

Run these commands from the repository root:

```sh
node scripts/release-web.mjs --dry-run
node scripts/release-web.mjs --prepare
node scripts/release-web.mjs --check-prepared
```

`--dry-run` checks local release guards and lists changed source paths. It installs
nothing, builds nothing and deploys nothing. A blocked release exits with status 1.
`--prepare` is also the default mode. It:

1. Checks the repository, expected branch and committed redesign baseline.
2. Verifies the `yaal-nilam` Firebase project, public target, export directory and
   dynamic property rewrite.
3. Requires committed `web/`, `shared/units.ts`, `shared/currency.ts`, Firebase
   configuration and release-script source. The two shared modules are loaded by
   the website data tests; unrelated shared types/geospatial work is outside the
   website release scope. Unrelated dirty dashboard, functions and other work may remain.
4. Runs `npm ci --include=dev` in `web/`, validates the public Firebase project,
   and rejects fixture/emulator settings without printing their values.
5. Runs data tests, lint and the complete production export, including sitemaps.
6. Checks canonical domains, required export files and source stability, then
   writes the commit, build identifier and homepage hash to `web/out/release.json`.

The output receipt is generated, ignored build output; no credentials or customer
details are added. It becomes a public release receipt only when deployed.
Generated `web/tsconfig.tsbuildinfo`, sitemap files, feeds and `robots.txt` are
excluded from source cleanliness checks because the production build regenerates
them. Dependency directories, Next.js/output directories and test artifacts are also
excluded, including local symlinks that Git may otherwise show as untracked.
Never stage those artifacts. The wrapper never resets or discards source changes.

`--check-prepared` performs read-only checks of the current clean source and
existing receipt. It checks repository, branch, commit and Hosting target, a build
time within the last 24 hours, the build identifier, exported homepage hash and
HTML file count. It installs nothing and does not rebuild. Public Hosting's
predeploy hook uses this mode, so a direct Firebase deployment also refuses stale
or unidentified output. Run `--prepare` again if it refuses the export.

If `web/node_modules` is a local symlink, the wrapper resolves its target and
requires the target directory's parent to contain byte-for-byte matching copies
of `web/package.json` and `web/package-lock.json`. It runs `npm ci` in that matching
cache, retaining the website symlink, and runs tests, lint and builds against the
actual source in `web/`. An unavailable link, missing manifest or lockfile mismatch
stops before installation. No cache path is hardcoded.

Property and image sitemap children may be empty when the catalog has no real
public listings. The sitemap index and core sitemap must still contain canonical
URLs. Never add sample properties just to fill a feed or sitemap.

Commit the freshly generated tracked `web/public/sitemap*.xml`, `feed.xml`,
`rss.xml` and `robots.txt` from the reviewed build, including empty property/image
sitemaps and empty feeds. That keeps Git's public snapshots free of historical
sample inventory. Each release rebuilds them from current public records; they
remain excluded from source cleanliness checks because fresh data can change them
after a committed build. Do not commit `web/out`, dependency links or build caches.

The default branch guard is `codex/yaal-nilam-editorial-redesign-20260926`.
After the reviewed redesign is merged, `--branch main` permits a release from
`main` only if it contains the committed redesign baseline. Today's older `main`
cannot satisfy that guard. Other branch names and detached HEAD are refused.

## Publish the reviewed version

After local preview review and an explicit release request, use:

```sh
node scripts/release-web.mjs --deploy
```

This repeats preparation, confirms access to the expected Hosting site, and runs
only `firebase deploy --only hosting:main --project yaal-nilam`. Its release message
records the source commit and build identifier. Backend functions, rules, storage
and admin Hosting are outside this command's scope.

The wrapper compares the live homepage, listing page, property shell and release
receipt with the export on both public hosts. A failed post-release check exits
with status 1 after publication; inspect the provider release before taking any
further action. There is no automatic rollback, PR merge or branch deletion.

For a preview of the identified production build before publication, run
`--prepare`, review that export locally, then use the protected Hosting-only
Firebase command shown above. Its predeploy check accepts only the current
prepared receipt. Call the script's exported `verifyLive(receipt)` afterward to
perform the same read-only comparison on both public hosts without rebuilding.

## Cache policy

The public Hosting config revalidates HTML with `max-age=0, must-revalidate`.
Stable public assets, including unchanged logo filenames, use
`max-age=3600, must-revalidate`. Fingerprinted `/_next/static/**` assets retain
`max-age=31536000, immutable`. Verify those headers on the public hosts after
release; a local configuration change is not evidence of a live change.

## GitHub follow-up

PR #1 contains website and broader backend/dashboard changes. Review and describe
that full scope before merging it into the default branch. Update the deployment
receipt after each release. Generated Hosting caches and TypeScript build info
can be removed from Git tracking after preserving the working copy. Branch
deletion and unrelated generated-code cleanup need an identified purpose and
owner; they are not part of this release wrapper.
