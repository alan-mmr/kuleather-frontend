// ==========================================================================
// 🌿 Kuleather Light — Admin Service Orders Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. State
  const state = {
    serviceOrders: [],
    filteredOrders: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('service-orders-table-tbody');
  const searchInput = document.getElementById('service-orders-search-input');
  const statusSelect = document.getElementById('filter-service-orders-status');
  const paginationContainer = document.getElementById('service-orders-pagination');

  // Stats Elements
  const statsNegoEl = document.getElementById('stats-negotiating-count');
  const statsWipEl = document.getElementById('stats-wip-count');
  const statsCompletedEl = document.getElementById('stats-completed-count');

  // Modal Elements
  const mSvcId = document.getElementById('md-svc-id');
  const mSvcDate = document.getElementById('md-svc-date');
  const mSvcName = document.getElementById('md-svc-name');
  const mSvcBuyer = document.getElementById('md-svc-buyer');
  const mSvcSeller = document.getElementById('md-svc-seller');
  const mSvcBudget = document.getElementById('md-svc-budget');
  const mSvcDeal = document.getElementById('md-svc-deal');
  const mSvcEscrow = document.getElementById('md-svc-escrow');
  const mSvcRevisions = document.getElementById('md-svc-revisions');
  const mSvcTimelineLog = document.getElementById('md-svc-timeline-log');

  // 2. Load service orders data
  function loadServiceOrders() {
    const list = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
    state.serviceOrders = list;

    calculateStats();
    applyFilters();
  }

  // 3. Calculate metrics
  function calculateStats() {
    let negoCount = 0;
    let wipCount = 0;
    let completedCount = 0;

    state.serviceOrders.forEach(o => {
      if (['REQUEST_SENT', 'PENAWARAN_DIKIRIM', 'DEAL'].includes(o.status)) {
        negoCount++;
      } else if (['DIBAYAR_ESCROW', 'DIKERJAKAN', 'HASIL_DIKIRIM', 'DISPUTE'].includes(o.status)) {
        wipCount++;
      } else if (o.status === 'SELESAI') {
        completedCount++;
      }
    });

    if (statsNegoEl) statsNegoEl.textContent = negoCount;
    if (statsWipEl) statsWipEl.textContent = wipCount;
    if (statsCompletedEl) statsCompletedEl.textContent = completedCount;

    const totalEl = document.getElementById('service-orders-total-count');
    if (totalEl) totalEl.textContent = state.serviceOrders.length;
  }

  // 4. Filters & Search
  function applyFilters() {
    state.filteredOrders = state.serviceOrders.filter(o => {
      const query = state.search.toLowerCase();
      const matchesSearch = query === '' ||
        o.id.toLowerCase().includes(query) ||
        o.serviceName.toLowerCase().includes(query) ||
        o.buyerName.toLowerCase().includes(query) ||
        o.sellerName.toLowerCase().includes(query);

      const matchesStatus = state.status === 'Semua' || o.status === state.status;

      return matchesSearch && matchesStatus;
    });

    const maxPages = Math.ceil(state.filteredOrders.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    renderTable();
    renderPagination();
  }

  // 5. Render Table rows
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredOrders.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada pesanan jasa yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(o => {
      let statusColor = 'var(--text-secondary)';
      let statusText = o.status;

      if (o.status === 'SELESAI') statusColor = 'var(--success)';
      if (o.status === 'DIKERJAKAN' || o.status === 'HASIL_DIKIRIM') statusColor = 'var(--info)';
      if (o.status === 'REQUEST_SENT' || o.status === 'PENAWARAN_DIKIRIM') statusColor = 'var(--warning)';
      if (o.status === 'DIBAYAR_ESCROW') statusColor = 'var(--success)';
      if (o.status === 'DIBATALKAN') statusColor = 'var(--error)';

      if (o.status === 'REQUEST_SENT') statusText = 'Request Diajukan';
      else if (o.status === 'PENAWARAN_DIKIRIM') statusText = 'Review Penawaran';
      else if (o.status === 'DEAL') statusText = 'Deal (Belum Bayar)';
      else if (o.status === 'DIBAYAR_ESCROW') statusText = 'Escrow Terbayar';
      else if (o.status === 'DIKERJAKAN') statusText = 'Dalam Pengerjaan';
      else if (o.status === 'HASIL_DIKIRIM') statusText = 'Hasil Dikirim';
      else if (o.status === 'SELESAI') statusText = 'Selesai';
      else if (o.status === 'DIBATALKAN') statusText = 'Dibatalkan';
      else if (o.status === 'DISPUTE') statusText = 'Komplain Mediasi';

      const priceVal = o.offer ? o.offer.finalPrice : o.request.budget;

      html += `
        <tr>
          <td class="mono accent"><a href="#" onclick="viewSvcOrderDetail('${o.id}')">${o.id}</a></td>
          <td><strong style="font-size:0.85rem; display:block;">${o.serviceName}</strong></td>
          <td>${o.buyerName}</td>
          <td><strong>${o.sellerName}</strong></td>
          <td class="mono font-weight-bold">${window.idr(priceVal)}</td>
          <td class="mono">${o.revisions.used} / ${o.revisions.max} kali</td>
          <td>
            <span class="status-pill" style="border-color:${statusColor}33; color:${statusColor}; background:none; padding:4px 8px; border-radius:var(--radius-sm);">
              ${statusText}
            </span>
          </td>
          <td class="mono text-muted">${o.date}</td>
          <td style="text-align: right;">
            <div style="display:flex; gap:6px; justify-content:flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="viewSvcOrderDetail('${o.id}')" style="padding: 6px 10px; font-size: 8px;">
                LOG DETAIL
              </button>
              <a href="../service-request.html?orderId=${o.id}&bypass=true" target="_blank" class="btn btn-primary btn-sm" style="padding: 6px 10px; font-size: 8px;">
                WORKSPACE
              </a>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // 6. Pagination
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

  // 7. Modal View Details
  window.viewSvcOrderDetail = function(id) {
    const o = state.serviceOrders.find(item => item.id === id);
    if (!o) return;

    mSvcId.textContent = o.id;
    mSvcDate.textContent = o.date;
    mSvcName.textContent = o.serviceName;
    mSvcBuyer.textContent = o.buyerName;
    mSvcSeller.textContent = o.sellerName;
    
    mSvcBudget.textContent = window.idr(o.request.budget);
    mSvcDeal.textContent = o.offer ? window.idr(o.offer.finalPrice) : 'Belum Deal';
    
    mSvcEscrow.textContent = o.escrow ? o.escrow.status : 'BELUM DIBAYAR';
    mSvcRevisions.textContent = `${o.revisions.used} / ${o.revisions.max} kali`;

    // Load timeline log list
    mSvcTimelineLog.innerHTML = '';
    let logsHtml = '';
    o.timeline.forEach(t => {
      logsHtml += `[${t.date}] STATUS: ${t.status}\n  => ${t.text}\n`;
    });
    
    if (o.progress && o.progress.length > 0) {
      logsHtml += `\n--- PROGRES KERJA (WIP) ---\n`;
      o.progress.forEach(p => {
        logsHtml += `[${p.date} ${p.time}] WIP: ${p.description}\n`;
      });
    }

    if (o.revisions && o.revisions.history && o.revisions.history.length > 0) {
      logsHtml += `\n--- RIWAYAT REVISI ---\n`;
      o.revisions.history.forEach((h, idx) => {
        logsHtml += `[${h.date}] REVISI #${idx + 1}: ${h.request} (Status: ${h.status})\n`;
      });
    }

    mSvcTimelineLog.textContent = logsHtml;

    window.openModal('service-order-detail-modal-overlay');
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

  loadServiceOrders();
});
