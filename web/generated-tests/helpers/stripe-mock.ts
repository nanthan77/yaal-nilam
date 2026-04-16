/**
 * Stripe mock for testing payment flows.
 * Provides loadStripe, Elements, and hook mocks.
 */

export const mockStripe = {
  elements: jest.fn(() => ({
    getElement: jest.fn(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      update: jest.fn(),
    })),
    create: jest.fn(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      update: jest.fn(),
    })),
  })),
  createPaymentMethod: jest.fn().mockResolvedValue({
    paymentMethod: { id: 'pm_test123' },
  }),
  confirmCardPayment: jest.fn().mockResolvedValue({
    paymentIntent: { status: 'succeeded' },
  }),
  confirmCardSetup: jest.fn().mockResolvedValue({
    setupIntent: { status: 'succeeded' },
  }),
};

export const loadStripe = jest.fn().mockResolvedValue(mockStripe);

export const Elements = ({ children }: any) => <>{children}</>;
export const CardElement = () => <div data-testid="card-element" />;
export const useStripe = () => mockStripe;
export const useElements = () => mockStripe.elements();

jest.mock('@stripe/react-stripe-js', () => ({
  loadStripe,
  Elements,
  CardElement,
  useStripe,
  useElements,
}));
