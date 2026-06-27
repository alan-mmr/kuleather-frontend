// ==========================================================================
// 🏪 Kuleather Light — Public Storefront Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Force clear services once if they use the old database version
  const storedSvcVer = localStorage.getItem('kuleather_services_version');
  if (storedSvcVer !== 'v6') {
    localStorage.removeItem('kuleather_services');
    localStorage.setItem('kuleather_services_version', 'v6');
    if (typeof getServices === 'function') {
      getServices();
    }
  }
  // 1. Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sellerId = urlParams.get('seller');

  if (!sellerId) {
    alert('ID Penjual tidak ditemukan. Mengalihkan ke Katalog...');
    window.location.href = 'produk.html';
    return;
  }

  // 2. State
  const state = {
    products: [],
    filteredProducts: [],
    services: [],
    activeTab: 'products',
    search: '',
    category: 'Semua',
    inStockOnly: false,
    sort: 'populer'
  };

  // DOM Elements
  const shopNameEl = document.getElementById('storefront-shop-name');
  const shopOwnerEl = document.getElementById('storefront-owner');
  const shopLocationEl = document.getElementById('storefront-location');
  const shopRatingEl = document.getElementById('storefront-rating');
  const shopJoinedEl = document.getElementById('storefront-joined');
  const shopDescEl = document.getElementById('storefront-description');
  const shopAvatarEl = document.getElementById('storefront-avatar-emoji');
  const shopVerifiedBadge = document.getElementById('storefront-verified-badge');

  // Stats Elements
  const statValProducts = document.getElementById('stat-val-products');
  const statValSales = document.getElementById('stat-val-sales');
  const statValRating = document.getElementById('stat-val-rating');

  // Filters Elements
  const searchInput = document.getElementById('store-search-input');
  const categoryPills = document.querySelectorAll('#filter-store-category .filter-pill');
  const instockCheckbox = document.getElementById('store-filter-instock');
  const sortSelect = document.getElementById('store-sort-select');
  const productsGrid = document.getElementById('store-products-grid');
  const emptyState = document.getElementById('store-empty-state');
  const countLabel = document.getElementById('store-count-label');

  // 3. Load Seller & Products
  function initStorefront() {
    const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
    const seller = users.find(u => u.id === sellerId && u.role === 'penjual');

    if (!seller) {
      alert('Toko Mitra tidak ditemukan atau belum aktif.');
      window.location.href = 'produk.html';
      return;
    }

    // Load seller products
    const allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    state.products = allProducts.filter(p => p.sellerId === sellerId && p.status === 'active');

    // Load seller services
    let allServices = JSON.parse(localStorage.getItem('kuleather_services'));
    if (!allServices && typeof getServices === 'function') {
      allServices = getServices();
    } else {
      allServices = allServices || [];
    }
    state.services = allServices.filter(s => s.sellerId === sellerId && s.status === 'active');

    // Populate Seller Profile
    const shop = seller.shop || {};
    if (shopNameEl) shopNameEl.textContent = shop.name || 'Toko Mitra';
    if (shopOwnerEl) shopOwnerEl.textContent = `Pemilik: ${seller.name || 'Pemilik Toko'}`;
    if (shopLocationEl) shopLocationEl.textContent = shop.city || 'Magetan, Jawa Timur';
    if (shopJoinedEl) shopJoinedEl.textContent = shop.memberSince || seller.joined || '2026';
    if (shopDescEl) shopDescEl.textContent = shop.description || 'Pengrajin kulit asli berkualitas premium.';
    
    // Logo avatar rendering
    if (shopAvatarEl) {
      const avatarVal = shop.avatar || '🏪';
      if (avatarVal.startsWith('http') || avatarVal.includes('/') || avatarVal.includes('.')) {
        shopAvatarEl.innerHTML = `<img src="${avatarVal}" alt="Shop Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
        shopAvatarEl.style.fontSize = 'initial';
      } else {
        shopAvatarEl.textContent = avatarVal;
        shopAvatarEl.innerHTML = avatarVal;
        shopAvatarEl.style.fontSize = '3rem';
      }
    }

    // Banner background rendering
    const storefrontHeader = document.querySelector('.storefront-header');
    if (storefrontHeader && shop.banner && shop.banner !== 'default') {
      const isDark = window.location.pathname.toLowerCase().includes('kuleather-dark');
      const gradientBg = isDark 
        ? `linear-gradient(to right, rgba(15, 13, 10, 0.97) 30%, rgba(15, 13, 10, 0.6) 100%)` 
        : `linear-gradient(to right, rgba(250, 245, 237, 0.97) 30%, rgba(250, 245, 237, 0.6) 100%)`;
      storefrontHeader.style.backgroundImage = `${gradientBg}, url(${shop.banner})`;
      storefrontHeader.style.backgroundSize = 'cover';
      storefrontHeader.style.backgroundPosition = 'center';
    }

    if (shop.verified && shopVerifiedBadge) {
      shopVerifiedBadge.style.display = 'inline-block';
    }

    // Populate Stats
    const totalSales = state.products.reduce((sum, p) => sum + (p.sold || 0), 0);
    const avgRating = state.products.length > 0 ? (state.products.reduce((sum, p) => sum + (p.rating || 5.0), 0) / state.products.length).toFixed(1) : '5.0';

    if (statValProducts) statValProducts.textContent = state.products.length + state.services.length;
    if (statValSales) statValSales.textContent = totalSales;
    if (statValRating) statValRating.textContent = avgRating;
    if (shopRatingEl) shopRatingEl.textContent = `${avgRating} / 5.0 Rating Toko`;

    // Apply filters and render
    applyFilters();
  }

  // Filter & Sort Products
  function applyFilters() {
    state.filteredProducts = state.products.filter(p => {
      const matchesSearch = state.search === '' || p.name.toLowerCase().includes(state.search.toLowerCase());
      const matchesCategory = state.category === 'Semua' || p.cat === state.category;
      const matchesStock = !state.inStockOnly || p.stock > 0;

      return matchesSearch && matchesCategory && matchesStock;
    });

    // Sorting
    if (state.sort === 'harga-rendah') {
      state.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (state.sort === 'harga-tinggi') {
      state.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (state.sort === 'terbaru') {
      state.filteredProducts.sort((a, b) => new Date(b.createdAt || '') - new Date(a.createdAt || ''));
    } else {
      // populer
      state.filteredProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }

    if (countLabel) countLabel.textContent = `Menampilkan ${state.filteredProducts.length} produk`;

    renderProducts();
  }

  // Render Product Grid
  function renderProducts() {
    if (!productsGrid) return;

    if (state.filteredProducts.length === 0) {
      productsGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
    const wishlist = JSON.parse(localStorage.getItem('kuleather_wishlist')) || [];

    let html = '';
    state.filteredProducts.forEach(p => {
      const isWishlisted = activeUser && wishlist.some(item => item.userId === activeUser.id && item.productId === p.id);
      const wishClass = isWishlisted ? 'wishlist-btn wishlisted' : 'wishlist-btn';
      const wishFill = isWishlisted ? 'var(--error)' : 'none';

      // Badge overlays
      const badges = p.badges || [];
      const badgeHtml = badges.map(b => {
        let displayBadge = b;
        let badgeClass = 'badge-bestseller';
        if (b === 'New') {
          badgeClass = 'badge-new';
        } else {
          displayBadge = 'Best Seller';
        }
        return `<span class="badge ${badgeClass}">${displayBadge}</span>`;
      }).join('');

      const imgUrl = (p.photo.startsWith('http') || p.photo.includes('/')) ? p.photo : `https://images.unsplash.com/${p.photo}?w=400&h=400&fit=crop&auto=format`;

      html += `
        <div class="product-card">
          <div class="product-card-img-wrapper">
            <a href="product.html?id=${p.id}">
              <img src="${imgUrl}" alt="${p.name}" class="product-card-img">
            </a>
            <div class="product-card-badge-overlay">${badgeHtml}</div>
            <button class="${wishClass}" data-id="${p.id}" aria-label="Tambah ke wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishFill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="quick-add-btn" data-id="${p.id}">Quick Add</button>
          </div>
          <div class="product-card-body">
            <div class="product-card-meta">
              <span class="eyebrow">${p.cat}</span>
              <div class="product-card-rating">
                ${renderStars(p.rating || 5.0)}
              </div>
            </div>
            <h3 class="product-card-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="product-card-origin">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>${p.origin || 'Magetan'}</span>
              <span class="product-seller">${p.seller || 'Mitra Toko'}</span>
            </div>
            <div class="product-card-footer">
              <div>
                <span class="price">${formatCurrency(p.price)}</span>
              </div>
              <span class="caption text-muted">${p.sold || 0} terjual</span>
            </div>
          </div>
        </div>
      `;
    });

    productsGrid.innerHTML = html;
    bindProductCardEvents();
  }

  // Rating Stars Helper
  function renderStars(rating) {
    const rounded = Math.round(rating);
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        starsHtml += `<svg style="color:var(--accent); fill:var(--accent);" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      } else {
        starsHtml += `<svg style="color:var(--muted); fill:none;" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }
    }
    return starsHtml;
  }

  // Currency Formatter
  function formatCurrency(val) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  // Bind interactions for product cards
  function bindProductCardEvents() {
    // 1. Wishlist clicks
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
        if (!activeUser) {
          window.showToast('Silakan login terlebih dahulu untuk menambah wishlist.', 'error');
          setTimeout(() => {
            window.location.href = 'auth.html';
          }, 1000);
          return;
        }

        const pId = btn.getAttribute('data-id');
        const product = state.products.find(prod => prod.id === pId);
        let wishlist = JSON.parse(localStorage.getItem('kuleather_wishlist')) || [];
        const idx = wishlist.findIndex(item => item.userId === activeUser.id && item.productId === pId);

        btn.classList.toggle('wishlisted');
        const svg = btn.querySelector('svg');

        if (btn.classList.contains('wishlisted')) {
          if (svg) svg.style.fill = 'var(--error)';
          if (idx === -1) {
            wishlist.push({
              userId: activeUser.id,
              productId: product.id,
              name: product.name,
              price: product.price,
              photo: product.photo
            });
            localStorage.setItem('kuleather_wishlist', JSON.stringify(wishlist));
          }
          window.showToast(`Ditambahkan ke wishlist: ${product.name}`, 'success');
        } else {
          if (svg) svg.style.fill = 'none';
          wishlist = wishlist.filter(item => !(item.userId === activeUser.id && item.productId === pId));
          localStorage.setItem('kuleather_wishlist', JSON.stringify(wishlist));
          window.showToast(`Dihapus dari wishlist: ${product.name}`, 'info');
        }
      });
    });

    // 2. Quick Add clicks
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    quickAddBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const pId = btn.getAttribute('data-id');
        const product = state.products.find(prod => prod.id === pId);

        if (product.stock <= 0) {
          window.showToast('Maaf, stok produk habis.', 'error');
          return;
        }

        // Call global addToCart function
        if (typeof window.addToCart === 'function') {
          window.addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            photo: product.photo,
            variant: 'Default',
            qty: 1
          });
        } else {
          console.error('addToCart engine not loaded.');
        }
      });
    });
  }

  // Bind Category filters (using event delegation)
  const categoriesList = document.getElementById('store-categories-list');
  if (categoriesList) {
    categoriesList.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      
      const pills = categoriesList.querySelectorAll('.filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      state.category = pill.getAttribute('data-value');
      
      if (state.activeTab === 'products') {
        applyFilters();
      } else {
        applyServiceFilters();
      }
    });
  }

  // Bind Search input
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value.trim();
        if (state.activeTab === 'products') {
          applyFilters();
        } else {
          applyServiceFilters();
        }
      }, 300);
    });
  }

  // Bind Stock filter
  if (instockCheckbox) {
    instockCheckbox.addEventListener('change', (e) => {
      state.inStockOnly = e.target.checked;
      applyFilters();
    });
  }

  // Bind Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      if (state.activeTab === 'products') {
        applyFilters();
      } else {
        applyServiceFilters();
      }
    });
  }

  function applyServiceFilters() {
    let filtered = state.services.filter(s => {
      const matchesSearch = state.search === '' || s.name.toLowerCase().includes(state.search.toLowerCase());
      const matchesCategory = state.category === 'Semua' || s.category === state.category;
      return matchesSearch && matchesCategory;
    });

    // Sorting services
    if (state.sort === 'harga-rendah') {
      filtered.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (state.sort === 'harga-tinggi') {
      filtered.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (state.sort === 'terbaru') {
      filtered.sort((a, b) => new Date(b.createdAt || '') - new Date(a.createdAt || ''));
    } else {
      // populer
      filtered.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    }

    if (countLabel) {
      countLabel.textContent = `Menampilkan ${filtered.length} layanan jasa`;
    }

    renderServicesList(filtered);
  }

  function renderServicesList(servicesToRender) {
    if (!productsGrid) return;
    if (servicesToRender.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl) 0;">
          <svg style="margin: 0 auto var(--space-md) auto; color: var(--text-muted);" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h4 class="heading-3 mb-sm">Layanan Jasa Tidak Ditemukan</h4>
          <p class="text-secondary body-sm">Tidak ada layanan jasa yang sesuai dengan filter Anda.</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    servicesToRender.forEach(s => {
      const imgUrl = s.portfolio ? s.portfolio : `https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&auto=format`;
      html += `
        <div class="service-card">
          <div class="service-card-img-wrapper">
            <a href="service-detail.html?id=${s.id}">
              <img src="${imgUrl}" alt="${s.name}" class="service-card-img">
            </a>
            <div class="service-card-badge">${s.category}</div>
          </div>
          <div class="service-card-body">
            <div class="service-card-meta">
              <span class="eyebrow">${s.category || 'Jasa'}</span>
              <div class="service-card-rating">
                ★ <span style="margin-left:4px;">${s.rating || '5.0'}</span>
              </div>
            </div>
            <h3 class="service-card-title"><a href="service-detail.html?id=${s.id}">${s.name}</a></h3>
            <div class="service-card-seller">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>${s.sellerName || 'Mitra Toko'}</span>
            </div>
            <div class="service-card-footer">
              <div>
                <span class="service-price-label">Mulai Dari</span>
                <span class="price" style="font-size:16px; font-weight:700; color:var(--accent);">${formatCurrency(s.startingPrice)}</span>
              </div>
              <a href="service-detail.html?id=${s.id}" class="btn btn-primary btn-sm" style="padding:6px 12px; font-size:10px;">DETAIL JASA</a>
            </div>
          </div>
        </div>
      `;
    });
    productsGrid.innerHTML = html;
  }

  // Tabs Event Bindings
  const tabProducts = document.getElementById('tab-btn-products');
  const tabServices = document.getElementById('tab-btn-services');

  if (tabProducts && tabServices) {
    tabProducts.addEventListener('click', () => {
      tabProducts.classList.add('active');
      tabProducts.style.borderBottom = '2px solid var(--accent)';
      tabProducts.style.color = 'var(--text-primary)';
      
      tabServices.classList.remove('active');
      tabServices.style.borderBottom = '2px solid transparent';
      tabServices.style.color = 'var(--text-secondary)';
      
      state.activeTab = 'products';
      state.category = 'Semua';
      
      // Update sidebar contents for products
      const categoryTitle = document.getElementById('store-category-title');
      if (categoryTitle) categoryTitle.textContent = 'Kategori Produk';
      
      const categoriesList = document.getElementById('store-categories-list');
      if (categoriesList) {
        categoriesList.innerHTML = `
          <button class="filter-pill active" data-value="Semua">Semua</button>
          <button class="filter-pill" data-value="Finished Leather Goods">Finished Leather Goods</button>
          <button class="filter-pill" data-value="Raw Materials">Raw Materials</button>
          <button class="filter-pill" data-value="Leather Chemicals">Leather Chemicals</button>
          <button class="filter-pill" data-value="Machinery & Tools">Machinery & Tools</button>
        `;
      }
      
      const searchInput = document.getElementById('store-search-input');
      if (searchInput) {
        searchInput.placeholder = 'Nama produk...';
      }
      
      const stockSection = document.getElementById('store-stock-section');
      if (stockSection) {
        stockSection.style.display = 'block';
      }
      
      applyFilters();
    });

    tabServices.addEventListener('click', () => {
      tabServices.classList.add('active');
      tabServices.style.borderBottom = '2px solid var(--accent)';
      tabServices.style.color = 'var(--text-primary)';
      
      tabProducts.classList.remove('active');
      tabProducts.style.borderBottom = '2px solid transparent';
      tabProducts.style.color = 'var(--text-secondary)';
      
      state.activeTab = 'services';
      state.category = 'Semua';
      
      // Update sidebar contents for services
      const categoryTitle = document.getElementById('store-category-title');
      if (categoryTitle) categoryTitle.textContent = 'Kategori Jasa';
      
      const categoriesList = document.getElementById('store-categories-list');
      if (categoriesList) {
        categoriesList.innerHTML = `
          <button class="filter-pill active" data-value="Semua">Semua</button>
          <button class="filter-pill" data-value="Custom Jaket">Custom Jaket</button>
          <button class="filter-pill" data-value="Custom Tas">Custom Tas</button>
          <button class="filter-pill" data-value="Custom Sepatu">Custom Sepatu</button>
          <button class="filter-pill" data-value="Custom Dompet">Custom Dompet</button>
          <button class="filter-pill" data-value="Penyamakan Kulit">Penyamakan Kulit</button>
          <button class="filter-pill" data-value="Pewarnaan & Finishing">Pewarnaan & Finishing</button>
          <button class="filter-pill" data-value="Reparasi & Perbaikan">Reparasi & Perbaikan</button>
        `;
      }
      
      const searchInput = document.getElementById('store-search-input');
      if (searchInput) {
        searchInput.placeholder = 'Nama jasa...';
      }
      
      const stockSection = document.getElementById('store-stock-section');
      if (stockSection) {
        stockSection.style.display = 'none';
      }
      
      applyServiceFilters();
    });
  }

  // Start initialization
  initStorefront();
});
