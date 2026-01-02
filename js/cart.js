// Shopping Cart Functionality for Creative Merch UK

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Add item to cart
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartDisplay();
  renderCart();
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartDisplay();
  renderCart();
}

// Update quantity
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartDisplay();
      renderCart();
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.add('has-items');
  } else {
    cartCount.textContent = '';
    cartCount.classList.remove('has-items');
  }
}

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  const cartSubtotal = document.getElementById('cart-subtotal');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }
  
  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  
  let subtotal = 0;
  
  cartItemsContainer.innerHTML = cart.map(item => {
    subtotal += item.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-image"></div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">£${item.price.toFixed(2)} × ${item.quantity}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">×</button>
      </div>
    `;
  }).join('');
  
  if (cartSubtotal) {
    cartSubtotal.textContent = '£' + subtotal.toFixed(2);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  renderCart();
});