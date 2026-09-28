const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

// Run the real TypeScript data layer with only the Firebase transport replaced.
// These tests never contact Firebase or create public leads.
function createDataLayer({ env = 'production', fixtureFlag = 'false', read, readDoc, stored = null, write, analytics = {}, callable, browser = true, hostname = 'yaalnilam.com' } = {}) {
  const modules = new Map();
  const storage = new Map(stored === null ? [] : [['yaal-nilam-saved-properties', stored]]);
  const window = { location: { hostname }, localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
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
        if (name === './firebase') return { db: {}, default: {} };
        if (name === 'firebase/firestore') return transport;
        if (name === 'firebase/analytics') return { getAnalytics: () => ({}), isSupported: async () => true, logEvent() {}, ...analytics };
        if (name === 'firebase/functions') return { getFunctions: () => ({}), httpsCallable: (_functions, name) => (data) => callable(name, data) };
        if (name.startsWith('./')) return load(name.slice(2));
        throw new Error(`Unexpected import: ${name}`);
      },
      process: { env: { NODE_ENV: env, NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES: fixtureFlag } },
      console: { warn() {}, error() {} },
      ...(browser ? { window } : {}), setTimeout, clearTimeout, Date, Intl,
    }, { filename });
    return module.exports;
  }
  return { api: load('firestore'), marketplace: load('marketplace'), alerts: () => load('property-alerts'), storage };
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

test('published property aliases resolve to real document IDs without inventing content', async () => {
  const reads = [];
  const { api } = createDataLayer({
    readDoc: async ({ id }) => {
      reads.push(id);
      return { id, exists: () => true, data: () => ({ status: 'Available', title: 'Live property' }) };
    },
  });
  const listing = await api.getPropertyById('nallur-house-4-bed-38-perch-yn-m8lgcj');
  assert.equal(listing.id, '8fSf4y9RBP62PHm8LGcJ');
  assert.deepEqual(reads, ['8fSf4y9RBP62PHm8LGcJ']);
});

test('a new stored slug resolves only from a fresh published query', async () => {
  let records = [{ id: 'new-live-id', slug: ' New-Property-Slug ', title: 'Live property', status: 'Available' }];
  const { api } = createDataLayer({ read: async () => snapshot(records) });
  assert.equal((await api.getPropertyById('new-property-slug')).id, 'new-live-id');
  records = [];
  assert.equal(await api.getPropertyById('new-property-slug'), null);
});

test('samples require explicit development opt-in and have visible sample titles', async () => {
  assert.equal(createDataLayer({ env: 'development' }).api.DEFAULT_PROPERTY_CATALOG.length, 0);
  const { api } = createDataLayer({ env: 'development', fixtureFlag: 'true' });
  assert.ok(api.DEFAULT_PROPERTY_CATALOG.length > 0);
  assert.ok(api.DEFAULT_PROPERTY_CATALOG.every((property) => property.title.startsWith('[DEVELOPMENT SAMPLE]')));
  assert.ok((await api.getPropertyById(api.DEFAULT_PROPERTY_CATALOG[0].id)).title.startsWith('[DEVELOPMENT SAMPLE]'));
});

test('legacy area slugs never become shared property URLs', () => {
  const { marketplace } = createDataLayer();
  const legacy = marketplace.normalizeListing({ id: '8fSf4y9RBP62PHm8LGcJ', area: 'jaffna-fort', slug: 'jaffna-fort' });
  assert.equal(legacy.area_slug, 'jaffna-fort');
  assert.equal(legacy.slug, undefined);
  const current = marketplace.normalizeListing({ id: 'new-live-id', slug: 'new-property-slug' });
  assert.equal(current.area_slug, 'jaffna');
  assert.equal(current.slug, 'new-property-slug');
});

test('missing listing photos do not become unrelated location photographs', () => {
  const { marketplace } = createDataLayer();
  const property = marketplace.normalizeListing({ id: 'without-photo', area: 'nallur', status: 'Available' });
  assert.equal(property.media_urls.length, 0);
  assert.equal(marketplace.resolvePropertyImage(property), '/property-placeholder.svg');
});

test('malformed saved IDs are harmless and save does not wait for analytics', async () => {
  let writes = 0;
  const { api, storage } = createDataLayer({
    stored: '{invalid-json',
    write: () => { writes++; return new Promise(() => {}); },
    analytics: { isSupported: () => new Promise(() => {}) },
  });
  assert.equal((await api.getSavedPropertyIds()).length, 0);
  const result = await Promise.race([
    api.toggleSavedProperty({ id: 'real-live-id', listing_code: 'LIVE', area_slug: 'nallur' }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Save waited for analytics')), 100)),
  ]);
  assert.equal(result, true);
  assert.deepEqual(JSON.parse(storage.get('yaal-nilam-saved-properties')), ['real-live-id']);
  assert.equal(writes, 0);
});

test('browser analytics uses aggregate GA4 events without Firestore writes or contact fields', async () => {
  const events = [];
  let writes = 0;
  const { api } = createDataLayer({
    write: async () => { writes++; return { id: 'unexpected-write' }; },
    analytics: { logEvent: (_analytics, event, parameters) => events.push({ event, parameters }) },
  });
  assert.equal(await api.trackAnalyticsEvent(' 42 Listing View! ', {
    listing_id: 'private-document-id', listing_code: 'YN-TEST', agent_name: 'Test Agent',
    email: 'test@example.invalid', phone: '+94000000000', message: 'private inquiry',
    keyword: 'private free text', session_id: 'private-session',
    source: ' property_detail ', area_slug: 'nallur', bedrooms: 3, depth_percent: Infinity,
  }), true);
  assert.equal(writes, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(events)), [{
    event: 'listing_view_', parameters: { source: 'property_detail', area_slug: 'nallur', bedrooms: 3 },
  }]);
});

test('unsupported, server, and failed analytics do not fail user actions', async () => {
  let calls = 0;
  const analytics = { getAnalytics: () => { calls++; throw new Error('blocked'); } };
  assert.equal(await createDataLayer({ browser: false, analytics }).api.trackAnalyticsEvent('server_event'), true);
  assert.equal(await createDataLayer({ analytics: { ...analytics, isSupported: async () => false } }).api.trackAnalyticsEvent('unsupported_event'), true);
  assert.equal(calls, 0);
  const { api } = createDataLayer({ analytics });
  assert.equal(await api.trackAnalyticsEvent('blocked_event'), false);
  assert.equal(await api.submitInquiry({ name: 'Local test', email: 'test@example.invalid', phone: '', message: 'Local test inquiry' }), 'local-test-write');
});

test('local browser QA never initializes production analytics', async () => {
  let calls = 0;
  for (const hostname of ['localhost', '127.0.0.1', '[::1]']) {
    const { api } = createDataLayer({ hostname, analytics: { isSupported: async () => { calls++; return true; } } });
    assert.equal(await api.trackAnalyticsEvent('local_event'), true);
  }
  assert.equal(calls, 0);
});

test('accepted lead submissions resolve while analytics initialization is stalled', async () => {
  const writes = [];
  let analyticsChecks = 0;
  const { api } = createDataLayer({
    write: async (collection) => { writes.push(collection); return { id: `${collection}-accepted` }; },
    analytics: { isSupported: () => { analyticsChecks++; return new Promise(() => {}); } },
  });
  const submitted = Promise.all([
    api.submitInquiry({ name: 'Local test', email: 'test@example.invalid', phone: '', message: 'Local test' }),
    api.submitViewingRequest({ listing: { id: 'local-listing', listing_code: 'LOCAL', title: 'Local test' }, name: 'Local test', phone: '+94000000000' }),
    api.submitPropertyRequest({ name: 'Local test', phone: '+94000000000', intent: 'buy', propertyType: 'house', area: 'nallur' }),
  ]);
  let timeout;
  const results = await Promise.race([
    submitted,
    new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Successful lead waited for analytics')), 200); }),
  ]).finally(() => clearTimeout(timeout));
  assert.equal(results[0], 'inquiries-accepted');
  assert.equal(results[1], 'viewing_requests-accepted');
  assert.deepEqual(JSON.parse(JSON.stringify(results[2])), { requestId: 'property_requests-accepted', requirementId: 'requirements-accepted' });
  assert.deepEqual(writes.sort(), ['inquiries', 'inquiries', 'property_requests', 'requirements', 'viewing_requests']);
  assert.ok(analyticsChecks > 0, 'analytics was still dispatched');
});

test('viewing request and inquiry preserve lead routing required by deployed rules', async () => {
  const writes = [];
  const { api } = createDataLayer({
    write: async (collection, payload) => { writes.push({ collection, payload }); return { id: 'local-test-write' }; },
  });
  assert.equal(await api.submitViewingRequest({
    listing: { id: 'local-listing', listing_code: 'YN-TEST', title: 'Local test property' },
    name: 'Local test', phone: '+94000000000', notes: 'Local emulator test', timezone: 'Asia/Colombo',
  }), 'local-test-write');
  assert.deepEqual(writes.map(({ collection }) => collection), ['viewing_requests', 'inquiries']);
  const viewing = writes[0].payload;
  const inquiry = writes[1].payload;
  assert.equal(viewing.notify_email, 'info@yaalnilam.com');
  assert.equal(inquiry.notify_email, 'info@yaalnilam.com');
  assert.equal(inquiry.assigned_email, 'info@yaalnilam.com');
  assert.equal(inquiry.source, 'viewing_request');
  assert.equal(viewing.listing_id, inquiry.listing_id);
  assert.deepEqual(Object.keys(viewing).sort(), [
    'session_id', 'listing_id', 'listing_code', 'listing_title', 'customer_name', 'phone', 'whatsapp',
    'email', 'preferred_date', 'timezone', 'notes', 'notify_email', 'status', 'created_at',
  ].sort());
  assert.deepEqual(Object.keys(inquiry).sort(), [
    'customer_name', 'email', 'phone', 'whatsapp', 'subject', 'message', 'listing_id', 'listing_title',
    'source', 'notify_email', 'assigned_email', 'status', 'priority', 'assigned_to', 'notes', 'created_at', 'updated_at',
  ].sort());
});

test('property requests retain routing fields for both request and requirement records', async () => {
  const writes = [];
  const { api } = createDataLayer({ write: async (collection, payload) => { writes.push({ collection, payload }); return { id: collection }; } });
  assert.deepEqual(JSON.parse(JSON.stringify(await api.submitPropertyRequest({
    name: 'Local test', phone: '+94000000000', intent: 'buy', propertyType: 'house', area: 'nallur',
  }))), { requestId: 'property_requests', requirementId: 'requirements' });
  assert.deepEqual(writes.map(({ collection }) => collection), ['property_requests', 'requirements']);
  for (const { payload } of writes) assert.equal(payload.notify_email, 'info@yaalnilam.com');
  assert.equal(writes[1].payload.matches_count, 0);
});

test('legacy alert helper uses the registration callable and preserves a cancellation receipt', async () => {
  const calls = [];
  const { api, storage } = createDataLayer({
    write: async () => { throw new Error('Alert registration must not write Firestore'); },
    callable: async (name, payload) => {
      calls.push({ name, payload });
      return { data: { registrationId: 'registration-local-test', cancellationToken: 'a'.repeat(43), alertIds: ['local-alert'], createdAt: '2026-09-28T00:00:00.000Z' } };
    },
  });
  assert.equal(await api.createPropertyAlert({ whatsapp: '+94000000000', purpose: 'buy', propertyType: 'house', area: 'nallur', locale: 'ta' }), 'registration-local-test');
  assert.equal(calls[0].name, 'registerPropertyAlert');
  assert.equal(calls[0].payload.purpose, 'sale');
  assert.equal(calls[0].payload.whatsappConsent, true);
  assert.equal(calls[0].payload.source, 'web');
  const receipt = JSON.parse(storage.get('yaalnilam-property-alert-receipts-v1'))[0];
  assert.equal(receipt.registrationId, 'registration-local-test');
  assert.equal(receipt.cancellationToken, 'a'.repeat(43));
  assert.equal(receipt.label, 'சொத்து எச்சரிக்கை');
  assert.equal('phone' in receipt, false);
});

test('alert cancellation uses its private receipt and removes it only after server success', async () => {
  const calls = [];
  let cancellationSucceeds = false;
  const { alerts, storage } = createDataLayer({ callable: async (name, payload) => {
    calls.push({ name, payload });
    if (name === 'registerPropertyAlert') return { data: { registrationId: 'registration-local-test', cancellationToken: 'b'.repeat(43), alertIds: ['local-alert'], createdAt: '2026-09-28T00:00:00.000Z' } };
    return { data: { ok: cancellationSucceeds } };
  } });
  const helper = alerts();
  const receipt = await helper.registerPropertyAlert({ label: 'Local alert', receiptLabel: 'Local alert', phone: '+94000000000', purpose: 'rent', propertyType: 'any', areas: [], maxPrice: 0, minBedrooms: 0, locale: 'en' });
  await assert.rejects(helper.cancelPropertyAlert(receipt), /not cancelled/);
  assert.equal(helper.listPropertyAlertReceipts().length, 1);
  cancellationSucceeds = true;
  await helper.cancelPropertyAlert(receipt);
  assert.equal(helper.listPropertyAlertReceipts().length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[2])), {
    name: 'cancelPropertyAlert', payload: { registrationId: receipt.registrationId, cancellationToken: receipt.cancellationToken },
  });
  storage.set('yaalnilam-property-alert-receipts-v1', '{malformed');
  assert.equal(helper.listPropertyAlertReceipts().length, 0);
});

test('invalid alert service response is not reported as success or stored', async () => {
  const { api, storage } = createDataLayer({ callable: async () => ({ data: { registrationId: 'incomplete' } }) });
  assert.equal(await api.createPropertyAlert({ whatsapp: '+94000000000', purpose: 'buy' }), null);
  assert.equal(storage.has('yaalnilam-property-alert-receipts-v1'), false);
});
