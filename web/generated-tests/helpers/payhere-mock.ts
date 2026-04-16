/**
 * PayHere mock for testing payment flows.
 * Supports sandbox mode payment processing.
 */

export const mockPayHere = {
  startPayment: jest.fn((paymentObject) => {
    const { onApproved, onDismissed, onError } = paymentObject;
    // Simulate successful payment in tests
    setTimeout(() => {
      if (onApproved) {
        onApproved({
          orderid: paymentObject.merchant_id + '_' + Date.now(),
          paymentid: 'PID' + Math.random().toString().slice(2),
          amount: paymentObject.amount,
          status_code: 2, // Success
          md5sig: 'test-signature',
        });
      }
    }, 100);
  }),
  isPreApproved: jest.fn(() => false),
  oneTimeCharge: jest.fn().mockResolvedValue({
    status: 'success',
    msg: 'Payment successful',
  }),
};

// Attach to window for browser tests
if (typeof window !== 'undefined') {
  (window as any).PayHere = mockPayHere;
}

export default mockPayHere;
