# Website dependency audit — 2026-09-30

Read-only npm audit of the canonical web/package-lock.json reports **12 affected package entries: 1 critical, 8 high, 2 moderate and 1 low**. These are package entries, not 12 independent exploitable flaws. The glob advisory propagates into @next/eslint-plugin-next and eslint-config-next.

## Deployment exposure

The reviewed public target serves web/out with file rewrites only. next.config.js uses production output: export and images.unoptimized: true. There is no deployed Next request server or Image Optimization API. This removes the required request paths for the Next server/RSC/actions/proxy/cache/image advisories in this specific deployment. This is an exposure assessment, not a clean dependency audit.

The two critical Next advisories specifically require a Windows-hosted Next request server (CVE-2026-75604) or AVIF optimization through sharp/libheif. Both are absent here. The build runs on macOS, and this release performs no optimized image conversion. BeforeInteractive XSS can survive static export, but web source has no next/script or beforeInteractive use or untrusted script content. The CSP nonce issue also has no matching source usage. Re-evaluate immediately if SSR, optimization, middleware, actions or these script patterns are introduced.

Most other findings are build/lint tooling. PostCSS accepts reviewed repository CSS; there is no visitor-submitted CSS compiler. nanoid is reached from PostCSS with a fixed positive size of 6, not attacker-controlled zero/negative values. protobufjs comes through Firestore's Node gRPC/proto-loader dependency; the site accepts no .proto text or reflection parser input. Its advisory excludes ordinary encode/decode with trusted schemas.

## Smallest candidate updates (not installed)

| Package | Locked version(s) | Minimum reviewed candidate | Current range permits it? |
| --- | --- | --- | --- |
| baseline-browser-mapping | 2.10.10 | 2.11.0 | Yes, ^2.9.0 |
| brace-expansion | 1.1.12 / 2.0.2 / 5.0.4 | 1.1.21 / 2.1.7 / 5.0.12 | Yes, their existing major-specific ranges |
| browserslist | 4.28.1 | 4.28.7 | Yes, ^4.28.1 |
| js-yaml | 4.1.1 | 4.3.2 | Yes, ^4.1.0 |
| nanoid | 3.3.15 | 3.3.18 | Yes, ^3.3.6 / ^3.3.12 |
| postcss-selector-parser | 6.1.2 | 6.1.3 | Yes, ^6.1.1 / ^6.1.2 |
| protobufjs | 7.6.4 | 7.6.5 | Yes, ^7.2.5 |
| top-level PostCSS | 8.5.16 | 8.5.23 | Yes, ^8.5.16 |
| Next's nested PostCSS | 8.4.31 | 8.5.23 | No; Next pins 8.4.31. A tested targeted override is required. |
| glob | 10.3.10 | 10.5.0 | No; eslint plugin pins 10.3.10. A tested targeted override is required. |
| next | 14.2.35 | 15.5.24 or newer patched supported major | No; 14.2.35 is the latest stable Next 14. The audit suggests 16.3.7, a major upgrade. |

All candidate versions were confirmed in the npm registry; existing ranges were checked with semver. Current Node is 24.9.0 and satisfies the candidate brace-expansion 5 engine. Candidate updates still need lockfile regeneration, lint/data/browser tests and a production build. Do not use audit fix --force to make an unreviewed framework migration. Updating the top-level PostCSS alone leaves the nested pinned copy vulnerable.

## Primary references verified

- [Next Windows server RCE](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36)
- [Next AVIF Image Optimizer RCE](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)
- [Next beforeInteractive XSS](https://github.com/vercel/next.js/security/advisories/GHSA-gx5p-jg67-6x7h)
- [glob CLI command injection](https://github.com/isaacs/node-glob/security/advisories/GHSA-5j98-mcp5-4vw2)
- [PostCSS residual source-map disclosure](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp)
- [brace-expansion latest range fix](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-q2hr-2g5m-vwhr)
- [brace-expansion nested recursion](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7)
- [Browserslist memory growth](https://github.com/browserslist/browserslist/security/advisories/GHSA-c83g-rgw3-j3cx)
- [Browserslist custom-stats crash](https://github.com/browserslist/browserslist/security/advisories/GHSA-73wf-gq98-2v4g)
- [JS-YAML merge-key CPU](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh)
- [protobufjs untrusted schema parsing](https://github.com/protobufjs/protobuf.js/security/advisories/GHSA-j3f2-48v5-ccww)
- [Nano ID 3.3.18 release](https://github.com/ai/nanoid/releases/tag/3.3.18)
- [Selector parser 6.1.3 security release](https://github.com/postcss/postcss-selector-parser/releases/tag/6.1.3)
- [Baseline mapping 2.11.0 release](https://github.com/web-platform-dx/baseline-browser-mapping/releases/tag/v2.11.0)

## Exact package/advisory inventory from npm

### @next/eslint-plugin-next (high)

Locked: 14.2.35 (node_modules/@next/eslint-plugin-next).

- Propagated from glob.

### baseline-browser-mapping (moderate)

Locked: 2.10.10 (node_modules/baseline-browser-mapping).

- [baseline-browser-mapping process termination on invalid input causes denial of service](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) — affected >=2.0.0 <2.11.0.

### brace-expansion (high)

Locked: 5.0.4 (node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion); 1.1.12 (node_modules/brace-expansion); 2.0.2 (node_modules/glob/node_modules/brace-expansion).

- [brace-expansion: Zero-step sequence causes process hang and memory exhaustion](https://github.com/advisories/GHSA-f886-m6hf-6m8v) — affected <1.1.13 or >=2.0.0 <2.0.3 or >=4.0.0 <5.0.5.
- [brace-expansion: Large numeric range defeats documented `max` DoS protection](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) — affected >=5.0.0 <5.0.6.
- [brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) — affected >=2.0.0 <2.1.2 or <1.1.16 or >=3.0.0 <5.0.7.
- [brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash](https://github.com/advisories/GHSA-mh99-v99m-4gvg) — affected <1.1.17 or >=2.0.0 <2.1.3 or >=4.0.0 <5.0.8.
- [brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation](https://github.com/advisories/GHSA-rgw5-rvv9-x895) — affected >=4.0.0 <5.0.9 or >=2.0.0 <2.1.4 or <1.1.18.
- [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) — affected <1.1.21 or >=2.0.0 <2.1.7 or >=4.0.0 <5.0.12.
- [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7) — affected <1.1.20 or >=2.0.0 <2.1.6 or >=4.0.0 <5.0.11.
- [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) — affected <1.1.19 or >=2.0.0 <2.1.5 or >=4.0.0 <5.0.10.

### browserslist (high)

Locked: 4.28.1 (node_modules/browserslist).

- [Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) — affected <=4.28.6.
- [Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats)](https://github.com/advisories/GHSA-73wf-gq98-2v4g) — affected <=4.28.6.

### eslint-config-next (high)

Locked: 14.2.35 (node_modules/eslint-config-next).

- Propagated from @next/eslint-plugin-next.

### glob (high)

Locked: 10.3.10 (node_modules/glob).

- [glob CLI: Command injection via -c/--cmd executes matches with shell:true](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) — affected >=10.2.0 <10.5.0.

### js-yaml (high)

Locked: 4.1.1 (node_modules/js-yaml).

- [JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases](https://github.com/advisories/GHSA-h67p-54hq-rp68) — affected >=4.0.0 <=4.1.1.
- [js-yaml: YAML merge-key chains can force quadratic CPU consumption](https://github.com/advisories/GHSA-52cp-r559-cp3m) — affected >=4.0.0 <4.3.0.
- [JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) — affected >=4.0.0 <4.3.1.
- [js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources](https://github.com/advisories/GHSA-2883-xcg3-v3hh) — affected >=4.0.0 <4.3.2.

### nanoid (high)

Locked: 3.3.15 (node_modules/nanoid).

- [nanoid: non-secure generators can loop indefinitely with negative size](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) — affected <3.3.16.
- [nanoid: custom generators can loop indefinitely when size is zero](https://github.com/advisories/GHSA-2v37-7h3g-55p8) — affected <3.3.18.

### next (critical)

Locked: 14.2.35 (node_modules/next).

- Propagated from postcss.
- [Next.js self-hosted applications vulnerable to DoS via Image Optimizer remotePatterns configuration](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f) — affected >=10.0.0 <15.5.10.
- [Next.js HTTP request deserialization can lead to DoS when using insecure React Server Components](https://github.com/advisories/GHSA-h25m-26qc-wcjf) — affected >=13.0.0 <15.0.8.
- [Next.js: HTTP request smuggling in rewrites](https://github.com/advisories/GHSA-ggv3-7p47-pfv8) — affected >=9.5.0 <15.5.13.
- [Next.js: Unbounded next/image disk cache growth can exhaust storage](https://github.com/advisories/GHSA-3x4c-7xq6-9pq8) — affected >=10.0.0 <15.5.14.
- [Next.js has a Denial of Service with Server Components](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3) — affected >=13.0.0 <15.5.15.
- [Next.js Vulnerable to Denial of Service with Server Components](https://github.com/advisories/GHSA-8h8q-6873-q5fj) — affected >=13.0.0 <15.5.16.
- [Next.js's Middleware / Proxy redirects can be cache-poisoned](https://github.com/advisories/GHSA-3g8h-86w9-wvmq) — affected >=12.2.0 <15.5.16.
- [Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q) — affected >=13.4.0 <15.5.16.
- [Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting](https://github.com/advisories/GHSA-vfv6-92ff-j949) — affected >=13.4.6 <15.5.16.
- [Next.js has cross-site scripting in beforeInteractive scripts with untrusted input](https://github.com/advisories/GHSA-gx5p-jg67-6x7h) — affected >=13.0.0 <15.5.16.
- [Next.js has a Denial of Service in the Image Optimization API](https://github.com/advisories/GHSA-h64f-5h5j-jqjh) — affected >=10.0.0 <15.5.16.
- [Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades](https://github.com/advisories/GHSA-c4j6-fc7j-m34r) — affected >=13.4.13 <15.5.16.
- [Next.js vulnerable to cache poisoning in React Server Component responses](https://github.com/advisories/GHSA-wfc6-r584-vfw7) — affected >=14.2.0 <15.5.16.
- [Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n](https://github.com/advisories/GHSA-36qx-fr4f-26g5) — affected >=12.2.0 <15.5.16.
- [Next.js: Denial of Service in App Router using Server Actions](https://github.com/advisories/GHSA-m99w-x7hq-7vfj) — affected >=13.0.0 <15.5.21.
- [Next.js: Server-Side Request Forgery in Server Actions on custom servers](https://github.com/advisories/GHSA-89xv-2m56-2m9x) — affected >=14.1.1 <15.5.21.
- [Next.js: Cache confusion of response bodies for requests with bodies](https://github.com/advisories/GHSA-68g3-v927-f742) — affected >=13.0.0 <15.5.21.
- [Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences](https://github.com/advisories/GHSA-4633-3j49-mh5q) — affected >=13.0.0 <15.5.21.
- [Next.js: Unbounded Server Action payload in Edge runtime](https://github.com/advisories/GHSA-4c39-4ccg-62r3) — affected >=13.0.0 <15.5.21.
- [Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname](https://github.com/advisories/GHSA-p9j2-gv94-2wf4) — affected >=12.0.0 <15.5.21.
- [Next.js: Unauthenticated disclosure of internal Server Function endpoints](https://github.com/advisories/GHSA-955p-x3mx-jcvp) — affected >=13.0.0 <15.5.21.
- [Next.js: Unauthenticated Remote Code Execution on windows-hosted servers](https://github.com/advisories/GHSA-p293-qw3h-jr36) — affected >=13.4.0 <15.5.24.
- [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) — affected >=10.0.0 <15.5.24.

### postcss (high)

Locked: 8.4.31 (node_modules/next/node_modules/postcss); 8.5.16 (node_modules/postcss).

- [PostCSS has XSS via Unescaped </style> in its CSS Stringify Output](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — affected <8.5.10.
- [PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments](https://github.com/advisories/GHSA-6g55-p6wh-862q) — affected <=8.5.11.
- [PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) — affected <=8.5.22.
- [PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure](https://github.com/advisories/GHSA-r28c-9q8g-f849) — affected <=8.5.17.

### postcss-selector-parser (low)

Locked: 6.1.2 (node_modules/postcss-selector-parser).

- [postcss-selector-parser allows denial of service through uncontrolled AST recursion](https://github.com/advisories/GHSA-w9m9-85wc-3x92) — affected >=6.1.0 <6.1.3.

### protobufjs (moderate)

Locked: 7.6.4 (node_modules/protobufjs).

- [protobufjs: Denial of Service via infinite loop in .proto option parsing](https://github.com/advisories/GHSA-j3f2-48v5-ccww) — affected >=7.5.0 <=7.6.4.

