const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/lib/property-routes.ts');
const routeModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { module: routeModule, exports: routeModule.exports }, { filename });
const { getPropertyPath, getPropertyRouteSegments, resolvePropertyId, normalizePropertySlug } = routeModule.exports;

const id = '8fSf4y9RBP62PHm8LGcJ';
const liveSlug = 'nallur-house-4-bed-38-perch-yn-m8lgcj';

test('published aliases resolve to case-sensitive Firestore IDs and remain canonical', () => {
  assert.equal(resolvePropertyId(liveSlug), id);
  assert.equal(resolvePropertyId(id), id);
  assert.equal(getPropertyPath({ id }), `/properties/${liveSlug}/`);
  assert.deepEqual(Array.from(getPropertyRouteSegments({ id })), [id, liveSlug]);
});

test('a current raw slug preserves the previously published alias as an exported route', () => {
  const listing = { id, slug: 'updated-nallur-home' };
  assert.equal(getPropertyPath(listing), '/properties/updated-nallur-home/');
  assert.deepEqual(Array.from(getPropertyRouteSegments(listing)), [id, listing.slug, liveSlug]);
});

test('unsafe and reserved slugs cannot escape the property route or replace its shell', () => {
  for (const slug of ['../outside', '/absolute', 'https://example.com', 'view', '__fallback', 'two?query=yes', 'two#fragment', 'percent%2fpath', 'a'.repeat(201), '']) {
    assert.equal(normalizePropertySlug(slug), undefined);
    assert.equal(getPropertyPath({ id, slug }), `/properties/${liveSlug}/`);
  }
  assert.equal(normalizePropertySlug(' New-Property '), 'new-property');
});

test('a raw slug cannot take over another published listing alias', () => {
  assert.equal(getPropertyPath({ id: 'OtherFirestoreID', slug: liveSlug }), '/properties/OtherFirestoreID/');
  assert.deepEqual(Array.from(getPropertyRouteSegments({ id: 'OtherFirestoreID', slug: liveSlug })), ['OtherFirestoreID']);
});

test('new IDs retain their case and are encoded as one path segment', () => {
  assert.equal(resolvePropertyId('NewFirestoreID'), 'NewFirestoreID');
  assert.equal(getPropertyPath({ id: 'NewFirestoreID' }), '/properties/NewFirestoreID/');
  assert.equal(getPropertyPath({ id: 'unusual/id?value' }), '/properties/unusual%2Fid%3Fvalue/');
  assert.equal(getPropertyPath({ id: 'toString' }), '/properties/toString/');
});
