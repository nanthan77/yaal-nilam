const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

// Run the real TypeScript data layer with only the Firebase transport replaced.
// These tests never contact Firebase or create public leads.
function createDataLayer({ env = 'production', fixtureFlag = 'false', read, readDoc, stored = null, write } = {}) {
  const modules = new Map();
  const storage = new Map(stored === null ? [] : [['yaal-nilam-saved-properties', stored]]);
  const window = { localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
  const transport = {
    collection: (_db, name) => name,
    doc: (_db, name, id) => ({ name, id }),
    query: (collection) => collection,
    where: () => ({}), limit: () => ({}),
    getDocs: read || (async () => ({ docs: [] })),
    getDoc: readDoc || (async () => ({ exists: () => false })),
    addDoc: write || (async () => ({ id: 'local-test-write' })),
  };
  function load(file) {
    const filename = path.resolve(__dirname, '../src/lib', `${file}.ts`);
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const js = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    vm.runInNewContext(js, {
      module, exports: module.exports,
      require(name) {
        if (name === './firebase') return { db: {} };
        if (name === 'firebase/firestore') return transport;
        if (name.startsWith('./')) return load(name.slice(2));
        throw new Error(`Unexpected import: ${name}`);
      },
      process: { env: { NODE_ENV: env, NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES: fixtureFlag } },
      console: { warn() {}, error() {} },
      window, setTimeout, clearTimeout, Date, Intl,
    }, { filename });
    return module.exports;
  }
  return { api: load('firestore'), marketplace: load('marketplace'), storage };
}

function snapshot(records) {
  return { docs: records.map((record) => ({ id: record.id, data: () => record })) };
}

test('production ignores fixture flag and exposes no sample listings or counts', async () => {
  const { api } = createDataLayer({ fixtureFlag: 'true' });
  assert.equal(api.DEFAULT_PROPERTY_CATALOG.length, 0);
  assert.ok(api.DEFAULT_AREA_CATALOG.every((area) => area.properties_count === 0));
  assert.equal((await api.getProperties()).length, 0);
  assert.equal(await api.getPropertyById('1'), null);
});

test('failed production reads cannot return samples', async () => {
  const { api } = createDataLayer({ read: async () => { throw new Error('offline'); } });
  assert.equal((await api.getProperties()).length, 0);
  assert.equal((await api.getAgents()).length, 0);
});

test('successful empty response clears previously confirmed real records', async () => {
  let records = [{ id: 'real-live-id', title: 'Live listing', status: 'Available', intent: 'sell' }];
  const { api } = createDataLayer({ read: async () => snapshot(records) });
  assert.equal((await api.getProperties())[0].id, 'real-live-id');
  records = [];
  assert.equal((await api.getProperties()).length, 0);
  assert.equal(await api.getPropertyById('real-live-id'), null);
});

test('missing and unpublished detail reads do not show cached properties', async () => {
  const { api } = createDataLayer({
    read: async () => snapshot([{ id: 'real-live-id', status: 'Available' }]),
    readDoc: async ({ id }) => ({ id, exists: () => id === 'private-id', data: () => ({ status: 'Pending' }) }),
  });
  await api.getProperties();
  assert.equal(await api.getPropertyById('real-live-id'), null);
  assert.equal(await api.getPropertyById('private-id'), null);
});

test('permission failures cannot revive a previously public detail record', async () => {
  const { api } = createDataLayer({
    read: async () => snapshot([{ id: 'withdrawn-id', status: 'Available' }]),
    readDoc: async () => { throw Object.assign(new Error('denied'), { code: 'permission-denied' }); },
  });
  await api.getProperties();
  assert.equal(await api.getPropertyById('withdrawn-id'), null);
});

test('samples require explicit development opt-in and have visible sample titles', async () => {
  assert.equal(createDataLayer({ env: 'development' }).api.DEFAULT_PROPERTY_CATALOG.length, 0);
  const { api } = createDataLayer({ env: 'development', fixtureFlag: 'true' });
  assert.ok(api.DEFAULT_PROPERTY_CATALOG.length > 0);
  assert.ok(api.DEFAULT_PROPERTY_CATALOG.every((property) => property.title.startsWith('[DEVELOPMENT SAMPLE]')));
  assert.ok((await api.getPropertyById(api.DEFAULT_PROPERTY_CATALOG[0].id)).title.startsWith('[DEVELOPMENT SAMPLE]'));
});

test('missing listing photos do not become unrelated location photographs', () => {
  const { marketplace } = createDataLayer();
  const property = marketplace.normalizeListing({ id: 'without-photo', area: 'nallur', status: 'Available' });
  assert.equal(property.media_urls.length, 0);
  assert.equal(marketplace.resolvePropertyImage(property), '/property-placeholder.svg');
});

test('malformed saved IDs are harmless and save does not wait for analytics', async () => {
  let writes = 0;
  const { api, storage } = createDataLayer({ stored: '{invalid-json', write: () => { writes++; return new Promise(() => {}); } });
  assert.equal((await api.getSavedPropertyIds()).length, 0);
  const result = await Promise.race([
    api.toggleSavedProperty({ id: 'real-live-id', listing_code: 'LIVE', area_slug: 'nallur' }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Save waited for analytics')), 100)),
  ]);
  assert.equal(result, true);
  assert.deepEqual(JSON.parse(storage.get('yaal-nilam-saved-properties')), ['real-live-id']);
  assert.equal(writes, 1);
});
