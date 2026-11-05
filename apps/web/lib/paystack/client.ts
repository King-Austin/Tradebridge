export interface PaystackConfig {
  email: string;
  amountKobo: number; // in kobo (NGN * 100)
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (response: { reference: string; trxref: string; status: string }) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => {
        openIframe: () => void;
      };
    };
  }
}

/**
 * Loads and initializes Paystack inline popup modal for fiat payments.
 */
export function openPaystackPayment({
  email,
  amountKobo,
  reference,
  metadata,
  onSuccess,
  onClose,
}: PaystackConfig) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';

  // Check if Paystack script is already loaded
  if (typeof window !== 'undefined' && window.PaystackPop) {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountKobo,
      currency: 'NGN',
      ref: reference,
      metadata,
      callback: onSuccess,
      onClose,
    });
    handler.openIframe();
    return;
  }

  // Load dynamically if not present
  const script = document.createElement('script');
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  script.onload = () => {
    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amountKobo,
        currency: 'NGN',
        ref: reference,
        metadata,
        callback: onSuccess,
        onClose,
      });
      handler.openIframe();
    }
  };
  document.body.appendChild(script);
}

