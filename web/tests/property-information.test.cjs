const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

// Execute the actual normalizer and submission service. Only Firebase transport
// is replaced, so these checks cannot create listings or leads in production.
function createModules({ env = 'production', fixtureFlag = 'false', records = [], recordById = {}, buildRows = [], projectId = 'public-test-project', emulatorHost = '', emulatorConnected = false } = {}) {
  const modules = new Map();
  const writes = [];
  const transport = {
    collection: (_db, name) => name,
    doc: (...args) => args.length === 1 ? { collection: args[0], id: `${args[0]}-test-id` } : { collection: args[1], id: args[2] },
    query: (collection) => collection,
    where: (field, operator, value) => ({ field, operator, value }),
    getDocs: async () => ({ docs: records.map((record) => ({ id: record.id, data: () => record })) }),
    getDoc: async (ref) => ({ id: ref.id, exists: () => !!recordById[ref.id], data: () => recordById[ref.id] }),
    writeBatch: () => ({
      set: (ref, payload) => writes.push({ collection: ref.collection, payload }),
      commit: async () => {},
    }),
    addDoc: async (collection, payload) => { writes.push({ collection, payload }); return { id: `${collection}-test-id` }; },
  };
  function load(name) {
    if (modules.has(name)) return modules.get(name).exports;
    const filename = path.resolve(__dirname, '../src/lib', `${name}.ts`);
    const module = { exports: {} };
    modules.set(name, module);
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports,
      require(importName) {
        if (importName === './firebase') return { db: { app: { options: { projectId }, __firestoreEmulatorConnected: emulatorConnected } } };
        if (importName === 'firebase/firestore') return transport;
        if (importName === 'react') return { cache: (fn) => fn };
        if (importName === 'axios') return { default: { post: async () => ({ data: buildRows }) } };
        if (importName.startsWith('./')) return load(importName.slice(2));
        throw new Error(`Unexpected import: ${importName}`);
      },
      process: { env: { NODE_ENV: env, NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES: fixtureFlag, NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId, NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: emulatorHost } },
      console, Date, Intl, URL, setTimeout, clearTimeout,
    }, { filename });
    return module.exports;
  }
  return { load, writes };
}

const { load } = createModules();
const { normalizeListing, filterListings } = load('marketplace');

test('a listing without owner details does not imply water, roads, legal checks or support', () => {
  const listing = normalizeListing({ id: 'missing-information', area: 'nallur', road_frontage_ft: 30 });
  assert.equal(listing.water_source.type, undefined);
  assert.equal(listing.water_source.sweetness_index, undefined);
  assert.equal(listing.water_source.well_available, undefined);
  assert.equal(listing.water_source.municipal_line_available, undefined);
  assert.equal(listing.pathivagam_status.deed_history_years, undefined);
  assert.equal(listing.pathivagam_status.extract_status, 'not_checked');
  assert.equal(listing.pathivagam_status.land_registry_office, undefined);
  assert.equal(listing.pathivagam_status.folio_checked, undefined);
  assert.equal(listing.pathivagam_status.encumbrance_free, null);
  assert.equal(listing.road_frontage.road_type, undefined);
  assert.equal(listing.road_frontage.access_type, undefined);
  assert.equal(listing.survey_plan.court_approved, undefined);
  assert.equal(listing.remote_purchase_support, false);
  assert.equal(listing.title_history_status, 'not_checked');
  assert.equal(filterListings([listing], { waterSource: 'sweet' }).length, 0);
  assert.equal(filterListings([listing], { deedVerifiedOnly: true }).length, 0);
  assert.equal(filterListings([listing], { floodSafeOnly: true }).length, 0);
});

test('platform or document review cannot invent notarial, survey or 30-year certification', () => {
  const listing = normalizeListing({ id: 'reviewed', verified: true, documents_verified: true, surveyor_reg_no: 'supplied-number' });
  assert.equal(listing.verified, true);
  assert.equal(listing.verification_tier, 'tier3_basic_listed');
  assert.equal(listing.pathivagam_status.extract_status, 'not_checked');
  assert.equal(listing.pathivagam_status.deed_history_years, undefined);
  assert.equal(listing.pathivagam_status.encumbrance_free, null);
  assert.ok(listing.verification_badges.includes('Listing details reviewed'));
  assert.ok(listing.verification_badges.includes('Document review recorded'));
  assert.ok(!listing.verification_badges.some((badge) => /30|notar|licensed|deed/i.test(badge)));
  assert.equal(normalizeListing({ documents_verified: true }).verified, false);
  assert.equal(normalizeListing({ verified: 'false', documents_verified: 'false' }).verification_badges.length, 0);
});

test('area center remains approximate through normalization and does not get jittered by listing ID', () => {
  const a = normalizeListing({ id: 'one', area: 'nallur' });
  const b = normalizeListing({ id: 'two', area: 'nallur' });
  assert.equal(a.coordinates_source, 'area_center');
  assert.equal(a.coordinates.lat, b.coordinates.lat);
  assert.equal(a.coordinates.lng, b.coordinates.lng);
  assert.equal(normalizeListing(a).coordinates_source, 'area_center');
  assert.equal(a.landmarks_proximity.length, 0);
  assert.equal(a.flood_zone, undefined);
});

test('supplied coordinates are retained, but do not generate travel or site-safety claims', () => {
  const listing = normalizeListing({ id: 'located', coordinates: { lat: 9.6744, lng: 80.0294 }, area: 'nallur' });
  assert.equal(listing.coordinates_source, 'provided');
  assert.equal(listing.coordinates.lat, 9.6744);
  assert.equal(listing.coordinates.lng, 80.0294);
  assert.equal(listing.landmarks_proximity.length, 0);
  assert.equal(listing.flood_zone, undefined);
  assert.equal(normalizeListing({ coordinates: { lat: 0, lng: 0 } }).coordinates_source, 'provided');
  assert.equal(normalizeListing({ coordinates: { lat: '', lng: null } }).coordinates_source, 'area_center');
  assert.equal(normalizeListing({ coordinates: { lat: 95, lng: 300 } }).coordinates_source, 'area_center');
});

test('explicit owner details survive including false values and supplied document data', () => {
  const listing = normalizeListing({
    id: 'owner-details', road_type: 'gravel', road_access_type: 'lane',
    water_source: { type: 'brackish_well', sweetness_index: 'saline', well_available: false, municipal_line_available: false },
    pathivagam_status: { deed_history_years: 10, extract_status: 'verified_10_years', land_registry_office: 'Provided office', folio_checked: false, encumbrance_free: false },
    survey_plan: { court_approved: false },
  });
  assert.equal(listing.water_source.type, 'brackish_well');
  assert.equal(listing.water_source.well_available, false);
  assert.equal(listing.pathivagam_status.deed_history_years, 10);
  assert.equal(listing.pathivagam_status.land_registry_office, 'Provided office');
  assert.equal(listing.pathivagam_status.encumbrance_free, false);
  assert.equal(listing.pathivagam_status.folio_checked, false);
  assert.equal(listing.road_frontage.road_type, 'gravel');
  assert.equal(listing.road_frontage.access_type, 'lane');
  assert.equal(listing.survey_plan.court_approved, false);
});

const baseSubmission = {
  title: 'Owner submission', description: 'Information from owner', phone: '+94700000000',
  propertyType: 'land', intent: 'sell', area: 'nallur', address: 'Owner address', price: 1000000,
};

test('a minimal seller submission persists unknown details while retaining the atomic lead flow', async () => {
  const { load: loadService, writes } = createModules();
  const result = await loadService('firestore').submitListing(baseSubmission);
  assert.ok(result);
  assert.equal(writes.length, 2);
  assert.equal(writes[0].collection, 'listing_submissions');
  assert.equal(writes[1].collection, 'inquiries');
  const record = writes[0].payload;
  assert.equal(record.water_source.type, null);
  assert.equal(record.water_source.sweetness_index, 'not_tested');
  assert.equal(record.water_source.well_available, null);
  assert.equal(record.water_source.municipal_line_available, null);
  assert.equal(record.pathivagam_status.deed_history_years, null);
  assert.equal(record.pathivagam_status.land_registry_office, null);
  assert.equal(record.pathivagam_status.extract_status, 'not_checked');
  assert.equal(record.pathivagam_status.folio_checked, null);
  assert.equal(record.pathivagam_status.encumbrance_free, null);
  assert.equal(record.road_frontage.road_type, null);
  assert.equal(record.road_frontage.access_type, null);
  assert.equal(record.verified, false);
  assert.equal(record.status, 'new');
  assert.equal(writes[1].payload.source, 'public_listing_form');
});

test('seller submission retains explicitly supplied water, road and document information', async () => {
  const { load: loadService, writes } = createModules();
  await loadService('firestore').submitListing({ ...baseSubmission,
    roadType: 'gravel', roadAccessType: 'lane', waterSource: 'tube_well', waterSweetness: 'not_tested',
    wellAvailable: false, municipalLineAvailable: true, deedHistoryYears: 10,
    deedHistoryStatus: 'pending', landRegistryOffice: 'Provided office', folioChecked: false, encumbranceFree: false,
  });
  const record = writes[0].payload;
  assert.equal(record.water_source.type, 'tube_well');
  assert.equal(record.water_source.well_available, false);
  assert.equal(record.water_source.municipal_line_available, true);
  assert.equal(record.pathivagam_status.deed_history_years, 10);
  assert.equal(record.pathivagam_status.land_registry_office, 'Provided office');
  assert.equal(record.pathivagam_status.folio_checked, false);
  assert.equal(record.pathivagam_status.encumbrance_free, false);
  assert.equal(record.road_frontage.road_type, 'gravel');
  assert.equal(record.road_frontage.access_type, 'lane');
});

test('the untouched seller form leaves road, water and document selections unspecified', async () => {
  const source = readFileSync(path.resolve(__dirname, '../src/app/list-property/page.tsx'), 'utf8');
  const parsed = ts.createSourceFile('page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let initializer;
  function find(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'INITIAL_LISTING_FORM') initializer = node.initializer;
    ts.forEachChild(node, find);
  }
  find(parsed);
  assert.ok(initializer, 'The submission form must expose its initial state');
  const form = vm.runInNewContext(ts.transpile(`(${initializer.getText(parsed)})`, {
    target: ts.ScriptTarget.ES2020,
  }));
  const { load: loadService, writes } = createModules();
  await loadService('firestore').submitListing({ ...form, ...baseSubmission });
  const record = writes[0].payload;
  assert.equal(record.road_frontage.road_type, null);
  assert.equal(record.water_source.type, null);
  assert.equal(record.water_source.sweetness_index, 'not_tested');
  assert.equal(record.pathivagam_status.extract_status, 'not_checked');
});

// Public seed snapshot includes the original committed title and its later renamed alias.
// Keep this regression independent of unrelated edits to the executable seeding script.
const knownSeeds = JSON.parse(readFileSync(path.resolve(__dirname, "fixtures/seed-property-records.json"), "utf8"));

function asFirestoreValue(value) {
  if (Array.isArray(value)) return { arrayValue: { values: value.map(asFirestoreValue) } };
  if (typeof value === 'number') return { doubleValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  return { stringValue: value };
}
function buildRow(record) {
  return { document: { name: `projects/public-test-project/databases/(default)/documents/listings/${record.id}`, fields: Object.fromEntries(Object.entries(record).map(([key, value]) => [key, asFirestoreValue(value)])) } };
}

test('known seed records and their historical title stay out of public catalog, direct details, slug lookups and exports', async () => {
  const records = knownSeeds.map((record, index) => ({ ...record, id: `seed-${index}`, slug: `seed-route-${index}` }));
  const recordById = Object.fromEntries(records.map((record) => [record.id, record]));
  const { load: loadService } = createModules({ records, recordById, buildRows: records.map(buildRow) });
  const api = loadService('firestore');
  assert.equal((await api.getProperties()).length, 0);
  for (const record of records) {
    assert.equal(await api.getPropertyById(record.id), null);
    assert.equal(await api.getPropertyById(record.slug), null);
  }
  assert.equal((await loadService('build-listings').getBuildListings()).length, 0);
});

test('generic names or independently updated records are not suppressed as seed inventory', async () => {
  const seed = knownSeeds[0];
  const records = [
    { ...seed, id: 'new-owner-record', created_at: '2026-09-30T10:00:00Z', media_urls: ['/owner-photo.webp'] },
    { ...seed, id: 'updated-record', price: seed.price + 1, media_urls: ['/owner-photo.webp'] },
    { id: 'generic-name', title: seed.title, price: seed.price, status: 'Available', media_urls: ['/owner-photo.webp'] },
  ];
  const { load: loadService } = createModules({ records, recordById: Object.fromEntries(records.map(record => [record.id, record])), buildRows: records.map(buildRow) });
  assert.equal((await loadService('firestore').getProperties()).length, 3);
  assert.ok(await loadService('firestore').getPropertyById('new-owner-record'));
  assert.equal((await loadService('build-listings').getBuildListings()).length, 3);
});

test('development markers cannot publish samples even when production carries the fixture flag', async () => {
  const record = { id: 'flagged-sample', title: 'Development fixture', status: 'Available', is_development_fixture: true, submission_source: 'development_fixture' };
  const { load: loadService } = createModules({ fixtureFlag: 'true', records: [record], recordById: { [record.id]: record }, buildRows: [buildRow(record)] });
  assert.equal((await loadService('firestore').getProperties()).length, 0);
  assert.equal(await loadService('firestore').getPropertyById(record.id), null);
  assert.equal((await loadService('build-listings').getBuildListings()).length, 0);
});

test('the seven generated local property concepts cannot become supplied property photos', () => {
  const names = ['villa_modern', 'villa_island', 'house_family', 'house_heritage', 'apartment_luxury', 'commercial_space', 'land_beach'];
  for (const name of names) {
    const listing = normalizeListing({ media_urls: [`/properties/${name}.webp`, `https://yaalnilam.com/properties/${name}.png?legacy=true`], image: `/properties/${name}.png`, media_assets: [{ url: `/properties/${name}.webp` }] });
    assert.equal(listing.media_urls.length, 0, name);
  }
  const mixed = normalizeListing({ media_urls: ['/properties/villa_modern.webp', 'https://owner.example/properties/villa_modern.webp', '/owner-photo.webp'] });
  assert.equal(mixed.media_urls.length, 2);
  assert.equal(mixed.media_urls[0], 'https://owner.example/properties/villa_modern.webp');
});

test('illustrative fixture imagery is confined to the visibly marked explicit development path', () => {
  const modules = createModules({ env: 'development', fixtureFlag: 'true' });
  const fixtures = modules.load('development-fixtures').DEVELOPMENT_PROPERTY_FIXTURES;
  assert.ok(fixtures.length > 0);
  for (const fixture of fixtures) {
    assert.equal(fixture.is_development_fixture, true);
    assert.equal(fixture.submission_source, 'development_fixture');
    assert.ok(fixture.title.includes('DEVELOPMENT SAMPLE'));
    assert.ok(fixture.media_urls.length > 0);
  }
  const prod = normalizeListing({ ...fixtures[0] });
  assert.equal(prod.is_development_fixture, false);
  assert.equal(prod.media_urls.length, 0);
  assert.equal(createModules({ env: 'development' }).load('development-fixtures').DEVELOPMENT_PROPERTY_FIXTURES.length, 0);
});

test('viewing service rejects fixture leads outside an explicitly connected local demo emulator', async () => {
  const listing = { id: 'prop-001', title: '[DEVELOPMENT SAMPLE] Villa', listing_code: 'DEMO-1', is_development_fixture: true, submission_source: 'development_fixture' };
  for (const options of [
    {},
    { env: 'development', fixtureFlag: 'true' },
    { env: 'development', projectId: 'yaal-nilam', emulatorHost: '127.0.0.1:8180', emulatorConnected: true },
    { env: 'development', projectId: 'demo-yaal-nilam', emulatorHost: 'remote.example:8180', emulatorConnected: true },
    { env: 'development', projectId: 'demo-yaal-nilam', emulatorHost: '127.0.0.1:8180', emulatorConnected: false },
  ]) {
    const { load: loadService, writes } = createModules(options);
    assert.equal(await loadService('firestore').submitViewingRequest({ listing, name: 'Local test', phone: '+94700000000' }), null);
    assert.equal(writes.length, 0);
  }
  const { load: loadService, writes } = createModules({ env: 'development', projectId: 'demo-yaal-nilam', emulatorHost: '127.0.0.1:8180', emulatorConnected: true });
  assert.ok(await loadService('firestore').submitViewingRequest({ listing, name: 'Local test', phone: '+94700000000' }));
  assert.equal(writes.length, 2);
  assert.equal(writes[0].collection, 'viewing_requests');
  assert.equal(writes[1].collection, 'inquiries');
});

test('viewing service rejects unchanged seeded inventory even without a fixture marker', async () => {
  const { load: loadService, writes } = createModules();
  assert.equal(await loadService('firestore').submitViewingRequest({ listing: { ...knownSeeds[0], id: 'seeded-public-record' }, name: 'Local test', phone: '+94700000000' }), null);
  assert.equal(writes.length, 0);
});

test('listing WhatsApp URLs normalize phone formats and keep messages encoded', () => {
  const { buildWhatsAppUrl } = load('marketplace');
  const { BRAND } = load('brand');
  for (const number of ['+94 71 099 5343', '0710995343', '0094710995343']) {
    const url = new URL(buildWhatsAppUrl(number, 'Temple & காணி?'));
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.pathname, '/94710995343');
    assert.equal(url.searchParams.get('text'), 'Temple & காணி?');
  }
  assert.equal(new URL(buildWhatsAppUrl('+1 416 555 0123', 'Hello')).pathname, '/14165550123');
  for (const invalid of ['', 'unknown', '123', '00000']) {
    assert.equal(new URL(buildWhatsAppUrl(invalid, 'Help')).pathname, `/${BRAND.whatsappDigits}`);
  }
});

test('the homepage illustration cannot become a public listing photo', () => {
  const listing = normalizeListing({ id: 'owner-record', status: 'Available', media_urls: ['/design/jaffna-house-illustration.webp', 'https://yaalnilam.com/design/jaffna-house-illustration.webp'] });
  assert.equal(listing.media_urls.length, 0);
});
