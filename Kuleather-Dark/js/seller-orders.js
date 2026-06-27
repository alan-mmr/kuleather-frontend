// ==========================================================================
// 🏪 Kuleather Light — Seller Orders Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;

  // 1. State
  const state = {
    orders: [],
    filteredOrders: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('orders-table-tbody');
  const searchInput = document.getElementById('order-search-input');
  const statusSelect = document.getElementById('filter-status-select');
  const resetBtn = document.getElementById('reset-orders-btn');
  const paginationContainer = document.getElementById('orders-pagination');
  
  const totalCountEl = document.getElementById('order-total-count');
  const totalRevenueEl = document.getElementById('seller-total-revenue');

  // Detail Modal Elements
  const detailModalOverlay = document.getElementById('order-detail-modal-overlay');
  const detailForm = document.getElementById('order-process-form');
  const detailIdField = document.getElementById('order-id-field');
  const detailIdText = document.getElementById('detail-order-id');
  const detailDateText = document.getElementById('detail-order-date');
  const detailPaymentText = document.getElementById('detail-payment-method');
  const detailAddressText = document.getElementById('detail-buyer-address');
  const detailCourierText = document.getElementById('detail-shipping-courier');
  const detailCostText = document.getElementById('detail-shipping-cost');
  const detailItemsList = document.getElementById('detail-items-list');
  
  const editStatusSelect = document.getElementById('edit-order-status');
  const editResiInput = document.getElementById('edit-order-resi');
  const editCourierInput = document.getElementById('edit-order-courier-name');
  const editResiContainer = document.getElementById('resi-input-container');
  const editNotesField = document.getElementById('edit-notes-field') || document.getElementById('edit-order-notes');

  // Load orders
  function loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
    const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    
    // Filter products belonging to this seller
    const sellerProducts = products.filter(p => p.sellerId === sellerId);

    // Filter orders that contain at least one item from this seller
    state.orders = allOrders.filter(o => o.items.some(item => {
      return sellerProducts.some(p => p.id === item.id);
    }));

    calculateStatusCounts(sellerProducts);
    applyFilters();
  }

  // Calculate status cards counts
  function calculateStatusCounts(sellerProducts) {
    const counts = {
      'Menunggu Pembayaran': 0,
      'Diproses': 0,
      'Dikirim': 0,
      'Selesai': 0,
      'Dibatalkan': 0,
      'Refund': 0
    };

    state.orders.forEach(o => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });

    document.getElementById('count-status-menunggu').textContent = counts['Menunggu Pembayaran'];
    document.getElementById('count-status-diproses').textContent = counts['Diproses'];
    document.getElementById('count-status-dikirim').textContent = counts['Dikirim'];
    document.getElementById('count-status-selesai').textContent = counts['Selesai'];
    document.getElementById('count-status-dibatalkan').textContent = counts['Dibatalkan'];
    document.getElementById('count-status-refund').textContent = counts['Refund'];

    // Calculate completed revenue for seller items only
    let totalCompletedRevenue = 0;
    const completedOrders = state.orders.filter(o => o.status === 'Selesai');
    completedOrders.forEach(o => {
      o.items.forEach(item => {
        const isSellerItem = sellerProducts.some(p => p.id === item.id);
        if (isSellerItem) {
          totalCompletedRevenue += (item.price * item.qty) * 0.95;
        }
      });
    });

    totalRevenueEl.textContent = window.idr(totalCompletedRevenue);
  }

  // Filter orders
  function applyFilters() {
    state.filteredOrders = state.orders.filter(o => {
      // Search (ID or Buyer)
      const matchesSearch = state.search === '' ||
        o.id.toLowerCase().includes(state.search.toLowerCase()) ||
        (o.buyer && o.buyer.toLowerCase().includes(state.search.toLowerCase()));

      // Status
      const matchesStatus = state.status === 'Semua' || o.status === state.status;

      return matchesSearch && matchesStatus;
    });

    // Highlight summary card filters
    const statusCards = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan', 'Refund'];
    const cardIds = ['status-card-menunggu', 'status-card-diproses', 'status-card-dikirim', 'status-card-selesai', 'status-card-dibatalkan', 'status-card-refund'];
    
    statusCards.forEach((status, idx) => {
      const card = document.getElementById(cardIds[idx]);
      if (card) {
        if (state.status === status) {
          card.style.backgroundColor = 'var(--bg-alt)';
          card.style.borderColor = 'var(--accent)';
        } else {
          card.style.backgroundColor = 'var(--bg-paper)';
          card.style.borderColor = 'var(--muted-light)';
        }
      }
    });

    // Pagination adjustment
    const maxPages = Math.ceil(state.filteredOrders.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredOrders.length;
    renderTable();
    renderPagination();
  }

  // Render order table
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredOrders.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;" class="text-muted">Tidak ada pesanan masuk yang ditemukan</td></tr>`;
      return;
    }

    const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    const sellerProducts = products.filter(p => p.sellerId === sellerId);

    let html = '';
    paginated.forEach(o => {
      let pillClass = 'status-menunggu';
      if (o.status === 'Diproses') pillClass = 'status-diproses';
      if (o.status === 'Dikirim') pillClass = 'status-dikirim';
      if (o.status === 'Selesai') pillClass = 'status-selesai';
      if (o.status === 'Dibatalkan') pillClass = 'status-dibatalkan';
      if (o.status === 'Refund') pillClass = 'status-refund';

      // Get items in this order that belong to this seller
      const sellerItems = o.items.filter(item => sellerProducts.some(p => p.id === item.id));
      const itemsText = sellerItems.map(item => `${item.name} (${item.qty}x)`).join(', ');
      
      const totalItems = sellerItems.reduce((sum, item) => sum + item.qty, 0);
      const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.95;

      html += `
        <tr>
          <td class="mono accent"><a href="#" onclick="openOrderDetailModal('${o.id}')">${o.id}</a></td>
          <td>${o.buyer || 'Budi Santoso'}</td>
          <td style="font-size:0.75rem;">${itemsText}</td>
          <td class="mono">${totalItems}</td>
          <td class="mono font-weight-bold">${window.idr(sellerSubtotal)}</td>
          <td>
            <span class="status-pill ${pillClass}">
              <span class="dot"></span>
              ${o.status}
            </span>
          </td>
          <td class="mono text-muted">${o.date}</td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 8px;" onclick="openOrderDetailModal('${o.id}')">
              PROSES
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // Render pagination
  function renderPagination() {
    if (!paginationContainer) return;
    
    const maxPages = Math.ceil(state.filteredOrders.length / state.perPage);
    if (maxPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = '';
    const prevDisabled = state.page === 1 ? 'disabled' : '';
    html += `<button class="pagination-btn" ${prevDisabled} onclick="changePage(${state.page - 1})">←</button>`;

    for (let i = 1; i <= maxPages; i++) {
      const activeClass = state.page === i ? 'active' : '';
      html += `<button class="pagination-btn ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    const nextDisabled = state.page === maxPages ? 'disabled' : '';
    html += `<button class="pagination-btn" ${nextDisabled} onclick="changePage(${state.page + 1})">→</button>`;

    paginationContainer.innerHTML = html;
  }

  window.changePage = function(pNum) {
    state.page = pNum;
    applyFilters();
  };

  window.setFilterStatus = function(status) {
    state.status = status;
    state.page = 1;
    if (statusSelect) statusSelect.value = status;
    applyFilters();
  };

  // Search input filter
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

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      state.status = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.search = '';
      state.status = 'Semua';
      state.page = 1;
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'Semua';
      applyFilters();
    });
  }

  // Toggle Resi Input
  if (editStatusSelect) {
    editStatusSelect.addEventListener('change', (e) => {
      toggleResiField(e.target.value);
    });
  }

  function toggleResiField(status) {
    if (status === 'Dikirim') {
      editResiContainer.style.display = 'block';
      editResiInput.required = true;
      editCourierInput.required = true;
    } else {
      editResiContainer.style.display = 'none';
      editResiInput.required = false;
      editCourierInput.required = false;
      editResiInput.value = '';
      editCourierInput.value = '';
    }
  }

  // Open detail modal
  window.openOrderDetailModal = function(id) {
    const allOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
    const o = allOrders.find(ord => ord.id === id);
    if (!o) return;

    const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    const sellerProducts = products.filter(p => p.sellerId === sellerId);

    // Populate general details
    detailIdField.value = o.id;
    detailIdText.textContent = o.id;
    detailDateText.textContent = `Tanggal Order: ${o.date}`;
    detailPaymentText.textContent = o.paymentMethod || 'DANA';

    const phone = o.buyerPhone || (o.buyerEmail === 'budi.santoso@email.com' ? '081234567890' : '-');
    const addressDetails = o.buyerAddress || o.address || 'Magetan, Jawa Timur';
    detailAddressText.innerHTML = `
      <strong>${o.buyer || 'Budi Santoso'}</strong> (${phone})<br>
      ${addressDetails}
    `;

    // Shipping
    const courierLabel = o.shippingCourier === 'jne-yes' ? 'JNE YES (Yakin Esok Sampai)' : (o.shippingCourier === 'sicepat' ? 'SiCepat' : 'JNE Regular');
    detailCourierText.textContent = courierLabel;
    detailCostText.textContent = window.idr(o.shippingCost || 18000);

    // Status action
    editStatusSelect.value = o.status;
    toggleResiField(o.status);
    editResiInput.value = o.resi || '';
    editCourierInput.value = o.shippingCarrier || '';
    editNotesField.value = o.notes || '';

    // Render items belonging to this seller
    let itemsHtml = '';
    const sellerItems = o.items.filter(item => sellerProducts.some(p => p.id === item.id));
    
    sellerItems.forEach(item => {
      let imgUrl = (item.photo.startsWith('http') || item.photo.includes('/')) ? item.photo : `https://images.unsplash.com/${item.photo}?w=80&h=80&fit=crop&auto=format`;
      if (imgUrl.startsWith('../assets/')) {
        imgUrl = '../' + imgUrl;
      }
      itemsHtml += `
        <div style="display:flex; align-items:center; gap:var(--space-md); padding-bottom:8px; border-bottom:1px solid var(--muted-light);">
          <img src="${imgUrl}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--muted-light);">
          <div style="flex:1;">
            <strong style="display:block; font-size:0.75rem;">${item.name}</strong>
            <span class="caption text-muted" style="font-size:0.65rem;">Varian: ${item.variant || '-'} · Qty: ${item.qty}x</span>
          </div>
          <span class="mono font-weight-bold" style="font-size:0.75rem;">${window.idr(item.price * item.qty)}</span>
        </div>
      `;
    });

    const subtotal = sellerItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.011; // 1.1%
    const adminFee = subtotal * 0.05; // 5% platform fee
    const sellerNet = subtotal - adminFee;

    itemsHtml += `
      <div style="display:flex; flex-direction:column; gap:4px; padding-top:8px; font-size:0.7rem;" class="text-muted">
        <div class="flex-between">
          <span>Subtotal Produk Anda:</span>
          <span>${window.idr(subtotal)}</span>
        </div>
        <div class="flex-between">
          <span>Potongan Komisi Platform (5%):</span>
          <span class="text-error">- ${window.idr(adminFee)}</span>
        </div>
        <div class="flex-between" style="border-top:1px dashed var(--muted); padding-top:6px; margin-top:4px; font-weight:700; color:var(--text-primary);">
          <span>Pendapatan Bersih Anda:</span>
          <span style="font-size:0.85rem;" class="text-success">${window.idr(sellerNet)}</span>
        </div>
      </div>
    `;

    detailItemsList.innerHTML = itemsHtml;
    window.openModal('order-detail-modal-overlay');
  };

  // Submit process order form
  if (detailForm) {
    detailForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = detailIdField.value;
      const status = editStatusSelect.value;
      const resi = editResiInput.value.trim();
      const carrier = editCourierInput.value.trim();
      const notes = editNotesField.value.trim();

      const allOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
      const index = allOrders.findIndex(ord => ord.id === id);

      if (index !== -1) {
        allOrders[index].status = status;
        allOrders[index].notes = notes;
        
        if (status === 'Dikirim') {
          allOrders[index].resi = resi;
          allOrders[index].shippingCarrier = carrier || 'JNE REG';
        }

        localStorage.setItem('kuleather_profile_orders', JSON.stringify(allOrders));

        // Create notification for buyer (systems notification)
        createSystemNotification(`Pesanan #${id} statusnya diperbarui menjadi '${status}' oleh penjual`, 'order', 'var(--accent)');
        window.showToast(`Pesanan #${id} berhasil diupdate ke status '${status}'`, 'success');
        
        window.closeModal('order-detail-modal-overlay');
        loadOrders();
      }
    });
  }

  // Helper system notification
  function createSystemNotification(message, type, color) {
    const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
    notifications.push({
      id: 'notif-' + Date.now(),
      message: message,
      type: type,
      read: false,
      color: color,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));
  }

  // ==========================================================================
  // CUSTOM SERVICE REQUESTS TABS & LOGIC
  // ==========================================================================
  const tabProductOrders = document.getElementById('btn-tab-product-orders');
  const tabCustomRequests = document.getElementById('btn-tab-custom-requests');
  const secProductOrders = document.getElementById('section-product-orders');
  const secCustomRequests = document.getElementById('section-custom-requests');
  const customSearchInput = document.getElementById('custom-search-input');
  
  const customState = {
    requests: [],
    filteredRequests: [],
    search: '',
    page: 1,
    perPage: 10
  };

  if (tabProductOrders && tabCustomRequests && secProductOrders && secCustomRequests) {
    tabProductOrders.addEventListener('click', () => {
      tabProductOrders.classList.add('active');
      tabProductOrders.style.color = 'var(--accent)';
      tabProductOrders.style.borderBottom = '2px solid var(--accent)';

      tabCustomRequests.classList.remove('active');
      tabCustomRequests.style.color = 'var(--text-secondary)';
      tabCustomRequests.style.borderBottom = 'none';

      secProductOrders.classList.remove('hidden');
      secCustomRequests.classList.add('hidden');
    });

    tabCustomRequests.addEventListener('click', () => {
      tabCustomRequests.classList.add('active');
      tabCustomRequests.style.color = 'var(--accent)';
      tabCustomRequests.style.borderBottom = '2px solid var(--accent)';

      tabProductOrders.classList.remove('active');
      tabProductOrders.style.color = 'var(--text-secondary)';
      tabProductOrders.style.borderBottom = 'none';

      secCustomRequests.classList.remove('hidden');
      secProductOrders.classList.add('hidden');
      loadCustomRequests();
    });
  }

  function loadCustomRequests() {
    const allCustomRequests = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
    // Filter only requests for this seller
    customState.requests = allCustomRequests.filter(r => r.sellerId === sellerId);
    
    // Update badge count
    const countBadge = document.getElementById('custom-requests-count-badge');
    const activeRequests = customState.requests.filter(r => r.status !== 'SELESAI' && r.status !== 'DIBATALKAN');
    if (countBadge) {
      countBadge.textContent = activeRequests.length;
      if (activeRequests.length > 0) {
        countBadge.style.display = 'inline-block';
      } else {
        countBadge.style.display = 'none';
      }
    }

    applyCustomFilters();
  }

  function applyCustomFilters() {
    customState.filteredRequests = customState.requests.filter(r => {
      const query = customState.search.toLowerCase();
      const matchesSearch = query === '' ||
        r.id.toLowerCase().includes(query) ||
        r.buyerName.toLowerCase().includes(query) ||
        r.serviceName.toLowerCase().includes(query);
      return matchesSearch;
    });

    renderCustomTable();
    renderCustomPagination();
  }

  if (customSearchInput) {
    let customSearchTimeout;
    customSearchInput.addEventListener('input', (e) => {
      clearTimeout(customSearchTimeout);
      customSearchTimeout = setTimeout(() => {
        customState.search = e.target.value.trim();
        customState.page = 1;
        applyCustomFilters();
      }, 300);
    });
  }

  function renderCustomTable() {
    const customTbody = document.getElementById('custom-requests-table-tbody');
    if (!customTbody) return;

    const start = (customState.page - 1) * customState.perPage;
    const end = start + customState.perPage;
    const paginated = customState.filteredRequests.slice(start, end);

    if (paginated.length === 0) {
      customTbody.innerHTML = `<tr><td colspan="8" style="text-align:center;" class="text-muted">Tidak ada request jasa yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(r => {
      let statusColor = 'var(--text-secondary)';
      let statusText = r.status;

      if (r.status === 'SELESAI') statusColor = 'var(--success)';
      if (r.status === 'DIKERJAKAN' || r.status === 'HASIL_DIKIRIM') statusColor = 'var(--info)';
      if (r.status === 'REQUEST_SENT' || r.status === 'PENAWARAN_DIKIRIM') statusColor = 'var(--warning)';
      if (r.status === 'DIBAYAR_ESCROW') statusColor = 'var(--success)';
      if (r.status === 'DIBATALKAN') statusColor = 'var(--error)';

      if (r.status === 'REQUEST_SENT') statusText = 'Request Diajukan';
      else if (r.status === 'PENAWARAN_DIKIRIM') statusText = 'Review Penawaran';
      else if (r.status === 'DEAL') statusText = 'Deal (Belum Bayar)';
      else if (r.status === 'DIBAYAR_ESCROW') statusText = 'Escrow Terbayar';
      else if (r.status === 'DIKERJAKAN') statusText = 'Dalam Pengerjaan';
      else if (r.status === 'HASIL_DIKIRIM') statusText = 'Hasil Dikirim';
      else if (r.status === 'SELESAI') statusText = 'Selesai';
      else if (r.status === 'DIBATALKAN') statusText = 'Dibatalkan';
      else if (r.status === 'DISPUTE') statusText = 'Komplain Mediasi';

      const priceVal = r.offer ? r.offer.finalPrice : r.request.budget;

      html += `
        <tr>
          <td class="mono accent"><a href="../service-request.html?orderId=${r.id}">${r.id}</a></td>
          <td>${r.buyerName}</td>
          <td><strong style="font-size:0.85rem; display:block;">${r.serviceName}</strong></td>
          <td class="mono font-weight-bold">${window.idr(priceVal)}</td>
          <td class="mono">${r.revisions.used} / ${r.revisions.max} kali</td>
          <td>
            <span class="status-pill" style="border-color:${statusColor}33; color:${statusColor}; background:none; padding:4px 8px; border-radius:var(--radius-sm);">
              ${statusText}
            </span>
          </td>
          <td class="mono text-muted">${r.date}</td>
          <td style="text-align: right;">
            <a href="../service-request.html?orderId=${r.id}" class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 8px;">
              WORKSPACE
            </a>
          </td>
        </tr>
      `;
    });

    customTbody.innerHTML = html;
  }

  function renderCustomPagination() {
    const container = document.getElementById('custom-requests-pagination');
    if (!container) return;

    const maxPages = Math.ceil(customState.filteredRequests.length / customState.perPage);
    if (maxPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    const prevDisabled = customState.page === 1 ? 'disabled' : '';
    html += `<button class="pagination-btn" ${prevDisabled} onclick="changeCustomPage(${customState.page - 1})">←</button>`;

    for (let i = 1; i <= maxPages; i++) {
      const activeClass = customState.page === i ? 'active' : '';
      html += `<button class="pagination-btn ${activeClass}" onclick="changeCustomPage(${i})">${i}</button>`;
    }

    const nextDisabled = customState.page === maxPages ? 'disabled' : '';
    html += `<button class="pagination-btn" ${nextDisabled} onclick="changeCustomPage(${customState.page + 1})">→</button>`;

    container.innerHTML = html;
  }

  window.changeCustomPage = function(pNum) {
    customState.page = pNum;
    applyCustomFilters();
  };

  // Seed notification badge on load
  const allCustomRequests = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
  const myRequests = allCustomRequests.filter(r => r.sellerId === sellerId);
  const myActiveRequests = myRequests.filter(r => r.status !== 'SELESAI' && r.status !== 'DIBATALKAN');
  const countBadge = document.getElementById('custom-requests-count-badge');
  if (countBadge && myActiveRequests.length > 0) {
    countBadge.textContent = myActiveRequests.length;
    countBadge.style.display = 'inline-block';
  }

  loadOrders();
});
