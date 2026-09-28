const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

// Exercise the real Zustand hydration path against isolated local storage.
const filename = path.resolve(__dirname, '../src/lib/store.ts');
const js = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function createStoredState(state, version) {
  const storage = new Map([['yaal-nilam-public-store', JSON.stringify({ state, version })]]);
  const storeModule = { exports: {} };
  vm.runInNewContext(js, {
    module: storeModule, exports: storeModule.exports, require,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  }, { filename });
  return { store: storeModule.exports.useStore, storage };
}

for (const version of [undefined, 0, 1, 2]) {
  test(`stored version ${version ?? 'unversioned'} keeps preferences and rejects cached identity/UI`, async () => {
    const { store, storage } = createStoredState({
      locale: 'en',
      compareIds: ['PropertyA', 'PropertyB', 'PropertyA', '', 42, null, '  PropertyC  ', 'PropertyD'],
      user: { id: 'forged-account', user_type: 'admin' },
      isAuthenticated: true,
      mobileMenuOpen: true,
      loginModalOpen: true,
      signupModalOpen: true,
      filters: { search: 'cached filter' },
      setLocale: 'not a function',
    }, version);
    await store.persist.rehydrate();
    const current = store.getState();
    assert.equal(current.locale, 'en');
    assert.deepEqual(Array.from(current.compareIds), ['PropertyA', 'PropertyB', 'PropertyC']);
    assert.equal(current.user, null);
    assert.equal(current.isAuthenticated, false);
    assert.equal(current.mobileMenuOpen, false);
    assert.equal(current.loginModalOpen, false);
    assert.equal(current.signupModalOpen, false);
    assert.deepEqual(Object.keys(current.filters), []);
    assert.equal(typeof current.setLocale, 'function');

    current.setLocale('ta');
    assert.deepEqual(JSON.parse(storage.get('yaal-nilam-public-store')), {
      state: { locale: 'ta', compareIds: ['PropertyA', 'PropertyB', 'PropertyC'] }, version: 2,
    });
  });
}

test('invalid stored preferences use Tamil and an empty comparison list', async () => {
  for (const payload of [null, 'invalid', [], { locale: 'fr', compareIds: 'PropertyA' }, { locale: {}, compareIds: [null, 1, {}, '', ' '] }]) {
    const { store } = createStoredState(payload, 2);
    await store.persist.rehydrate();
    assert.equal(store.getState().locale, 'ta');
    assert.deepEqual(Array.from(store.getState().compareIds), []);
  }
});

test('an explicit Tamil preference survives migration without cached auth', async () => {
  const { store } = createStoredState({ locale: 'ta', compareIds: ['PropertyA'], isAuthenticated: true }, 0);
  await store.persist.rehydrate();
  assert.equal(store.getState().locale, 'ta');
  assert.deepEqual(Array.from(store.getState().compareIds), ['PropertyA']);
  assert.equal(store.getState().isAuthenticated, false);
});

test('rehydration cannot replace an identity already restored by Firebase', async () => {
  const { store, storage } = createStoredState({ locale: 'en', user: { id: 'cached-user' }, isAuthenticated: false }, 2);
  const staleStorage = storage.get('yaal-nilam-public-store');
  const currentUser = { id: 'authenticated-user', name: 'Test account', email: '', phone: '', user_type: 'buyer' };
  store.getState().setUser(currentUser);
  storage.set('yaal-nilam-public-store', staleStorage);
  await store.persist.rehydrate();
  assert.equal(store.getState().user, currentUser);
  assert.equal(store.getState().isAuthenticated, true);
  assert.equal(store.getState().locale, 'en');
});
