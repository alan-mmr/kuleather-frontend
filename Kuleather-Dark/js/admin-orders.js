// ==========================================================================
// 🌿 Kuleather Light — Admin Orders Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. State
  const state = {
    orders: [],
    filteredOrders: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua',
    payment: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('orders-table-tbody');
  const searchInput = document.getElementById('order-search-input');
  const statusSelect = document.getElementById('filter-status-select');
  const paymentSelect = document.getElementById('filter-payment-select');
  const resetBtn = document.getElementById('reset-orders-btn');
  const paginationContainer = document.getElementById('orders-pagination');
  
  const totalCountEl = document.getElementById('order-total-count');
  const totalCompletedEl = document.getElementById('total-completed-revenue');

  // Detail Modal Elements
  const detailModalOverlay = document.getElementById('order-detail-modal-overlay');
  const detailForm = document.getElementById('order-edit-form');
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
  const editResiContainer = document.getElementById('resi-input-container');
  const editNotesField = document.getElementById('edit-order-notes');

  // Load orders from localStorage
  function loadOrders() {
    state.orders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
    calculateStatusCounts();
    applyFilters();
  }

  // Calculate counts for summary cards
  function calculateStatusCounts() {
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

    // Write counts to DOM elements
    document.getElementById('count-status-menunggu').textContent = counts['Menunggu Pembayaran'];
    document.getElementById('count-status-diproses').textContent = counts['Diproses'];
    document.getElementById('count-status-dikirim').textContent = counts['Dikirim'];
    document.getElementById('count-status-selesai').textContent = counts['Selesai'];
    document.getElementById('count-status-dibatalkan').textContent = counts['Dibatalkan'];
    document.getElementById('count-status-refund').textContent = counts['Refund'];

    // Calculate Completed Revenue
    const completedOrders = state.orders.filter(o => o.status === 'Selesai');
    const totalCompletedRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    totalCompletedEl.textContent = idr(totalCompletedRevenue);
  }

  // Filter & Sort
  function applyFilters() {
    state.filteredOrders = state.orders.filter(o => {
      // Search (ID or Buyer name)
      const matchesSearch = state.search === '' ||
        o.id.toLowerCase().includes(state.search.toLowerCase()) ||
        (o.buyer && o.buyer.toLowerCase().includes(state.search.toLowerCase()));

      // Status
      const matchesStatus = state.status === 'Semua' || o.status === state.status;

      // Payment Method
      const matchesPayment = state.payment === 'Semua' || o.paymentMethod === state.payment;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    // Highlight active summary card filter
    const statusCards = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan', 'Refund'];
    const cardIds = ['status-card-menunggu', 'status-card-diproses', 'status-card-dikirim', 'status-card-selesai', 'status-card-dibatalkan', 'status-card-refund'];
    
    statusCards.forEach((status, idx) => {
      const card = document.getElementById(cardIds[idx]);
      if (card) {
        if (state.status === status) {
          card.style.backgroundColor = 'var(--surface-hover)';
          card.style.borderColor = 'var(--accent)';
        } else {
          card.style.backgroundColor = 'var(--surface)';
          card.style.borderColor = 'var(--muted-light)';
        }
      }
    });

    // Reset pagination to page 1 if current page becomes empty
    const maxPages = Math.ceil(state.filteredOrders.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredOrders.length;
    renderTable();
    renderPagination();
  }

  // Render table rows
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredOrders.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada transaksi yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(o => {
      // Status pill classes mapping
      let pillClass = 'status-menunggu';
      if (o.status === 'Diproses') pillClass = 'status-diproses';
      if (o.status === 'Dikirim') pillClass = 'status-dikirim';
      if (o.status === 'Selesai') pillClass = 'status-selesai';
      if (o.status === 'Dibatalkan') pillClass = 'status-dibatalkan';
      if (o.status === 'Refund') pillClass = 'status-refund';

      // Items list summary text
      const itemsText = o.items.map(item => `${item.name} (${item.qty}x)`).join(', ');

      html += `
        <tr>
          <td class="mono accent"><a href="#" onclick="openOrderDetailModal('${o.id}'); return false;">${o.id}</a></td>
          <td style="font-weight: 500;">${o.buyer || 'Budi Santoso'}</td>
          <td style="font-size: 0.75rem;">${o.seller || '-'}</td>
          <td class="text-muted" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem;" title="${itemsText}">
            ${itemsText}
          </td>
          <td class="mono font-weight-bold">${idr(o.total)}</td>
          <td class="mono" style="font-size: 0.7rem;">${o.paymentMethod || '-'}</td>
          <td>
            <span class="status-pill ${pillClass}">
              <span class="dot"></span>
              ${o.status}
            </span>
          </td>
          <td class="mono text-muted" style="font-size: 0.7rem;">${o.date}</td>
          <td class="admin-table-actions" style="justify-content: flex-end;">
            <button class="btn-admin btn-admin-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.65rem; text-transform: uppercase;" onclick="openOrderDetailModal('${o.id}')">
              Kelola
            </button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // Render Pagination
  function renderPagination() {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(state.filteredOrders.length / state.perPage);

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

  window.changePage = function(pageNum) {
    state.page = pageNum;
    tbody.scrollTo({ top: 0 });
    renderTable();
    renderPagination();
  };

  // Clickable summary card filter toggler
  window.setFilterStatus = function(status) {
    if (state.status === status) {
      state.status = 'Semua'; // Toggle off
    } else {
      state.status = status;
    }
    if (statusSelect) statusSelect.value = state.status;
    state.page = 1;
    applyFilters();
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

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      state.status = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  if (paymentSelect) {
    paymentSelect.addEventListener('change', (e) => {
      state.payment = e.target.value;
      state.page = 1;
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.search = '';
      state.status = 'Semua';
      state.payment = 'Semua';
      state.page = 1;

      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'Semua';
      if (paymentSelect) paymentSelect.value = 'Semua';

      applyFilters();
    });
  }

  // Toggle Resi Input based on status select
  if (editStatusSelect) {
    editStatusSelect.addEventListener('change', (e) => {
      toggleResiField(e.target.value);
    });
  }

  function toggleResiField(status) {
    if (status === 'Dikirim') {
      editResiContainer.style.display = 'block';
      editResiInput.required = true;
    } else {
      editResiContainer.style.display = 'none';
      editResiInput.required = false;
      editResiInput.value = '';
    }
  }

  // Open detail modal
  window.openOrderDetailModal = function(id) {
    const o = state.orders.find(ord => ord.id === id);
    if (!o) return;

    // Autofill texts
    detailIdField.value = o.id;
    detailIdText.textContent = o.id;
    detailDateText.textContent = `Tanggal Order: ${o.date}`;
    detailPaymentText.textContent = o.paymentMethod || 'DANA';
    
    // Address format
    const buyerPhone = o.buyerPhone || (o.buyerEmail === 'budi.santoso@email.com' ? '081234567890' : '-');
    const addressDetails = o.buyerAddress || o.address || 'Magetan, Jawa Timur';
    detailAddressText.innerHTML = `
      <strong>${o.buyer || 'Budi Santoso'}</strong> (${buyerPhone})<br>
      ${addressDetails}
    `;

    // Shipping courier rates
    const courierLabel = o.shippingCourier === 'jne-yes' ? 'JNE YES (Yakin Esok Sampai)' : (o.shippingCourier === 'sicepat' ? 'SiCepat' : 'JNE Regular');
    detailCourierText.textContent = courierLabel;
    detailCostText.textContent = idr(o.shippingCost || 18000);

    // Dropdowns & notes fields autofill
    editStatusSelect.value = o.status;
    toggleResiField(o.status);
    editResiInput.value = o.resi || '';
    editNotesField.value = o.notes || '';

    // Render items list inside modal
    let itemsHtml = '';
    o.items.forEach(item => {
      const imgUrl = item.photo.startsWith('http') || item.photo.startsWith('photo-') ? (item.photo.startsWith('photo-') ? `https://images.unsplash.com/${item.photo}?w=80&h=80&fit=crop&auto=format` : item.photo) : `https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop&auto=format`;
      itemsHtml += `
        <div style="display:flex; align-items:center; gap:var(--space-md); padding-bottom:8px; border-bottom:1px solid var(--muted-light);">
          <img src="${imgUrl}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--muted-light);">
          <div style="flex:1;">
            <strong style="display:block; font-size:0.75rem;">${item.name}</strong>
            <span class="caption text-muted" style="font-size:0.65rem;">Varian: ${item.variant || '-'} · Jumlah: ${item.qty}x</span>
          </div>
          <span class="mono font-weight-bold" style="font-size:0.75rem;">${idr(item.price * item.qty)}</span>
        </div>
      `;
    });
    // Add subtotal, tax and grandtotal to items list footer inside modal
    const subtotal = o.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.011; // 1.1%
    const grandtotal = o.total || (subtotal + tax + (o.shippingCost || 18000));
    
    itemsHtml += `
      <div style="display:flex; flex-direction:column; gap:4px; padding-top:8px; font-size:0.7rem;" class="text-muted">
        <div class="flex-between">
          <span>Subtotal Barang:</span>
          <span>${idr(subtotal)}</span>
        </div>
        <div class="flex-between">
          <span>Biaya Kirim:</span>
          <span>${idr(o.shippingCost || 18000)}</span>
        </div>
        <div class="flex-between">
          <span>PPN (1.1%):</span>
          <span>${idr(tax)}</span>
        </div>
        <div class="flex-between" style="border-top:1px dashed var(--muted); padding-top:6px; margin-top:4px; font-weight:700; color:var(--text-primary);">
          <span>Total Tagihan:</span>
          <span style="font-size:0.85rem;" class="text-accent">${idr(grandtotal)}</span>
        </div>
      </div>
    `;

    detailItemsList.innerHTML = itemsHtml;
    openModal('order-detail-modal-overlay');
  };

  // Submit edits form
  if (detailForm) {
    detailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = detailIdField.value;
      const status = editStatusSelect.value;
      const resi = editResiInput.value.trim();
      const notes = editNotesField.value.trim();

      const index = state.orders.findIndex(ord => ord.id === id);
      if (index !== -1) {
        const previousStatus = state.orders[index].status;
        
        state.orders[index].status = status;
        state.orders[index].resi = resi;
        state.orders[index].notes = notes;

        localStorage.setItem('kuleather_profile_orders', JSON.stringify(state.orders));

        // Create log notification for trace sync
        let notificationMsg = `Status pesanan #${id} diubah menjadi '${status}' oleh Admin Utama`;
        if (status === 'Dikirim' && resi !== '') {
          notificationMsg += ` (Resi: ${resi})`;
        }
        
        // Choose notification color
        let notifColor = 'var(--accent)';
        if (status === 'Selesai') notifColor = 'var(--success)';
        if (status === 'Dibatalkan' || status === 'Refund') notifColor = 'var(--error)';
        if (status === 'Dikirim') notifColor = 'var(--info)';

        createSystemNotification(notificationMsg, 'order', notifColor);
        showToast(`Pesanan #${id} berhasil diupdate ke status '${status}'.`, 'success');
        
        closeModal('order-detail-modal-overlay');
        loadOrders();
      }
    });
  }

  // Load Initial
  loadOrders();

  // Handle Query parameter redirection (e.g. opens modal directly on reload if param passed)
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdParam = urlParams.get('id');
  if (orderIdParam) {
    // Check if ID contains KUL- or ORD-
    openOrderDetailModal(orderIdParam);
  }
});
