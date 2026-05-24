export function initLemonSqueezy() {
  // Re-initialize Lemon.js after React mounts — required for React apps
  // because Lemon.js CDN script may run before components are rendered
  if (typeof window !== 'undefined' && window.createLemonSqueezy) {
    window.createLemonSqueezy();
  }

  // Set up event handler for checkout events
  if (typeof window !== 'undefined' && window.LemonSqueezy) {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        if (event.event === 'Checkout.Success') {
          window.dispatchEvent(
            new CustomEvent('lemonsqueezy:checkout:success', {
              detail: event.data,
            })
          );
        }
      },
    });
  }
}

export function openProCheckout(userId, userEmail) {
  const baseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL;
  if (!baseUrl) {
    console.error('LemonSqueezy checkout URL not configured');
    return;
  }

  const checkoutUrl = new URL(baseUrl);
  checkoutUrl.searchParams.set('checkout[custom][clerk_id]', userId);
  checkoutUrl.searchParams.set('checkout[email]', userEmail);

  if (typeof window !== 'undefined' && window.createLemonSqueezy) {
    window.createLemonSqueezy();
  }

  if (typeof window !== 'undefined' && window.LemonSqueezy) {
    window.LemonSqueezy.Url.Open(checkoutUrl.toString());
  } else {
    console.warn('Lemon.js not loaded, falling back to new tab');
    window.open(checkoutUrl.toString(), '_blank');
  }
}
