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

const units = loadTsModule('../../shared/units.ts');
const currency = loadTsModule('../../shared/currency.ts');

test('Pillar 1: Regional Land Unit Conversions (Perch <-> Lacham <-> Acre <-> Sq Ft)', () => {
  // 1 Lacham = 16 Perches
  assert.equal(units.PERCHES_PER_LACHAM, 16);
  assert.equal(units.perchesToLachams(16), 1);
  assert.equal(units.perchesToLachams(32), 2);
  assert.equal(units.perchesToLachams(8), 0.5);
  assert.equal(units.lachamsToPerches(1), 16);
  assert.equal(units.lachamsToPerches(2.5), 40);

  // 1 Acre = 160 Perches = 10 Lachams
  assert.equal(units.toPerches(1, 'acre'), 160);
  assert.equal(units.perchesToLachams(160), 10);

  // 1 Perch = 272.25 Sq Ft
  assert.equal(units.SQFT_PER_PERCH, 272.25);
  assert.equal(units.toPerches(272.25, 'sqft'), 1);
});

test('Pillar 1: Auto-calculate price-per-perch and price-per-lacham', () => {
  // Seller inputs 16 Perches (1 Lacham) for LKR 16,000,000
  const breakdown1 = units.calculateLandBreakdown(16, 'perch', 16000000);
  assert.equal(breakdown1.perches, 16);
  assert.equal(breakdown1.lachams, 1);
  assert.equal(breakdown1.pricePerPerch, 1000000); // 1M per perch
  assert.equal(breakdown1.pricePerLacham, 16000000); // 16M per lacham
  assert.ok(breakdown1.formatted.pricePerUnitEn.includes('perch'));
  assert.ok(breakdown1.formatted.pricePerUnitEn.includes('lacham'));

  // Seller inputs 2 Lachams for LKR 32,000,000
  const breakdown2 = units.calculateLandBreakdown(2, 'lacham', 32000000);
  assert.equal(breakdown2.perches, 32);
  assert.equal(breakdown2.lachams, 2);
  assert.equal(breakdown2.pricePerPerch, 1000000);
  assert.equal(breakdown2.pricePerLacham, 16000000);

  // Seller inputs 15 Perches in Nallur for LKR 18,000,000
  const breakdown3 = units.calculateLandBreakdown(15, 'perch', 18000000);
  assert.equal(breakdown3.perches, 15);
  assert.equal(breakdown3.lachams, 0.94); // rounded to 2 decimals
  assert.equal(breakdown3.pricePerPerch, 1200000); // 1.2M per perch
  assert.equal(breakdown3.pricePerLacham, 19200000); // 19.2M per lacham
});

test('Pillar 1: Dual-Currency Engine (LKR, CAD, GBP, AUD, USD, EUR)', () => {
  // 1 USD = 305 LKR, 1 GBP = 395 LKR, 1 CAD = 225 LKR, 1 AUD = 200 LKR, 1 EUR = 335 LKR
  const testPriceLkr = 30500000; // 30.5M LKR

  const usd = currency.convertFromLkr(testPriceLkr, 'USD');
  assert.equal(Math.round(usd), 100000); // $100k

  const gbp = currency.convertFromLkr(testPriceLkr, 'GBP');
  assert.equal(Math.round(gbp), Math.round(30500000 / 395));

  const cad = currency.convertFromLkr(testPriceLkr, 'CAD');
  assert.equal(Math.round(cad), Math.round(30500000 / 225));

  const aud = currency.convertFromLkr(testPriceLkr, 'AUD');
  assert.equal(Math.round(aud), Math.round(30500000 / 200));

  const eur = currency.convertFromLkr(testPriceLkr, 'EUR');
  assert.equal(Math.round(eur), Math.round(30500000 / 335));

  // Convert back to LKR
  assert.equal(currency.convertToLkr(100000, 'USD'), 30500000);

  // Format tests
  const formattedUsd = currency.formatCurrency(100000, 'USD');
  assert.ok(formattedUsd.includes('$') || formattedUsd.includes('USD'));

  const estimates = currency.getAllCurrencyEstimates(testPriceLkr);
  assert.ok(estimates.USD);
  assert.ok(estimates.CAD);
  assert.ok(estimates.GBP);
  assert.ok(estimates.AUD);
  assert.ok(estimates.EUR);
  assert.ok(estimates.LKR);
});
