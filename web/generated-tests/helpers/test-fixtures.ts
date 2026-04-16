/**
 * Test fixtures and mock data for consistent testing.
 */

export const mockUser = {
  uid: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
};

export const mockUserCredential = {
  user: mockUser,
  operationType: 'signIn',
};

export const mockProduct = {
  id: 'product-123',
  name: 'Test Product',
  description: 'A test product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  category: 'electronics',
  stock: 10,
};

export const mockOrder = {
  id: 'order-123',
  userId: 'user-123',
  items: [mockProduct],
  total: 99.99,
  status: 'pending',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockPaymentIntent = {
  id: 'pi_test123',
  amount: 9999,
  currency: 'usd',
  status: 'succeeded',
  client_secret: 'pi_test123_secret',
};

export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const testApiResponse = {
  success: true,
  data: { id: '123', name: 'Test' },
  timestamp: new Date().toISOString(),
};

export const testErrorResponse = {
  success: false,
  error: 'Test error message',
  code: 'TEST_ERROR',
  timestamp: new Date().toISOString(),
};
