'use client';

import { createMachine } from 'xstate';

const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'cart',
  states: {
    cart: {
      on: {
        PROCEED_TO_CHECKOUT: 'checkout',
      },
    },
    checkout: {
      on: {
        SUBMIT_PAYMENT: 'processingPayment',
        BACK_TO_CART: 'cart',
      },
    },
    processingPayment: {
      invoke: {
        id: 'processPayment',
        src: 'processPaymentService',
        on: {
          DONE: 'confirmation',
          ERROR: 'paymentError',
        },
      },
    },
    confirmation: {
      type: 'final',
    },
    paymentError: {
      on: {
        RETRY_PAYMENT: 'processingPayment',
        BACK_TO_CHECKOUT: 'checkout',
      },
    },
  },
});

export default checkoutMachine; 