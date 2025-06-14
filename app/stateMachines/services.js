// This file will contain services used by XState machines

// Placeholder service to simulate payment processing
const processPaymentService = (context, event) => {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation (e.g., API call)
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% chance of success

      if (success) {
        console.log('Payment successful!');
        resolve('Payment successful');
      } else {
        console.error('Payment failed.');
        reject('Payment failed');
      }
    }, 2000); // Simulate a 2-second delay
  });
};

export const services = {
  processPaymentService,
}; 