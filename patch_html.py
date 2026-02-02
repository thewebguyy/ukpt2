
import os

def replace_script_block(filepath, content_to_find, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content_to_find not in content:
        print(f"Content '{content_to_find}' not found in {filepath}")
        return False
    
    chunk_pos = content.find(content_to_find)
    start_pos = content.rfind('<script', 0, chunk_pos)
    end_pos = content.find('</script>', chunk_pos)
    
    if start_pos == -1 or end_pos == -1:
        print(f"Could not find surrounding script tags in {filepath}")
        return False
    
    new_content = content[:start_pos] + replacement + content[end_pos + len('</script>'):]
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print(f"Successfully updated {filepath}")
    return True

# Checkout update
checkout_path = r'c:\Users\pstma\OneDrive\Documents\uk\checkout.html'
replace_script_block(checkout_path, 'let currentOrderId;', """<script type="module">
    async function waitForServices() {
      return new Promise((resolve) => {
        const check = () => {
          if (window.getCart && typeof Stripe !== 'undefined') {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }

    async function init() {
      try {
        await waitForServices();
        const cart = window.getCart();
        if (!cart || cart.length === 0) {
          window.location.href = 'shop.html';
          return;
        }
        renderBasket(cart);
        updateProgress(cart);
        if (window.AuthService) {
          const user = window.AuthService.getCurrentUser_Sync();
          if (user) {
            document.getElementById('email').value = user.email || '';
            document.getElementById('name').value = user.name || '';
          }
        }
        const overlay = document.getElementById('checkout-loading-overlay');
        if (overlay) {
          overlay.style.opacity = '0';
          setTimeout(() => overlay.style.display = 'none', 500);
        }
      } catch (error) {
        console.error("Init Error:", error);
      }
    }

    function renderBasket(cart) {
      const list = document.getElementById('checkout-items-list');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById('header-item-count').textContent = `${totalItems} items`;
      document.getElementById('summary-item-count').textContent = `${totalItems} items`;
      list.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        const originalPrice = (item.price * 1.2).toFixed(2);
        return `
            <div class="basket-item">
                <div class="product-meta">
                    <img src="${item.imageUrl}" class="product-thumb" alt="${item.name}">
                    <div class="product-info">
                        <h3><a href="product.html?id=${item.productId}">${item.name}</a></h3>
                        ${item.customization && item.customization.size ? `<span class="badge-pill">${item.customization.size}</span>` : ''}
                        <span class="variant-text">${item.customization && item.customization.color ? item.customization.color : 'Standard'}</span>
                    </div>
                </div>
                <div class="quantity-col">
                    <div class="quantity-controls">
                        <button type="button" onclick="window.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button type="button" onclick="window.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="price-note">× <span class="discount">£${item.price.toFixed(2)}</span> <span class="original">£${originalPrice}</span></div>
                </div>
                <div class="total-col">
                    <button class="remove-btn" onclick="window.removeFromCart('${item.id}')">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                    <div class="item-total-price">£${itemTotal.toFixed(2)}</div>
                    <div class="total-original">£${(itemTotal * 1.2).toFixed(2)}</div>
                </div>
            </div>`;
      }).join('');
      updateSummary(cart);
    }

    function updateSummary(cart) {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.20;
      const shipping = subtotal >= 100 ? 0 : 4.99;
      const total = subtotal + tax + shipping;
      document.getElementById('summary-subtotal').textContent = `£${subtotal.toFixed(2)}`;
      document.getElementById('summary-tax').textContent = `£${tax.toFixed(2)}`;
      document.getElementById('summary-total').textContent = `£${total.toFixed(2)}`;
    }

    function updateProgress(cart) {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const freeShippingThreshold = 100;
      const barMax = 600;
      const percentage = Math.min((subtotal / barMax) * 100, 100);
      document.getElementById('shipping-fill').style.width = `${percentage}%`;
      if (subtotal < freeShippingThreshold) {
        const diff = (freeShippingThreshold - subtotal).toFixed(2);
        document.getElementById('shipping-progress-msg').textContent = `Spend £${diff} more for Free Shipping!`;
      } else {
        document.getElementById('shipping-progress-msg').textContent = `You've unlocked FREE Shipping!`;
        document.getElementById('shipping-progress-msg').classList.add('text-success');
      }
    }

    window.addEventListener('cartUpdated', init);

    document.getElementById('proceed-to-checkout').addEventListener('click', () => {
      document.getElementById('shipping-form-container').style.display = 'block';
      document.getElementById('payment-element-container').style.display = 'block';
      document.getElementById('shipping-form-container').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('payment-element').style.display = 'none';
      document.querySelector('#payment-element-container h2').textContent = 'Confirm Details';
    });

    async function startSecureCheckout() {
      setLoading(true);
      try {
        const cart = window.getCart();
        const items = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));
        const response = await fetch('http://localhost:3001/api/checkout/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: items,
            customerInfo: {
              email: document.getElementById('email').value,
              name: document.getElementById('name').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              postcode: document.getElementById('postcode').value
            },
            userId: window.AuthService && window.AuthService.getCurrentUser_Sync() ? window.AuthService.getCurrentUser_Sync().uid : 'guest'
          })
        });
        const { sessionId } = await response.json();
        const stripeObj = await window.initializeStripe();
        await stripeObj.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error("Checkout Failed:", error);
        alert('Checkout error: ' + error.message);
        setLoading(false);
      }
    }

    document.getElementById('submit-payment').addEventListener('click', async () => {
      if (!document.getElementById('email').value) return alert('Email required');
      await startSecureCheckout();
    });

    function setLoading(isLoading) {
      const btn = document.getElementById('submit-payment');
      if (btn) btn.disabled = isLoading;
      const spinner = document.getElementById('spinner');
      if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
      const txt = document.getElementById('button-text');
      if (txt) txt.style.display = isLoading ? 'none' : 'inline';
    }

    init();
</script>""")

# Order Confirmation update
conf_path = r'c:\Users\pstma\OneDrive\Documents\uk\order-confirmation.html'
replace_script_block(conf_path, 'payment_intent_client_secret', """<script type="module">
    function showError(msg) {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'block';
        document.getElementById('error-message').textContent = msg;
    }
    function showSuccess(orderId) {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('success-state').style.display = 'block';
        document.getElementById('order-number-display').textContent = orderId;
    }

    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order');
      const sessionId = urlParams.get('session_id');
      if (!orderId) { showError("No order ID"); return; }
      if (!sessionId) { showSuccess(orderId); return; }
      try {
        const response = await fetch('http://localhost:3001/api/orders/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, sessionId })
        });
        const result = await response.json();
        if (result.status === 'success') {
          showSuccess(orderId);
          if (window.clearCart) window.clearCart();
        } else { showError(result.error); }
      } catch (e) { showSuccess(orderId); }
    }
    init();
</script>""")
