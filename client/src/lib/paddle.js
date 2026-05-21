export function initPaddle() {
  if (typeof window === 'undefined' || !window.Paddle) return;
  window.Paddle.Setup({
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
    eventCallback(data) {
      if (data.name === 'checkout.completed') {
        window.dispatchEvent(new CustomEvent('paddle:checkout:completed'));
      }
    },
  });
}

export function openProCheckout(userEmail, userId) {
  if (!window.Paddle) {
    console.error('Paddle.js not loaded');
    return;
  }
  window.Paddle.Checkout.open({
    items: [{ priceId: import.meta.env.VITE_PADDLE_PRICE_ID, quantity: 1 }],
    customer: { email: userEmail },
    customData: { clerk_id: userId },
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      locale: 'en',
    },
  });
}
