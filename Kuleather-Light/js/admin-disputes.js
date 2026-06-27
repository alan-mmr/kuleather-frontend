// ==========================================================================
// 🌿 Kuleather Light — Admin Disputes Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mock Data Seeding
  const DEFAULT_DISPUTES = [
    {
      id: "DSP-101",
      orderId: "SVO-101",
      isService: true,
      buyerId: "u01",
      buyerName: "Budi Santoso",
      sellerId: "u02",
      sellerName: "Toko Pak Slamet",
      reason: "Hasil pengerjaan jaket tidak sesuai ukuran lingkar dada yang diajukan (longgar 10cm) dan pengrajin menolak merevisinya secara gratis.",
      status: "OPEN",
      date: "11 Jun 2026",
      escrowAmount: 2200000
    },
    {
      id: "DSP-102",
      orderId: "KUL-2026-0002",
      isService: false,
      buyerId: "u01",
      buyerName: "Budi Santoso",
      sellerId: "u02",
      sellerName: "Toko Pak Slamet",
      reason: "Barang tas kulit diterima dengan goresan dalam di kulit luar bagian depan, dan jahitannya tidak rapi.",
      status: "REVIEW",
      date: "12 Jun 2026",
      escrowAmount: 646875
    }
  ];

  if (!localStorage.getItem('kuleather_disputes')) {
    localStorage.setItem('kuleather_disputes', JSON.stringify(DEFAULT_DISPUTES));
  }

  // Seed one mock service order for SVO-101 if it doesn't exist, to let disputes have data to read
  const serviceOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
  if (!serviceOrders.some(o => o.id === 'SVO-101')) {
    serviceOrders.push({
      id: "SVO-101",
      serviceId: "SVC-001",
      serviceName: "Custom Jaket Kulit Rider Premium",
      buyerId: "u01",
      buyerName: "Budi Santoso",
      sellerId: "u02",
      sellerName: "Toko Pak Slamet",
      status: "DISPUTE",
      date: "11 Jun 2026",
      request: {
        description: "Jaket Kulit Domba Hitam custom rider",
        specifications: "Lingkar dada 104cm, panjang lengan 62cm",
        budget: 2200000,
        notes: "Minta tolong dikerjakan rapi."
      },
      offer: {
        finalPrice: 2200000,
        estimatedDays: "14 hari kerja",
        freeRevisions: 3,
        extraRevisionCost: 150000,
        notes: "Siap dipotong pola."
      },
      negotiation: [
        { from: "buyer", message: "Mengajukan request kustom.", date: "11 Jun 2026", time: "10:00" },
        { from: "seller", message: "Pola diproses.", date: "11 Jun 2026", time: "11:00" }
      ],
      progress: [
        { description: "Pola jaket mulai dipotong", images: [], date: "11 Jun 2026", time: "14:00" }
      ],
      results: [
        { notes: "Jaket jadi selesai diserahkan.", images: [], date: "11 Jun 2026", time: "18:00" }
      ],
      revisions: { used: 3, max: 3, extraCost: 150000, history: [] },
      escrow: { status: "DITAHAN", amount: 2200000, platformFee: 110000, sellerReceives: 2090000 },
      timeline: [
        { status: "REQUEST_SENT", date: "11 Jun 2026 10:00", text: "Request diajukan." },
        { status: "DIBAYAR_ESCROW", date: "11 Jun 2026 12:00", text: "Escrow terbayar." }
      ]
    });
    localStorage.setItem('kuleather_service_orders', JSON.stringify(serviceOrders));
  }

  // 2. State Management
  const state = {
    disputes: [],
    filteredDisputes: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('disputes-table-tbody');
  const searchInput = document.getElementById('dispute-search-input');
  const statusSelect = document.getElementById('filter-dispute-status');
  const paginationContainer = document.getElementById('disputes-pagination');

  // Stats Card Elements
  const openCountEl = document.getElementById('disputes-open-count');
  const reviewCountEl = document.getElementById('disputes-review-count');
  const resolvedCountEl = document.getElementById('disputes-resolved-count');

  // Detail Modal Elements
  const modalDiscuteId = document.getElementById('md-dispute-id');
  const modalOrderId = document.getElementById('md-order-id');
  const modalOrderType = document.getElementById('md-order-type');
  const modalEscrowAmount = document.getElementById('md-escrow-amount');
  const modalBuyerName = document.getElementById('md-buyer-name');
  const modalSellerName = document.getElementById('md-seller-name');
  const modalDisputeReason = document.getElementById('md-dispute-reason');
  const modalLogContainer = document.getElementById('md-order-log-container');
  
  const btnResolveSeller = document.getElementById('btn-resolve-seller');
  const btnResolveBuyer = document.getElementById('btn-resolve-buyer');

  let activeDispute = null;

  // 3. Load disputes data
  function loadDisputes() {
    const list = JSON.parse(localStorage.getItem('kuleather_disputes')) || [];
    state.disputes = list;

    calculateStats();
    applyFilters();
  }

  // Calculate statistics counts
  function calculateStats() {
    let openCount = 0;
    let reviewCount = 0;
    let resolvedCount = 0;

    state.disputes.forEach(d => {
      if (d.status === 'OPEN') openCount++;
      else if (d.status === 'REVIEW') reviewCount++;
      else if (d.status === 'RESOLVED') resolvedCount++;
    });

    if (openCountEl) openCountEl.textContent = openCount;
    if (reviewCountEl) reviewCountEl.textContent = reviewCount;
    if (resolvedCountEl) resolvedCountEl.textContent = resolvedCount;
    
    const countHeader = document.getElementById('dispute-total-count');
    if (countHeader) countHeader.textContent = state.disputes.length;
  }

  // Apply filters
  function applyFilters() {
    state.filteredDisputes = state.disputes.filter(d => {
      const query = state.search.toLowerCase();
      const matchesSearch = query === '' ||
        d.id.toLowerCase().includes(query) ||
        d.orderId.toLowerCase().includes(query) ||
        d.buyerName.toLowerCase().includes(query) ||
        d.sellerName.toLowerCase().includes(query);

      const matchesStatus = state.status === 'Semua' || d.status === state.status;

      return matchesSearch && matchesStatus;
    });

    const maxPages = Math.ceil(state.filteredDisputes.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    renderTable();
    renderPagination();
  }

  // Render Table
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredDisputes.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada kasus komplain terdaftar</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(d => {
      let badgeClass = 'status-pending';
      let badgeText = 'Ditinjau';

      if (d.status === 'OPEN') {
        badgeClass = 'status-menunggu';
        badgeText = 'Kasus Baru (Open)';
      } else if (d.status === 'REVIEW') {
        badgeClass = 'status-diproses';
        badgeText = 'Mediasi (Review)';
      } else if (d.status === 'RESOLVED') {
        badgeClass = 'status-selesai';
        badgeText = 'Resolved';
      }

      html += `
        <tr>
          <td class="mono accent">${d.id}</td>
          <td class="mono">${d.orderId}</td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; background:rgba(0,0,0,0.05); color:var(--text-primary); border:none; padding:2px 6px;">${d.isService ? 'Jasa' : 'Produk'}</span></td>
          <td>${d.buyerName}</td>
          <td><strong>${d.sellerName}</strong></td>
          <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${d.reason}</td>
          <td>
            <span class="status-pill ${badgeClass}">
              <span class="dot"></span>
              ${badgeText}
            </span>
          </td>
          <td class="mono text-muted">${d.date}</td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="viewDisputeDetail('${d.id}')" style="padding:6px 12px; font-size:8px;">
              TINJAU DETAIL
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

    const maxPages = Math.ceil(state.filteredDisputes.length / state.perPage);
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

  // View Dispute Details
  window.viewDisputeDetail = function(id) {
    const d = state.disputes.find(item => item.id === id);
    if (!d) return;

    activeDispute = d;

    // Set status to review if open
    if (d.status === 'OPEN') {
      d.status = 'REVIEW';
      localStorage.setItem('kuleather_disputes', JSON.stringify(state.disputes));
      calculateStats();
      applyFilters();
    }

    modalDiscuteId.textContent = d.id;
    modalOrderId.textContent = d.orderId;
    modalOrderType.textContent = d.isService ? 'Jasa Pengerjaan' : 'Produk Jadi/Bahan Baku';
    modalEscrowAmount.textContent = window.idr(d.escrowAmount);
    modalBuyerName.textContent = d.buyerName;
    modalSellerName.textContent = d.sellerName;
    modalDisputeReason.textContent = d.reason;

    // Load order log
    modalLogContainer.innerHTML = '';
    if (d.isService) {
      const svOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const order = svOrders.find(o => o.id === d.orderId);
      if (order) {
        let logsHtml = '';
        order.timeline.forEach(t => {
          logsHtml += `[${t.date}] STATUS: ${t.status} - ${t.text}\n`;
        });
        if (order.negotiation) {
          logsHtml += `\n--- DISKUSI NEGOSIASI CHAT ---\n`;
          order.negotiation.forEach(n => {
            logsHtml += `${n.from.toUpperCase()}: ${n.message} (${n.date})\n`;
          });
        }
        modalLogContainer.textContent = logsHtml;
      } else {
        modalLogContainer.textContent = 'Log pengerjaan tidak dapat ditemukan.';
      }
    } else {
      const prOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
      const order = prOrders.find(o => o.id === d.orderId);
      if (order) {
        let logsHtml = `[${order.date}] ORDER CREATED\nStatus Pesanan: ${order.status}\nMetode Bayar: ${order.paymentMethod}\nKurir: ${order.shippingCourier}\nResi: ${order.resi || '-'}\nCatatan Pembeli: ${order.notes || '-'}\n`;
        modalLogContainer.textContent = logsHtml;
      } else {
        modalLogContainer.textContent = 'Log transaksi produk tidak ditemukan.';
      }
    }

    // Toggle verdict buttons visibility based on resolved state
    const actionBlock = document.getElementById('btn-resolve-seller').parentElement;
    if (d.status === 'RESOLVED') {
      actionBlock.style.display = 'none';
    } else {
      actionBlock.style.display = 'flex';
    }

    window.openModal('dispute-detail-modal-overlay');
  };

  // 8. Dispute Resolutions
  if (btnResolveSeller) {
    btnResolveSeller.addEventListener('click', () => {
      resolveDisputeCase('SELLER');
    });
  }

  if (btnResolveBuyer) {
    btnResolveBuyer.addEventListener('click', () => {
      resolveDisputeCase('BUYER');
    });
  }

  function resolveDisputeCase(winner) {
    if (!activeDispute) return;

    const confirmMsg = winner === 'SELLER' ? 
      `Apakah Anda yakin ingin MEMENANGKAN PENJUAL? Dana escrow sebesar ${window.idr(activeDispute.escrowAmount)} akan dicairkan sepenuhnya ke saldo Penjual.` :
      `Apakah Anda yakin ingin MEMENANGKAN PEMBELI? Dana escrow sebesar ${window.idr(activeDispute.escrowAmount)} akan dikembalikan penuh (Refund) ke saldo Pembeli.`;

    if (confirm(confirmMsg)) {
      // 1. Update dispute status
      const list = JSON.parse(localStorage.getItem('kuleather_disputes')) || [];
      const dIdx = list.findIndex(item => item.id === activeDispute.id);
      if (dIdx !== -1) {
        list[dIdx].status = 'RESOLVED';
        list[dIdx].winner = winner;
        localStorage.setItem('kuleather_disputes', JSON.stringify(list));
      }

      // 2. Update order/escrow states
      if (activeDispute.isService) {
        const serviceOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
        const oIdx = serviceOrders.findIndex(item => item.id === activeDispute.orderId);
        
        if (oIdx !== -1) {
          if (winner === 'SELLER') {
            serviceOrders[oIdx].status = 'SELESAI';
            serviceOrders[oIdx].escrow.status = 'DILEPAS';
            serviceOrders[oIdx].timeline.push({
              status: "SELESAI",
              date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              text: "Dispute ditengahi Admin: Dimenangkan oleh Penjual. Dana cair."
            });
          } else {
            serviceOrders[oIdx].status = 'DIBATALKAN';
            serviceOrders[oIdx].escrow.status = 'REFUNDED';
            serviceOrders[oIdx].timeline.push({
              status: "DIBATALKAN",
              date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              text: "Dispute ditengahi Admin: Dimenangkan oleh Pembeli. Dana dikembalikan."
            });
          }
          localStorage.setItem('kuleather_service_orders', JSON.stringify(serviceOrders));
        }
      } else {
        const productOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
        const oIdx = productOrders.findIndex(item => item.id === activeDispute.orderId);

        if (oIdx !== -1) {
          if (winner === 'SELLER') {
            productOrders[oIdx].status = 'Selesai';
          } else {
            productOrders[oIdx].status = 'Refund';
          }
          localStorage.setItem('kuleather_profile_orders', JSON.stringify(productOrders));
        }
      }

      // Create notification
      createSystemNotification(`Kasus dispute #${activeDispute.id} untuk order #${activeDispute.orderId} telah diputuskan menang oleh ${winner === 'SELLER' ? 'Penjual' : 'Pembeli'}.`, 'system', 'var(--accent)');

      window.showToast(`Kasus dispute #${activeDispute.id} berhasil diselesaikan!`, 'success');
      window.closeModal('dispute-detail-modal-overlay');
      loadDisputes();
    }
  }

  function createSystemNotification(message, type, color) {
    const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
    notifications.unshift({
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

  loadDisputes();
});
