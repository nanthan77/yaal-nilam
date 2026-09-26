const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

function loadBuildReader(post, projectId = 'public-test-project') {
  const module = { exports: {} };
  const filename = path.resolve(__dirname, '../src/lib/build-listings.ts');
  const js = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(js, {
    module, exports: module.exports,
    require(name) {
      if (name === 'react') return { cache: (fn) => fn };
      if (name === 'axios') return { default: { post } };
      if (name === './marketplace') return { normalizeListing: (record) => record };
      if (name === './public-listings') return { PUBLIC_LISTING_STATUSES: ['Available', 'published'] };
      throw new Error(`Unexpected import: ${name}`);
    },
    process: { env: { NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId } },
    console: { warn() {} },
    fetch() { throw new Error('Build listings must not use the persistent Next fetch cache'); },
  }, { filename });
  return module.exports.getBuildListings;
}

function listing(id, status = 'Available', price = '85000000') {
  return { document: {
    name: `projects/public-test-project/databases/(default)/documents/listings/${id}`,
    fields: { status: { stringValue: status }, id: { stringValue: 'untrusted-field-id' }, price: { integerValue: price }, media_urls: { arrayValue: { values: [{ stringValue: '/supplied-photo.webp' }] } } },
  } };
}

test('build reads fresh public records without the persistent Next fetch cache', async () => {
  const requests = [];
  let rows = [listing('first-public-id')];
  const getListings = loadBuildReader(async (...args) => { requests.push(args); return { data: rows }; });
  assert.equal((await getListings())[0].id, 'first-public-id');
  rows = [listing('new-public-id', 'Available', '95000000'), listing('withdrawn-id', 'Pending')];
  const next = await getListings();
  assert.equal(requests.length, 2);
  assert.equal(next.length, 1);
  assert.equal(next[0].id, 'new-public-id');
  assert.equal(next[0].price, 95000000);
  assert.equal(next[0].media_urls[0], '/supplied-photo.webp');
  assert.equal(requests[1][2].timeout, 12000);
  assert.equal(requests[1][1].structuredQuery.where.fieldFilter.op, 'IN');
});

test('empty or unavailable build reads never invent property IDs', async () => {
  assert.equal((await loadBuildReader(async () => ({ data: [] }))()).length, 0);
  assert.equal((await loadBuildReader(async () => { throw new Error('read timeout'); })()).length, 0);
  let requested = false;
  const withoutConfig = loadBuildReader(async () => { requested = true; return { data: [] }; }, '');
  assert.equal((await withoutConfig()).length, 0);
  assert.equal(requested, false);
});
