// ============================================
// CART.JS - Complete Cart Management System
// Creative Merch UK
// ============================================

// Initialize cart from localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Add item to cart
function addToCart(id, name, price, imageUrl = '', quantity = 1) {
  const cart = getCart();

  // Check if item already exists
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      imageUrl: imageUrl,
      quantity: quantity
    });
  }

  saveCart(cart);
}

// Remove item from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
}

// Update item quantity
function updateQuantity(id, newQuantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = newQuantity;
      saveCart(cart);
    }
  }
}

// Get cart total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem('cart');
  updateCartDisplay();
}

// Update cart display in UI
function updateCartDisplay() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyContainer = document.getElementById('cart-empty');
  const cartSummaryContainer = document.getElementById('cart-summary');
  const cartCountBadge = document.getElementById('cart-count');
  const cartSubtotalElement = document.getElementById('cart-subtotal');

  // Update cart count badge
  const count = getCartCount();
  if (cartCountBadge) {
    cartCountBadge.textContent = count;
    if (count > 0) {
      cartCountBadge.classList.add('has-items');
    } else {
      cartCountBadge.classList.remove('has-items');
    }
  }

  // If cart is empty
  if (cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (cartEmptyContainer) cartEmptyContainer.style.display = 'block';
    if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
    return;
  }

  // Hide empty message, show summary
  if (cartEmptyContainer) cartEmptyContainer.style.display = 'none';
  if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';

  // Render cart items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          ${item.imageUrl ?
        `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: cover;">` :
        `<div style="width: 100%; height: 100%; background: var(--color-grey-light); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--color-grey);">No Image</div>`
      }
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">£${item.price.toFixed(2)} × ${item.quantity}</div>
          <div class="cart-item-total" style="font-weight: 600; margin-top: 0.25rem;">£${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove ${escapeHtml(item.name)} from cart">
          ×
        </button>
      </div>
    `).join('');
  }

  // Update subtotal
  const total = getCartTotal();
  if (cartSubtotalElement) {
    cartSubtotalElement.textContent = `£${total.toFixed(2)}`;
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize cart display when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartDisplay);
} else {
  updateCartDisplay();
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.getCart = getCart;
  window.getCartTotal = getCartTotal;
  window.getCartCount = getCartCount;
  window.clearCart = clearCart;
  window.updateCartDisplay = updateCartDisplay;
}