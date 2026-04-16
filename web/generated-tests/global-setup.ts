/**
 * Global test setup for all tests.
 * Runs before all test suites.
 */

import path from 'path';

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_API_URL = process.env.BASE_URL || 'http://localhost:3000';

  // Suppress specific console messages during tests
  global.console = {
    ...console,
    error: jest.fn((...args: any[]) => {
      if (args[0]?.includes?.('Warning:')) return;
      console.error(...args);
    }),
  };

  return () => {
    // Cleanup
  };
}
