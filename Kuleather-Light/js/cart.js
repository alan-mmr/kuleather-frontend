// ==========================================================================
// KULEATHER CART ENGINE (localStorage-based)
// ==========================================================================

const CART_KEY = 'kuleather_cart';
const PROMO_KEY = 'kuleather_promo';

// Helper to get active user
function getActiveUser() {
  try {
    return JSON.parse(localStorage.getItem('kuleather_active_user')) || null;
  } catch (e) {
    return null;
  }
}

// 1. Get Cart from localStorage (user-scoped)
function getCart() {
  const user = getActiveUser();
  if (!user) return [];
  try {
    const fullCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return fullCart.filter(item => item.userId === user.id);
  } catch (e) {
    console.error('Error loading cart:', e);
    return [];
  }
}

// 2. Save Cart to localStorage (user-scoped)
function saveCart(userCart) {
  const user = getActiveUser();
  if (!user) {
    if (typeof window.showToast === 'function') {
      window.showToast('Silakan login terlebih dahulu untuk menyimpan keranjang.', 'error');
    }
    return;
  }
  try {
    let fullCart = [];
    try {
      fullCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {}
    
    // Remove current user's items
    fullCart = fullCart.filter(item => item.userId !== user.id);
    
    // Add new items with userId
    const decoratedCart = userCart.map(item => ({ ...item, userId: user.id }));
    fullCart = [...fullCart, ...decoratedCart];
    
    localStorage.setItem(CART_KEY, JSON.stringify(fullCart));
    // Trigger global synchronization of cart badges
    if (typeof window.updateCartBadgeGlobal === 'function') {
      window.updateCartBadgeGlobal();
    }
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

// 3. Add Item to Cart
function addToCart(product) {
  const user = getActiveUser();
  if (!user) {
    if (typeof window.showToast === 'function') {
      window.showToast('Silakan login terlebih dahulu untuk berbelanja.', 'error');
    }
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1000);
    return;
  }
  // Expected product structure: { id, name, price, photo, variant, qty }
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id && item.variant === product.variant);

  if (existingItem) {
    existingItem.qty += product.qty || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo,
      variant: product.variant || 'Default',
      qty: product.qty || 1
    });
  }

  saveCart(cart);
  if (typeof window.showToast === 'function') {
    window.showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
  }
}

// 4. Remove Item from Cart
function removeFromCart(productId, variant) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.variant === variant));
  saveCart(cart);
  if (typeof window.showToast === 'function') {
    window.showToast('Produk dihapus dari keranjang.', 'info');
  }
}

// 5. Update Quantity of Item
function updateQty(productId, variant, newQty) {
  if (newQty < 1) {
    removeFromCart(productId, variant);
    return;
  }
  
  const cart = getCart();
  const item = cart.find(item => item.id === productId && item.variant === variant);
  if (item) {
    item.qty = newQty;
    saveCart(cart);
  }
}

// 6. Get Cart Count (Total items count)
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

// 7. Get Cart Total (Item prices sum)
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// 8. Clear Cart
function clearCart() {
  const user = getActiveUser();
  if (!user) return;
  try {
    let fullCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    fullCart = fullCart.filter(item => item.userId !== user.id);
    localStorage.setItem(CART_KEY, JSON.stringify(fullCart));
    localStorage.removeItem(PROMO_KEY);
    if (typeof window.updateCartBadgeGlobal === 'function') {
      window.updateCartBadgeGlobal();
    }
  } catch (e) {}
}

// 9. Format IDR Helper
function idr(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);
}

// ==========================================================================
// CART PAGE RENDERING & CALCULATIONS (Executed only on cart.html)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSummaryContainer = document.getElementById('cart-summary');
  
  if (!cartItemsContainer) return; // Exit if not on cart page

  const user = getActiveUser();
  if (!user) {
    cartItemsContainer.innerHTML = `
      <div class="text-center" style="padding: var(--space-3xl) 0;">
        <svg style="margin:0 auto var(--space-md) auto; color:var(--text-muted);" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <h3 class="heading-3 mb-sm">Silakan Login Terlebih Dahulu</h3>
        <p class="text-muted mb-lg">Anda harus masuk ke akun Anda untuk melihat keranjang belanja.</p>
        <a href="auth.html" class="btn btn-primary">Masuk / Daftar</a>
      </div>
    `;
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    
    const promoSection = document.querySelector('.promo-code-section');
    if (promoSection) promoSection.style.display = 'none';
    
    const shippingSection = document.querySelector('.shipping-section');
    if (shippingSection) shippingSection.style.display = 'none';
    
    return;
  }

  // Load shipping rates dynamically
  let shippingRates = {
    'jne-reg': 18000,
    'jne-yes': 42000,
    'sicepat': 15000
  };
  try {
    const settings = JSON.parse(localStorage.getItem('kuleather_site_settings'));
    if (settings && settings.shippingRates) {
      shippingRates = settings.shippingRates;
    }
  } catch (e) {
    console.error('Error loading shipping rates:', e);
  }

  let selectedShipping = 'jne-reg';

  // Listen to shipping selection
  const shippingSelector = document.getElementById('shipping-courier');
  if (shippingSelector) {
    selectedShipping = shippingSelector.value;
    shippingSelector.addEventListener('change', (e) => {
      selectedShipping = e.target.value;
      renderSummary();
    });
  }

  // Handle Promo Codes dynamically
  let discountPercent = 0;
  const promoInput = document.getElementById('promo-code');
  const promoBtn = document.getElementById('promo-apply-btn');
  const promoMsg = document.getElementById('promo-message');

  if (promoBtn && promoInput) {
    function getPromoDiscount(code) {
      const promos = JSON.parse(localStorage.getItem('kuleather_promo_codes')) || [];
      return promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
    }

    // Check if promo already applied
    const savedPromo = localStorage.getItem(PROMO_KEY);
    if (savedPromo) {
      const promo = getPromoDiscount(savedPromo);
      if (promo) {
        const voucherHistory = JSON.parse(localStorage.getItem('kuleather_voucher_history')) || [];
        const alreadyUsed = voucherHistory.some(h => h.userId === user.id && h.code.toUpperCase() === savedPromo.toUpperCase());
        const subtotal = getCartTotal();
        const underMin = promo.minOrder && subtotal < promo.minOrder;
        
        if (!alreadyUsed && !underMin && (promo.usageLimit === undefined || promo.usageCount < promo.usageLimit)) {
          discountPercent = promo.discount;
          promoInput.value = savedPromo;
          promoInput.disabled = true;
          promoBtn.textContent = 'TERPASANG';
          promoBtn.disabled = true;
        } else {
          localStorage.removeItem(PROMO_KEY);
        }
      }
    }

    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      const promo = getPromoDiscount(code);
      if (promo) {
        // 1. Check if user already used this promo
        const voucherHistory = JSON.parse(localStorage.getItem('kuleather_voucher_history')) || [];
        const alreadyUsed = voucherHistory.some(h => h.userId === user.id && h.code.toUpperCase() === code);
        if (alreadyUsed) {
          window.showToast('Anda telah menggunakan kode promo ini sebelumnya.', 'error');
          if (promoMsg) {
            promoMsg.textContent = 'Kode promo sudah pernah Anda gunakan.';
            promoMsg.className = 'text-error body-sm';
          }
          return;
        }

        // 2. Check usage limit
        if (promo.usageLimit !== undefined && promo.usageCount >= promo.usageLimit) {
          window.showToast('Batas penggunaan kode promo ini telah habis.', 'error');
          if (promoMsg) {
            promoMsg.textContent = 'Batas kuota kode promo telah habis.';
            promoMsg.className = 'text-error body-sm';
          }
          return;
        }

        // 3. Check min purchase
        const subtotal = getCartTotal();
        if (promo.minOrder && subtotal < promo.minOrder) {
          window.showToast(`Minimal pembelian untuk promo ini adalah ${idr(promo.minOrder)}.`, 'error');
          if (promoMsg) {
            promoMsg.textContent = `Minimal order ${idr(promo.minOrder)}`;
            promoMsg.className = 'text-error body-sm';
          }
          return;
        }

        discountPercent = promo.discount;
        localStorage.setItem(PROMO_KEY, code);

        if (typeof window.showToast === 'function') {
          window.showToast(`Kode promo ${code} berhasil diterapkan! Diskon ${discountPercent}%.`, 'success');
        }
        promoInput.disabled = true;
        promoBtn.textContent = 'TERPASANG';
        promoBtn.disabled = true;
        if (promoMsg) {
          promoMsg.textContent = `Diskon ${discountPercent}% berhasil diterapkan!`;
          promoMsg.className = 'text-success body-sm';
        }
        renderSummary();
      } else if (code === '') {
        window.showToast('Silakan masukkan kode voucher.', 'error');
      } else {
        window.showToast('Kode voucher tidak valid atau tidak aktif.', 'error');
        if (promoMsg) {
          promoMsg.textContent = 'Kode voucher tidak valid.';
          promoMsg.className = 'text-error body-sm';
        }
      }
    });
  }

  function renderCartItems() {
    const cart = getCart();
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="text-center" style="padding: var(--space-3xl) 0;">
          <svg style="margin:0 auto var(--space-md) auto; color:var(--text-muted);" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <h3 class="heading-3 mb-sm">Keranjang Belanja Kosong</h3>
          <p class="text-muted mb-lg">Anda belum menambahkan produk apapun ke keranjang Anda.</p>
          <a href="produk.html" class="btn btn-primary">Mulai Belanja</a>
        </div>
      `;
      // Hide checkout button
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }

    let itemsHtml = '';
    cart.forEach(item => {
      const imgUrl = (item.photo.startsWith('http') || item.photo.includes('/'))
        ? item.photo 
        : `https://images.unsplash.com/${item.photo}?w=100&h=100&fit=crop&auto=format`;
        
      itemsHtml += `
        <div class="cart-item" data-id="${item.id}" data-variant="${item.variant}" style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-md) 0; border-bottom:1px solid var(--muted-light);">
          <div style="display:flex; align-items:center; gap:var(--space-md); flex-grow:1;">
            <img src="${imgUrl}" alt="${item.name}" style="width:70px; height:70px; object-fit:cover; border:1px solid var(--muted-light);">
            <div>
              <h4 class="body" style="font-weight:500; margin-bottom:4px;">${item.name}</h4>
              <p class="caption text-muted mb-xs">Varian: ${item.variant}</p>
              <button class="remove-item-btn btn-text text-error caption" style="letter-spacing:0.1em;">HAPUS</button>
            </div>
          </div>
          
          <div style="display:flex; align-items:center; gap:var(--space-xl);">
            <div class="qty-control" style="border:1px solid var(--muted-light);">
              <button class="qty-dec-btn qty-btn" style="width:30px; height:30px;">-</button>
              <input type="text" class="qty-val-input qty-input" value="${item.qty}" style="width:36px; height:30px; padding:0; text-align:center; background:transparent; color:var(--text-primary);" readonly>
              <button class="qty-inc-btn qty-btn" style="width:30px; height:30px;">+</button>
            </div>
            
            <div style="width:120px; text-align:right;">
              <span class="price-sm">${idr(item.price * item.qty)}</span>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = itemsHtml;
    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    // Quantity Increment
    const incBtns = cartItemsContainer.querySelectorAll('.qty-inc-btn');
    incBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemRow = e.target.closest('.cart-item');
        const id = itemRow.getAttribute('data-id');
        const variant = itemRow.getAttribute('data-variant');
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.variant === variant);
        if (item) {
          updateQty(id, variant, item.qty + 1);
          renderCartPage();
        }
      });
    });

    // Quantity Decrement
    const decBtns = cartItemsContainer.querySelectorAll('.qty-dec-btn');
    decBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemRow = e.target.closest('.cart-item');
        const id = itemRow.getAttribute('data-id');
        const variant = itemRow.getAttribute('data-variant');
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.variant === variant);
        if (item) {
          updateQty(id, variant, item.qty - 1);
          renderCartPage();
        }
      });
    });

    // Remove Item
    const removeBtns = cartItemsContainer.querySelectorAll('.remove-item-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemRow = e.target.closest('.cart-item');
        const id = itemRow.getAttribute('data-id');
        const variant = itemRow.getAttribute('data-variant');
        removeFromCart(id, variant);
        renderCartPage();
      });
    });
  }

  function renderSummary() {
    const subtotal = getCartTotal();
    const shippingCost = getCartCount() > 0 ? shippingRates[selectedShipping] : 0;
    const discount = subtotal * (discountPercent / 100);
    const ppn = (subtotal - discount) * 0.011; // 1.1%
    const total = subtotal - discount + shippingCost + ppn;

    const summaryHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-sm); margin-bottom:var(--space-md);">
        <div class="flex-between">
          <span class="text-secondary body-sm">Subtotal Produk</span>
          <span class="body-sm" style="font-weight:500;">${idr(subtotal)}</span>
        </div>
        ${discount > 0 ? `
        <div class="flex-between text-success">
          <span class="body-sm">Diskon (10%)</span>
          <span class="body-sm">- ${idr(discount)}</span>
        </div>
        ` : ''}
        <div class="flex-between">
          <span class="text-secondary body-sm">Biaya Pengiriman</span>
          <span class="body-sm">${shippingCost > 0 ? idr(shippingCost) : 'Gratis'}</span>
        </div>
        <div class="flex-between">
          <span class="text-secondary body-sm">PPN (1.1%)</span>
          <span class="body-sm">${idr(ppn)}</span>
        </div>
      </div>
      
      <div style="border-top:1px solid var(--muted); padding-top:var(--space-md); margin-bottom:var(--space-lg);" class="flex-between">
        <span class="body" style="font-weight:500;">Total Transaksi</span>
        <span class="price-lg" style="font-weight:700;">${idr(total)}</span>
      </div>
    `;

    if (cartSummaryContainer) {
      cartSummaryContainer.innerHTML = summaryHtml;
    }
  }

  function renderCartPage() {
    renderCartItems();
    renderSummary();
  }

  renderCartPage();

  // Handle proceed to checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Save current calculations to session storage for checkout use
      const subtotal = getCartTotal();
      const shippingCost = shippingRates[selectedShipping];
      const discount = subtotal * (discountPercent / 100);
      const ppn = (subtotal - discount) * 0.011;
      const total = subtotal - discount + shippingCost + ppn;
      
      const calculations = {
        subtotal,
        shippingCost,
        shippingCourier: selectedShipping,
        discount,
        ppn,
        total
      };
      
      sessionStorage.setItem('kuleather_checkout_calc', JSON.stringify(calculations));
      window.location.href = 'checkout.html';
    });
  }
});
