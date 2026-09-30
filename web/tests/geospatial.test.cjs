const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

function loadTsModule(relativePath) {
  const filename = path.resolve(__dirname, relativePath);
  const mod = { exports: {} };
  const transpiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(transpiled, { module: mod, exports: mod.exports, console }, { filename });
  return mod.exports;
}

const geo = loadTsModule('../src/lib/geospatial.ts');

test('Pillar 2: Haversine distance calculations from Northern landmarks', () => {
  // Distance between Nallur Kovil (9.6744, 80.0294) and Jaffna Railway Station (9.6672, 80.0212)
  const d1 = geo.calculateHaversineDistance(9.6744, 80.0294, 9.6672, 80.0212);
  assert.ok(d1 > 1.0 && d1 < 1.4, `Expected ~1.2 km between Nallur and Station, got ${d1}`);

  // Distance between Jaffna Town (9.6615, 80.0255) and Palaly Airport (9.7915, 80.0708)
  const d2 = geo.calculateHaversineDistance(9.6615, 80.0255, 9.7915, 80.0708);
  assert.ok(d2 > 14.5 && d2 < 16.5, `Expected ~15 km to Palaly Airport, got ${d2}`);
});

test('Pillar 2: Landmark proximity list sorted by distance with travel estimates', () => {
  const property = { lat: 9.6744, lng: 80.0294 }; // Nallur property
  const proximities = geo.getLandmarkProximities(property, 5);

  assert.equal(proximities.length, 5);
  // Nearest landmark should be Nallur Kandaswamy Temple (distance ~ 0 km)
  assert.equal(proximities[0].id, 'nallur_kandaswamy_temple');
  assert.ok(proximities[0].distance_km < 0.2);
  assert.equal(proximities[0].driving_minutes, 1);
  assert.ok(proximities[0].name_ta.includes('நல்லூர்'));

  // Ensure sorted in ascending distance order
  for (let i = 0; i < proximities.length - 1; i++) {
    assert.ok(proximities[i].distance_km <= proximities[i + 1].distance_km);
  }
});

test('Pillar 2: Flood and Soil Zone risk classification for Jaffna Peninsula', () => {
  // Valikamam high ground / sweet karstic limestone belt
  const valikamam = geo.assessFloodAndSoilZone(9.678, 80.025, 'nallur');
  assert.equal(valikamam.elevation_zone, 'high_ground');
  assert.equal(valikamam.flood_risk, 'minimal');
  assert.equal(valikamam.risk_level, 'safe');
  assert.equal(valikamam.soil_type, 'red_latosol_calcic');
  assert.equal(valikamam.aquifer_quality, 'sweet_karstic');

  // Low-lying coastal / lagoon margin
  const coastal = geo.assessFloodAndSoilZone(9.650, 80.010, 'gurunagar');
  assert.equal(coastal.elevation_zone, 'low_lying');
  assert.equal(coastal.flood_risk, 'moderate_seasonal');
  assert.equal(coastal.risk_level, 'caution');
  assert.equal(coastal.aquifer_quality, 'brackish_lagoon');

  // Vadamarachchi coastal sand ridge
  const pointPedro = geo.assessFloodAndSoilZone(9.825, 80.240, 'point-pedro');
  assert.equal(pointPedro.soil_type, 'sandy_regosol');
  assert.equal(pointPedro.aquifer_quality, 'fresh_sand_lens');
});

test('Pillar 2: Boundary Polygon area & perimeter metric calculation', () => {
  // A rectangular parcel of approx 40m x 25m = 1000 sq m (~39.5 perches)
  const ring = [
    [80.029000, 9.674000],
    [80.029228, 9.674000],
    [80.029228, 9.674359],
    [80.029000, 9.674359],
  ];

  const metrics = geo.calculateBoundaryMetrics(ring);
  assert.ok(metrics.areaSqMeters >= 950 && metrics.areaSqMeters <= 1050, `Area in sq meters: ${metrics.areaSqMeters}`);
  assert.ok(metrics.perches >= 37 && metrics.perches <= 42, `Perches: ${metrics.perches}`);
  assert.ok(metrics.lachams >= 2.3 && metrics.lachams <= 2.7, `Lachams: ${metrics.lachams}`);
  assert.ok(metrics.perimeterMeters >= 120 && metrics.perimeterMeters <= 140, `Perimeter: ${metrics.perimeterMeters}`);
});

test('Pillar 2: GeoJSON polygon parser & validator', () => {
  const validGeoJson = JSON.stringify({
    type: 'Polygon',
    coordinates: [
      [[80.029, 9.674], [80.030, 9.674], [80.030, 9.675], [80.029, 9.675], [80.029, 9.674]],
    ],
  });

  const parsed = geo.parseGeoJsonPolygon(validGeoJson);
  assert.ok(parsed !== null);
  assert.equal(parsed.type, 'Polygon');
  assert.equal(parsed.coordinates[0].length, 5);

  // Invalid JSON or insufficient points returns null
  assert.equal(geo.parseGeoJsonPolygon('invalid'), null);
  assert.equal(geo.parseGeoJsonPolygon({ type: 'Point', coordinates: [80, 9] }), null);
});
