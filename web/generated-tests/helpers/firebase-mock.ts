/**
 * Firebase mock for testing.
 * Provides Auth, Firestore, and Storage mocks.
 */

export const mockAuth = {
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((callback) => {
    callback({ uid: 'test-user-123' });
    return jest.fn(); // unsubscribe
  }),
  currentUser: { uid: 'test-user-123', email: 'test@example.com' },
};

export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ id: 'test-doc', name: 'Test' }),
      }),
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    })),
    add: jest.fn().mockResolvedValue({ id: 'new-doc-123' }),
    query: jest.fn(),
    where: jest.fn(() => ({ get: jest.fn() })),
  })),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn((query, callback) => {
    callback({
      docs: [{ id: 'doc-1', data: () => ({ name: 'Test' }) }],
    });
    return jest.fn(); // unsubscribe
  }),
};

export const mockStorage = {
  ref: jest.fn(() => ({
    put: jest.fn().mockResolvedValue({ ref: { getDownloadURL: jest.fn() } }),
    getDownloadURL: jest.fn().mockResolvedValue('https://example.com/image.jpg'),
  })),
};

export const initializeApp = jest.fn(() => ({}));
export const getAuth = jest.fn(() => mockAuth);
export const getFirestore = jest.fn(() => mockFirestore);
export const getStorage = jest.fn(() => mockStorage);
