// ==========================================================================
// 🏪 Kuleather Light — Seller Products Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;

  // 1. Core State
  const state = {
    products: [],
    filteredProducts: [],
    page: 1,
    perPage: 10,
    search: '',
    category: 'Semua',
    status: 'Semua',
    stock: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('products-table-tbody');
  const searchInput = document.getElementById('product-search-input');
  const categorySelect = document.getElementById('filter-category-select');
  const statusSelect = document.getElementById('filter-status-select');
  const stockSelect = document.getElementById('filter-stock-select');
  const paginationContainer = document.getElementById('products-pagination');
  const totalCountEl = document.getElementById('product-total-count');

  // Modal Fields
  const crudForm = document.getElementById('product-crud-form');
  const idField = document.getElementById('product-id-field');
  const nameField = document.getElementById('product-name');
  const skuField = document.getElementById('product-sku');
  const categoryField = document.getElementById('product-category');
  const priceField = document.getElementById('product-price');
  const stockField = document.getElementById('product-stock');
  const materialField = document.getElementById('product-material');
  const originField = document.getElementById('product-origin');
  const statusField = document.getElementById('product-status');
  const photoField = document.getElementById('product-photo');
  const descriptionField = document.getElementById('product-description');

  // Load products list
  function loadProducts() {
    // kuleather_products contains all products in marketplace
    const allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    
    // Filter to only this seller's products
    state.products = allProducts.filter(p => p.sellerId === sellerId);
    applyFilters();
  }

  // Filter Products
  function applyFilters() {
    state.filteredProducts = state.products.filter(p => {
      // Search term (name or SKU)
      const matchesSearch = state.search === '' || 
        p.name.toLowerCase().includes(state.search.toLowerCase()) || 
        (p.sku && p.sku.toLowerCase().includes(state.search.toLowerCase()));

      // Category
      const matchesCategory = state.category === 'Semua' || p.cat === state.category;

      // Status
      const matchesStatus = state.status === 'Semua' || p.status === state.status;

      // Stock levels
      let matchesStock = true;
      if (state.stock === 'habis') matchesStock = p.stock === 0;
      else if (state.stock === 'rendah') matchesStock = p.stock > 0 && p.stock <= 15;
      else if (state.stock === 'tersedia') matchesStock = p.stock > 15;

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });

    // Reset pagination to page 1 if current page becomes empty
    const maxPages = Math.ceil(state.filteredProducts.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredProducts.length;
    renderTable();
    renderPagination();
  }

  // Render Table rows
  function renderTable() {
    if (!tbody) return;
    
    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredProducts.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;" class="text-muted">Tidak ada produk yang cocok dengan filter</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(p => {
      let imgUrl = (p.photo.startsWith('http') || p.photo.includes('/')) ? p.photo : `https://images.unsplash.com/${p.photo}?w=80&h=80&fit=crop&auto=format`;
      if (imgUrl.startsWith('../assets/')) {
        imgUrl = '../' + imgUrl;
      }

      // Status pill color
      let statusText = 'Review';
      let statusClass = 'status-pending';
      if (p.status === 'active') { statusText = 'Aktif'; statusClass = 'status-active'; }
      else if (p.status === 'inactive') { statusText = 'Nonaktif'; statusClass = 'status-inactive'; }
      else if (p.status === 'pending_review') { statusText = 'Review Admin'; statusClass = 'status-pending'; }

      // Stock level badge
      let stockText = 'HABIS';
      let stockClass = 'stock-habis';
      if (p.stock > 15) { stockText = `${p.stock} pcs`; stockClass = 'stock-tersedia'; }
      else if (p.stock > 0) { stockText = `${p.stock} pcs`; stockClass = 'stock-rendah'; }

      html += `
        <tr data-id="${p.id}">
          <td>
            <img src="${imgUrl}" alt="${p.name}" class="admin-table-img">
          </td>
          <td>
            <strong style="display:block; font-size:0.85rem;">${p.name}</strong>
            <span class="caption text-muted" style="font-family:var(--font-mono); font-size:0.65rem;">SKU: ${p.sku || '-'}</span>
          </td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; font-weight:normal; background:rgba(0,0,0,0.05); color:var(--text-primary); border:none;">${p.cat}</span></td>
          <td class="mono font-weight-bold">${window.idr(p.price)}</td>
          <td>
            <span class="stock-badge ${stockClass}">${stockText}</span>
          </td>
          <td class="mono">${p.sold || 0}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="admin-table-actions">
              <button class="btn-table-action" onclick="openProductEditModal('${p.id}')" title="Edit Produk">
                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="btn-table-action btn-table-action-danger" onclick="deleteProduct('${p.id}')" title="Hapus Produk">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // Render Pagination controls
  function renderPagination() {
    if (!paginationContainer) return;
    
    const maxPages = Math.ceil(state.filteredProducts.length / state.perPage);
    if (maxPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = '';
    
    // Prev Button
    const prevDisabled = state.page === 1 ? 'disabled' : '';
    html += `<button class="pagination-btn" ${prevDisabled} onclick="changePage(${state.page - 1})">←</button>`;

    // Page numbers
    for (let i = 1; i <= maxPages; i++) {
      const activeClass = state.page === i ? 'active' : '';
      html += `<button class="pagination-btn ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    // Next Button
    const nextDisabled = state.page === maxPages ? 'disabled' : '';
    html += `<button class="pagination-btn" ${nextDisabled} onclick="changePage(${state.page + 1})">→</button>`;

    paginationContainer.innerHTML = html;
  }

  window.changePage = function(pNum) {
    state.page = pNum;
    applyFilters();
  };

  // Filter Listeners
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        applyFilters();
      }, 300);
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      state.category = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      state.status = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  if (stockSelect) {
    stockSelect.addEventListener('change', (e) => {
      state.stock = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  // Modal operations
  window.openProductAddModal = function() {
    if (crudForm) crudForm.reset();
    if (idField) idField.value = '';
    
    const modalTitle = document.getElementById('product-modal-title');
    if (modalTitle) modalTitle.textContent = 'Tambah Produk Baru';
    
    // Auto populate origin with shop city
    if (originField && window.sellerUser.shop) {
      originField.value = window.sellerUser.shop.city || 'Magetan, Jawa Timur';
    }

    if (skuField) skuField.value = '';

    window.openModal('product-modal-overlay');
  };

  window.openProductEditModal = function(id) {
    const allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    if (idField) idField.value = p.id;
    if (nameField) nameField.value = p.name;
    if (skuField) skuField.value = p.sku || '';
    if (categoryField) categoryField.value = p.cat;
    if (priceField) priceField.value = p.price;
    if (stockField) stockField.value = p.stock;
    if (materialField) materialField.value = p.material || 'Kulit Sapi Asli';
    if (originField) originField.value = p.origin || '';
    if (statusField) statusField.value = p.status;
    if (photoField) photoField.value = p.photo;
    if (descriptionField) descriptionField.value = p.description || '';

    const modalTitle = document.getElementById('product-modal-title');
    if (modalTitle) modalTitle.textContent = 'Edit Produk';

    window.openModal('product-modal-overlay');
  };

  // CRUD Form submit handler
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = idField.value.trim();
      const name = nameField.value.trim();
      const category = categoryField.value;
      const price = parseFloat(priceField.value);
      const stock = parseInt(stockField.value, 10);
      const material = materialField.value;
      const origin = originField.value.trim();
      const status = statusField.value;
      const photo = photoField.value;
      const description = descriptionField.value.trim();

      // Retrieve all products
      const allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];

      // Generate ID slug if new
      let slugId = id;
      if (!slugId) {
        slugId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const checkConflict = allProducts.some(p => p.id === slugId);
        if (checkConflict) {
          slugId += '-' + Math.floor(Math.random() * 1000);
        }
      }

      // Generate SKU if new
      let sku = skuField.value.trim();
      if (!sku) {
        const catCode = category.substring(0, 3).toUpperCase();
        sku = `KUL-${catCode}-${Math.floor(100 + Math.random() * 900)}`;
      }

      const shopName = window.sellerUser.shop ? window.sellerUser.shop.name : 'Toko Mitra';

      const productData = {
        id: slugId,
        name: name,
        price: price,
        rating: id ? (allProducts.find(p => p.id === id)?.rating || 5.0) : 5.0,
        reviewCount: id ? (allProducts.find(p => p.id === id)?.reviewCount || 0) : 0,
        sold: id ? (allProducts.find(p => p.id === id)?.sold || 0) : 0,
        cat: category,
        material: material,
        origin: origin,
        badges: id ? (allProducts.find(p => p.id === id)?.badges || []) : ['New'],
        photo: photo,
        inStock: stock > 0,
        sku: sku,
        stock: stock,
        sellerId: sellerId,
        seller: shopName,
        // New product has status: pending_review (requires admin approval)
        // If it's editing a product, we keep the original status (or use form selection)
        // Let's use form status selection, but if editing an active product, we can save active.
        status: id ? status : 'pending_review',
        variants: id ? (allProducts.find(p => p.id === id)?.variants || ['S', 'M', 'L']) : ['S', 'M', 'L'],
        description: description,
        createdAt: id ? (allProducts.find(p => p.id === id)?.createdAt || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10)
      };

      if (id) {
        // Edit Mode
        const index = allProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          allProducts[index] = productData;
          localStorage.setItem('kuleather_products', JSON.stringify(allProducts));
          window.showToast(`Produk '${name}' berhasil diperbarui!`, 'success');
        }
      } else {
        // Add Mode
        allProducts.push(productData);
        localStorage.setItem('kuleather_products', JSON.stringify(allProducts));
        window.showToast(`Produk baru '${name}' berhasil ditambahkan dan menunggu review admin.`, 'success');

        // Create a notification for admin
        createAdminNotification(`Mitra Penjual (${shopName}) menambahkan produk baru: ${name}`, 'product');
      }

      window.closeModal('product-modal-overlay');
      loadProducts();
    });
  }

  // Delete product
  window.deleteProduct = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen dari toko Anda?')) {
      const allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];
      const updated = allProducts.filter(p => p.id !== id);
      localStorage.setItem('kuleather_products', JSON.stringify(updated));
      window.showToast('Produk berhasil dihapus dari toko Anda.', 'success');
      loadProducts();
    }
  };

  // Helper to create notifications for admin
  function createAdminNotification(message, type) {
    const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
    notifications.push({
      id: 'notif-' + Date.now(),
      message: message,
      type: type,
      read: false,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));
  }

  // Initial load
  loadProducts();
});
