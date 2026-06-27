// ==========================================================================
// 🌿 Kuleather Light — Admin Products Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core State
  const state = {
    products: [],
    filteredProducts: [],
    page: 1,
    perPage: 10,
    search: '',
    category: 'Semua',
    status: 'Semua',
    stock: 'Semua',
    selectedItems: new Set()
  };

  // Varian Tags helper array
  let currentVariants = [];

  // DOM Elements
  const tbody = document.getElementById('products-table-tbody');
  const searchInput = document.getElementById('product-search-input');
  const categorySelect = document.getElementById('filter-category-select');
  const statusSelect = document.getElementById('filter-status-select');
  const stockSelect = document.getElementById('filter-stock-select');
  const paginationContainer = document.getElementById('products-pagination');
  
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const bulkActionsArea = document.getElementById('bulk-actions-area');
  const bulkCountLabel = document.getElementById('bulk-count-label');
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
  const sellerField = document.getElementById('product-seller');
  const statusField = document.getElementById('product-status');
  const descriptionField = document.getElementById('product-description');
  
  const photoField = document.getElementById('product-photo');
  const imgPreview = document.getElementById('product-image-preview');
  const imgPlaceholder = document.getElementById('product-image-placeholder');

  const variantsInput = document.getElementById('product-variants-input');
  const variantsContainer = document.getElementById('product-variants-tags-container');

  // Load products list
  function loadProducts() {
    state.products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
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
      else if (state.stock === 'kritis') matchesStock = p.stock > 0 && p.stock <= 5;
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
    updateBulkControls();
  }

  // Render Table rows
  function renderTable() {
    if (!tbody) return;
    
    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredProducts.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada produk yang cocok dengan filter</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(p => {
      // Photo url helper
      const imgUrl = p.photo.startsWith('http') || p.photo.startsWith('photo-') ? (p.photo.startsWith('photo-') ? `https://images.unsplash.com/${p.photo}?w=80&h=80&fit=crop&auto=format` : p.photo) : `https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop&auto=format`;

      // Status pill color
      let statusText = 'Review';
      let statusClass = 'status-pending';
      if (p.status === 'active') { statusText = 'Aktif'; statusClass = 'status-active'; }
      else if (p.status === 'inactive') { statusText = 'Nonaktif'; statusClass = 'status-inactive'; }

      // Stock level badge
      let stockText = 'HABIS';
      let stockClass = 'stock-habis';
      if (p.stock > 15) { stockText = `${p.stock} pcs`; stockClass = 'stock-tersedia'; }
      else if (p.stock > 5) { stockText = `${p.stock} pcs`; stockClass = 'stock-rendah'; }
      else if (p.stock > 0) { stockText = `${p.stock} pcs`; stockClass = 'stock-kritis'; }

      const isChecked = state.selectedItems.has(p.id) ? 'checked' : '';
      const isSelectedRowClass = state.selectedItems.has(p.id) ? 'selected' : '';

      html += `
        <tr class="${isSelectedRowClass}" data-id="${p.id}">
          <td>
            <label class="admin-checkbox-custom">
              <input type="checkbox" class="row-selector-checkbox" data-id="${p.id}" ${isChecked}>
              <span class="admin-checkbox-checkmark"></span>
            </label>
          </td>
          <td>
            <img src="${imgUrl}" alt="${p.name}" class="admin-table-img">
          </td>
          <td>
            <strong style="display:block; font-size:0.85rem;">${p.name}</strong>
            <span class="caption text-muted" style="font-family:var(--font-mono); font-size:0.65rem;">SKU: ${p.sku || '-'}</span>
          </td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; font-weight:normal;">${p.cat}</span></td>
          <td class="mono font-weight-bold">${idr(p.price)}</td>
          <td>
            <span class="stock-badge ${stockClass}">${stockText}</span>
          </td>
          <td style="font-size: 0.75rem;">${p.seller || '-'}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td class="admin-table-actions">
            <button class="admin-table-action-btn" title="Edit Produk" onclick="openProductEditModal('${p.id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="admin-table-action-btn delete" title="Hapus Produk" onclick="deleteProduct('${p.id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    // Attach Row Checkbox Events
    tbody.querySelectorAll('.row-selector-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const tr = tbody.querySelector(`tr[data-id="${id}"]`);
        if (e.target.checked) {
          state.selectedItems.add(id);
          if (tr) tr.classList.add('selected');
        } else {
          state.selectedItems.delete(id);
          if (tr) tr.classList.remove('selected');
        }
        updateBulkControls();
      });
    });
  }

  // Render Pagination Buttons
  function renderPagination() {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(state.filteredProducts.length / state.perPage);

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = `
      <div class="admin-pagination-info">
        Menampilkan Halaman ${state.page} dari ${totalPages}
      </div>
      <div class="admin-pagination-buttons">
        <button class="admin-pagination-btn" ${state.page === 1 ? 'disabled' : ''} onclick="changePage(${state.page - 1})">‹</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button class="admin-pagination-btn ${state.page === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
      `;
    }

    html += `
        <button class="admin-pagination-btn" ${state.page === totalPages ? 'disabled' : ''} onclick="changePage(${state.page + 1})">›</button>
      </div>
    `;
    paginationContainer.innerHTML = html;
  }

  // Change page helper globally accessible
  window.changePage = function(pageNum) {
    state.page = pageNum;
    tbody.scrollTo({ top: 0 });
    renderTable();
    renderPagination();
  };

  // Bulk select toggles
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const start = (state.page - 1) * state.perPage;
      const end = start + state.perPage;
      const paginated = state.filteredProducts.slice(start, end);

      paginated.forEach(p => {
        const tr = tbody.querySelector(`tr[data-id="${p.id}"]`);
        const cb = tr ? tr.querySelector('.row-selector-checkbox') : null;
        if (e.target.checked) {
          state.selectedItems.add(p.id);
          if (cb) cb.checked = true;
          if (tr) tr.classList.add('selected');
        } else {
          state.selectedItems.delete(p.id);
          if (cb) cb.checked = false;
          if (tr) tr.classList.remove('selected');
        }
      });
      updateBulkControls();
    });
  }

  // Update bulk controls visibility
  function updateBulkControls() {
    const selectedCount = state.selectedItems.size;
    if (selectedCount > 0) {
      if (bulkActionsArea) bulkActionsArea.style.display = 'flex';
      if (bulkCountLabel) bulkCountLabel.textContent = `${selectedCount} terpilih`;
    } else {
      if (bulkActionsArea) bulkActionsArea.style.display = 'none';
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
    }
  }

  // Bulk Delete
  window.triggerBulkDelete = function() {
    const selectedCount = state.selectedItems.size;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCount} produk terpilih secara permanen?`)) {
      const pList = state.products.filter(p => !state.selectedItems.has(p.id));
      localStorage.setItem('kuleather_products', JSON.stringify(pList));
      
      // Log Notification
      createSystemNotification(`Admin Utama menghapus massal ${selectedCount} produk`, 'product', 'var(--error)');
      showToast(`${selectedCount} produk berhasil dihapus secara massal.`, 'success');
      
      state.selectedItems.clear();
      loadProducts();
    }
  };

  // Listen filters changes
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

  // Photo live preview
  if (photoField) {
    photoField.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      updateImagePreview(val);
    });
  }

  function updateImagePreview(val) {
    if (val === '') {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'block';
      return;
    }

    const imgUrl = val.startsWith('http') || val.startsWith('photo-') ? (val.startsWith('photo-') ? `https://images.unsplash.com/${val}?w=400&h=300&fit=crop&auto=format` : val) : val;
    imgPreview.src = imgUrl;
    imgPreview.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  }

  // Variants tags editor UI
  function renderVariantsTags() {
    // Clear all existing tag elements except the input field itself
    const tagElements = variantsContainer.querySelectorAll('.admin-tag-pill');
    tagElements.forEach(el => el.remove());

    currentVariants.forEach((tag, idx) => {
      const tagPill = document.createElement('span');
      tagPill.className = 'admin-tag-pill';
      tagPill.innerHTML = `
        ${tag}
        <span class="admin-tag-pill-close" onclick="removeVariantTag(${idx})">×</span>
      `;
      variantsContainer.insertBefore(tagPill, variantsInput);
    });
  }

  window.removeVariantTag = function(index) {
    currentVariants.splice(index, 1);
    renderVariantsTags();
  };

  if (variantsInput) {
    variantsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = variantsInput.value.trim().replace(',', '');
        if (val && !currentVariants.includes(val)) {
          currentVariants.push(val);
          renderVariantsTags();
        }
        variantsInput.value = '';
      }
    });

    variantsInput.addEventListener('blur', () => {
      const val = variantsInput.value.trim().replace(',', '');
      if (val && !currentVariants.includes(val)) {
        currentVariants.push(val);
        renderVariantsTags();
      }
      variantsInput.value = '';
    });
  }

  // CRUD Modal Form Submissions
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = idField.value.trim();
      const name = nameField.value.trim();
      const category = categoryField.value;
      const price = parseFloat(priceField.value);
      const stock = parseInt(stockField.value, 10);
      const material = materialField.value;
      const origin = originField.value;
      const seller = sellerField.value.trim();
      const status = statusField.value;
      const description = descriptionField.value.trim();
      const photo = photoField.value.trim() || 'photo-1548036328-c9fa89d128fa'; // fallback photo

      // Generate slug ID for products if new
      let slugId = id;
      if (!slugId) {
        slugId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Append random suffix to slug to make it unique
        const checkConflict = state.products.find(p => p.id === slugId);
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

      // Badges
      const badges = [];
      if (document.getElementById('badge-best-seller').checked) badges.push('Best Seller');
      if (document.getElementById('badge-new').checked) badges.push('New');

      const productData = {
        id: slugId,
        name: name,
        price: price,
        rating: id ? (state.products.find(p => p.id === id)?.rating || 5.0) : 5.0,
        reviewCount: id ? (state.products.find(p => p.id === id)?.reviewCount || 0) : 0,
        sold: id ? (state.products.find(p => p.id === id)?.sold || 0) : 0,
        cat: category,
        material: material,
        origin: origin,
        badges: badges,
        photo: photo,
        inStock: stock > 0,
        sku: sku,
        stock: stock,
        seller: seller,
        status: status,
        variants: currentVariants,
        description: description,
        createdAt: id ? (state.products.find(p => p.id === id)?.createdAt || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10)
      };

      if (id) {
        // Edit Mode
        const index = state.products.findIndex(p => p.id === id);
        if (index !== -1) {
          state.products[index] = productData;
          createSystemNotification(`Produk '${name}' (SKU: ${sku}) diperbarui oleh Admin Utama`, 'product', 'var(--accent)');
          showToast('Produk berhasil diperbarui.', 'success');
        }
      } else {
        // Add Mode
        state.products.unshift(productData);
        createSystemNotification(`Produk baru '${name}' (SKU: ${sku}) ditambahkan oleh Admin Utama`, 'product', 'var(--success)');
        showToast('Produk baru berhasil ditambahkan.', 'success');
      }

      localStorage.setItem('kuleather_products', JSON.stringify(state.products));
      closeModal('product-modal-overlay');
      loadProducts();
    });
  }

  // Open Modal Add mode
  window.openProductAddModal = function() {
    document.getElementById('product-modal-title').textContent = 'Tambah Produk Baru';
    crudForm.reset();
    idField.value = '';
    skuField.value = ''; // auto generate on submit
    currentVariants = ['Cokelat Tua', 'Hitam']; // default tags
    renderVariantsTags();
    updateImagePreview('');
    openModal('product-modal-overlay');
  };

  // Open Modal Edit mode
  window.openProductEditModal = function(id) {
    const p = state.products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('product-modal-title').textContent = 'Edit Produk';
    
    // Autofill fields
    idField.value = p.id;
    nameField.value = p.name;
    skuField.value = p.sku || '';
    categoryField.value = p.cat;
    priceField.value = p.price;
    stockField.value = p.stock;
    materialField.value = p.material;
    originField.value = p.origin;
    sellerField.value = p.seller || '';
    statusField.value = p.status || 'active';
    descriptionField.value = p.description || '';
    photoField.value = p.photo || '';
    
    updateImagePreview(p.photo || '');

    // Badges checkboxes
    document.getElementById('badge-best-seller').checked = p.badges.includes('Best Seller');
    document.getElementById('badge-new').checked = p.badges.includes('New');

    // Variants tags
    currentVariants = p.variants ? [...p.variants] : [];
    renderVariantsTags();

    openModal('product-modal-overlay');
  };

  // Delete product
  window.deleteProduct = function(id) {
    const p = state.products.find(prod => prod.id === id);
    if (!p) return;

    if (confirm(`Apakah Anda yakin ingin menghapus produk '${p.name}' secara permanen?`)) {
      state.products = state.products.filter(prod => prod.id !== id);
      localStorage.setItem('kuleather_products', JSON.stringify(state.products));
      
      // Log Notification
      createSystemNotification(`Admin Utama menghapus produk '${p.name}' (SKU: ${p.sku || '-'})`, 'product', 'var(--error)');
      showToast(`Produk '${p.name}' berhasil dihapus.`, 'success');
      
      state.selectedItems.delete(id);
      loadProducts();
    }
  };

  // Initial Load
  loadProducts();

  // Handle Query action parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'add') {
    openProductAddModal();
  }
});
