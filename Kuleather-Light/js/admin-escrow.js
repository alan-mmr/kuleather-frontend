// ==========================================================================
// 🌿 Kuleather Light — Admin Escrow Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. State
  const state = {
    escrowItems: [],
    filteredItems: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('escrow-table-tbody');
  const searchInput = document.getElementById('escrow-search-input');
  const statusSelect = document.getElementById('filter-escrow-status');
  const paginationContainer = document.getElementById('escrow-pagination');

  // Stats Card Elements
  const heldEl = document.getElementById('escrow-total-held');
  const releasedEl = document.getElementById('escrow-total-released');
  const feesEl = document.getElementById('escrow-total-fees');
  const refundedEl = document.getElementById('escrow-total-refunded');

  // 2. Load Escrow Data
  function loadEscrowItems() {
    const productOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
    const serviceOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];

    const items = [];

    // Map Product Orders to Escrow Schema
    productOrders.forEach(o => {
      let escrowStatus = 'PENDING_PAYMENT';
      if (o.status === 'Selesai') {
        escrowStatus = 'DILEPAS';
      } else if (['Dibatalkan', 'Refund'].includes(o.status)) {
        escrowStatus = 'REFUNDED';
      } else if (['Dibayar', 'Diproses', 'Dikirim'].includes(o.status)) {
        escrowStatus = 'DITAHAN';
      }

      // Estimate platform fee & net payout
      const value = o.total || 0;
      const fee = value * 0.05;
      const payout = value * 0.95;

      items.push({
        id: o.id,
        type: 'Produk',
        sellerName: o.seller || 'Mitra Kuleather',
        buyerName: o.buyer || 'Pembeli',
        totalValue: value,
        platformFee: fee,
        sellerReceives: payout,
        escrowStatus: escrowStatus,
        date: o.date,
        rawOrder: o,
        isService: false
      });
    });

    // Map Service Orders to Escrow Schema
    serviceOrders.forEach(s => {
      let escrowStatus = 'PENDING_PAYMENT';
      if (s.escrow && s.escrow.status) {
        if (s.escrow.status === 'DITAHAN') escrowStatus = 'DITAHAN';
        else if (s.escrow.status === 'DILEPAS') escrowStatus = 'DILEPAS';
        else if (s.escrow.status === 'REFUNDED') escrowStatus = 'REFUNDED';
      } else if (s.status === 'SELESAI') {
        escrowStatus = 'DILEPAS';
      } else if (s.status === 'DIBATALKAN') {
        escrowStatus = 'REFUNDED';
      } else if (['DIBAYAR_ESCROW', 'DIKERJAKAN', 'HASIL_DIKIRIM'].includes(s.status)) {
        escrowStatus = 'DITAHAN';
      }

      const value = s.offer ? s.offer.finalPrice : s.request.budget;
      const fee = s.escrow && s.escrow.platformFee ? s.escrow.platformFee : value * 0.05;
      const payout = s.escrow && s.escrow.sellerReceives ? s.escrow.sellerReceives : value * 0.95;

      items.push({
        id: s.id,
        type: 'Jasa',
        sellerName: s.sellerName || 'Mitra Pengrajin',
        buyerName: s.buyerName || 'Pembeli',
        totalValue: value,
        platformFee: fee,
        sellerReceives: payout,
        escrowStatus: escrowStatus,
        date: s.date,
        rawOrder: s,
        isService: true
      });
    });

    state.escrowItems = items;
    calculateStats();
    applyFilters();
  }

  // 3. Calculate Stats cards values
  function calculateStats() {
    let held = 0;
    let released = 0;
    let fees = 0;
    let refunded = 0;

    state.escrowItems.forEach(item => {
      if (item.escrowStatus === 'DITAHAN') {
        held += item.totalValue;
      } else if (item.escrowStatus === 'DILEPAS') {
        released += item.sellerReceives;
        fees += item.platformFee;
      } else if (item.escrowStatus === 'REFUNDED') {
        refunded += item.totalValue;
      }
    });

    if (heldEl) heldEl.textContent = window.idr(held);
    if (releasedEl) releasedEl.textContent = window.idr(released);
    if (feesEl) feesEl.textContent = window.idr(fees);
    if (refundedEl) refundedEl.textContent = window.idr(refunded);
  }

  // 4. Filters & Searches
  function applyFilters() {
    state.filteredItems = state.escrowItems.filter(item => {
      // Search matches
      const query = state.search.toLowerCase();
      const matchesSearch = query === '' ||
        item.id.toLowerCase().includes(query) ||
        item.sellerName.toLowerCase().includes(query) ||
        item.buyerName.toLowerCase().includes(query);

      // Status matches
      const matchesStatus = state.status === 'Semua' || item.escrowStatus === state.status;

      return matchesSearch && matchesStatus;
    });

    // Reset page if out of bounds
    const maxPages = Math.ceil(state.filteredItems.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    renderTable();
    renderPagination();
  }

  // 5. Render Table rows
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredItems.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada transaksi escrow terdaftar</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(item => {
      let badgeClass = 'status-pending';
      let badgeText = 'Pending Payout';

      if (item.escrowStatus === 'PENDING_PAYMENT') {
        badgeClass = 'status-menunggu';
        badgeText = 'Belum Bayar';
      } else if (item.escrowStatus === 'DITAHAN') {
        badgeClass = 'status-diproses';
        badgeText = 'Hold (DITAHAN)';
      } else if (item.escrowStatus === 'DILEPAS') {
        badgeClass = 'status-selesai';
        badgeText = 'DILEPAS (Cair)';
      } else if (item.escrowStatus === 'REFUNDED') {
        badgeClass = 'status-dibatalkan';
        badgeText = 'Refunded';
      }

      // Action buttons
      let actionBtn = '';
      if (item.escrowStatus === 'DITAHAN') {
        actionBtn = `
          <button class="btn btn-primary btn-sm" onclick="forceReleaseEscrow('${item.id}', ${item.isService})" style="font-size:8px; padding:4px 8px; background-color:var(--success); border-color:var(--success);">
            LEPAS MANUAL
          </button>
        `;
      } else {
        actionBtn = `<span class="caption text-muted">-</span>`;
      }

      html += `
        <tr>
          <td class="mono accent">${item.id}</td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; background:rgba(0,0,0,0.05); color:var(--text-primary); border:none; padding:2px 6px;">${item.type}</span></td>
          <td><strong>${item.sellerName}</strong></td>
          <td>${item.buyerName}</td>
          <td class="mono font-weight-bold">${window.idr(item.totalValue)}</td>
          <td class="mono text-muted">${window.idr(item.platformFee)}</td>
          <td class="mono text-success">${window.idr(item.sellerReceives)}</td>
          <td>
            <span class="status-pill ${badgeClass}">
              <span class="dot"></span>
              ${badgeText}
            </span>
          </td>
          <td style="text-align: right;">
            ${actionBtn}
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // 6. Pagination
  function renderPagination() {
    if (!paginationContainer) return;

    const maxPages = Math.ceil(state.filteredItems.length / state.perPage);
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

  // 7. Manual Override Release Escrow
  window.forceReleaseEscrow = function(id, isService) {
    if (confirm(`Apakah Anda yakin ingin melakukan Override Pabean / Lepas Dana Manual untuk order #${id}? Dana akan dicairkan langsung ke saldo penjual.`)) {
      if (isService) {
        const serviceOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
        const idx = serviceOrders.findIndex(s => s.id === id);
        if (idx !== -1) {
          serviceOrders[idx].status = 'SELESAI';
          if (!serviceOrders[idx].escrow) {
            serviceOrders[idx].escrow = {};
          }
          serviceOrders[idx].escrow.status = 'DILEPAS';
          serviceOrders[idx].timeline.push({
            status: "SELESAI",
            date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            text: "Eskrow dilepas secara manual oleh Administrator."
          });
          localStorage.setItem('kuleather_service_orders', JSON.stringify(serviceOrders));
        }
      } else {
        const productOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
        const idx = productOrders.findIndex(o => o.id === id);
        if (idx !== -1) {
          productOrders[idx].status = 'Selesai';
          localStorage.setItem('kuleather_profile_orders', JSON.stringify(productOrders));
        }
      }

      window.showToast(`Eskrow untuk order #${id} berhasil dilepaskan manual ke Penjual!`, 'success');
      loadEscrowItems();
    }
  };

  // Bind Filters
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

  loadEscrowItems();
});
