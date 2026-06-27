// ==========================================================================
// 🌿 Kuleather Light — Admin Sellers Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core State
  const state = {
    sellers: [],
    filteredSellers: [],
    page: 1,
    perPage: 10,
    search: '',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('sellers-table-tbody');
  const searchInput = document.getElementById('seller-search-input');
  const statusSelect = document.getElementById('filter-status-select');
  const paginationContainer = document.getElementById('sellers-pagination');
  const totalCountEl = document.getElementById('seller-total-count');

  // Modal Elements
  const detailModalOverlay = document.getElementById('seller-detail-modal-overlay');
  const modalAvatar = document.getElementById('modal-seller-avatar');
  const modalShopName = document.getElementById('modal-seller-shop-name');
  const modalStatusBadge = document.getElementById('modal-seller-status-badge');
  const modalOwnerName = document.getElementById('modal-seller-owner-name');
  const modalEmail = document.getElementById('modal-seller-email');
  const modalPhone = document.getElementById('modal-seller-phone');
  const modalLocation = document.getElementById('modal-seller-location');
  const modalCategory = document.getElementById('modal-seller-category');
  const modalJoined = document.getElementById('modal-seller-joined');
  const modalDescription = document.getElementById('modal-seller-description');
  const modalActionsFooter = document.getElementById('modal-seller-actions-footer');

  // Load sellers list
  function loadSellers() {
    const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
    // Filter role penjual
    state.sellers = users.filter(u => u.role === 'penjual');
    applyFilters();
  }

  // Filter sellers
  function applyFilters() {
    state.filteredSellers = state.sellers.filter(s => {
      const shop = s.shop || {};
      const matchesSearch = state.search === '' ||
        s.name.toLowerCase().includes(state.search.toLowerCase()) ||
        s.email.toLowerCase().includes(state.search.toLowerCase()) ||
        (shop.name && shop.name.toLowerCase().includes(state.search.toLowerCase()));

      const matchesStatus = state.status === 'Semua' || s.status === state.status;

      return matchesSearch && matchesStatus;
    });

    const maxPages = Math.ceil(state.filteredSellers.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredSellers.length;
    renderTable();
    renderPagination();
  }

  // Render Table
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredSellers.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;" class="text-muted">Tidak ada data seller yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(s => {
      const shop = s.shop || {};
      
      let statusText = 'Review';
      let statusClass = 'status-pending';
      if (s.status === 'active') { statusText = 'Aktif'; statusClass = 'status-active'; }
      else if (s.status === 'suspended') { statusText = 'Suspended'; statusClass = 'status-inactive'; }

      html += `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:var(--space-sm);">
              <div style="width:30px; height:30px; border-radius:50%; overflow:hidden; background-color:var(--bg-alt); display:flex; align-items:center; justify-content:center; border:1px solid var(--muted-light);">
                ${(shop.avatar && (shop.avatar.includes('/') || shop.avatar.includes('.')))
                  ? `<img src="${shop.avatar}" style="width:100%; height:100%; object-fit:cover;">`
                  : shop.avatar || '🏪'}
              </div>
              <div>
                <strong>${shop.name || 'Toko Mitra'}</strong>
                ${shop.verified ? '<span class="text-success" style="font-size:0.6rem; display:block;">✔ Verified</span>' : ''}
              </div>
            </div>
          </td>
          <td>${s.name}</td>
          <td style="font-size:0.75rem;">
            ${s.email}<br>
            <span class="text-muted">${s.phone}</span>
          </td>
          <td>${shop.city || '-'}</td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; font-weight:normal; background:rgba(0,0,0,0.05); color:var(--text-primary); border:none;">${shop.category || '-'}</span></td>
          <td class="mono text-muted">${s.joined || '-'}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="admin-table-actions">
              <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 8px;" onclick="openSellerDetailModal('${s.id}')">
                DETAIL VERIFIKASI
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // Render pagination
  function renderPagination() {
    if (!paginationContainer) return;

    const maxPages = Math.ceil(state.filteredSellers.length / state.perPage);
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

  // Search and status select listeners
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

  // Open detail verification modal
  window.openSellerDetailModal = function(id) {
    const s = state.sellers.find(sel => sel.id === id);
    if (!s) return;

    const shop = s.shop || {};

    // Populate data
    if (modalAvatar) {
      if (shop.avatar && (shop.avatar.includes('/') || shop.avatar.includes('.'))) {
        modalAvatar.innerHTML = `<img src="${shop.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        modalAvatar.textContent = shop.avatar || '🏪';
      }
    }
    if (modalShopName) modalShopName.textContent = shop.name || 'Toko Mitra';
    if (modalOwnerName) modalOwnerName.textContent = s.name;
    if (modalEmail) modalEmail.textContent = s.email;
    if (modalPhone) modalPhone.textContent = s.phone;
    if (modalLocation) modalLocation.textContent = shop.city || '-';
    if (modalCategory) modalCategory.textContent = shop.category || '-';
    if (modalJoined) modalJoined.textContent = s.joined || '-';
    if (modalDescription) modalDescription.textContent = shop.description || 'Belum ada deskripsi.';

    // Status pill in modal
    let statusText = 'Review';
    let statusClass = 'status-pending';
    if (s.status === 'active') { statusText = 'Aktif'; statusClass = 'status-active'; }
    else if (s.status === 'suspended') { statusText = 'Suspended'; statusClass = 'status-inactive'; }
    
    if (modalStatusBadge) {
      modalStatusBadge.textContent = statusText;
      modalStatusBadge.className = `status-pill ${statusClass}`;
    }

    // Modal Action Buttons Footer
    let footerHtml = '';
    if (s.status === 'pending_verification') {
      footerHtml = `
        <button class="btn-admin btn-admin-danger" onclick="suspendSeller('${s.id}')">Tolak Kemitraan</button>
        <div style="display:flex; gap:10px;">
          <button class="btn-admin btn-admin-secondary" onclick="closeModal('seller-detail-modal-overlay')">Batal</button>
          <button class="btn-admin btn-admin-primary" onclick="approveSeller('${s.id}')">Setujui & Verifikasi</button>
        </div>
      `;
    } else if (s.status === 'active') {
      footerHtml = `
        <button class="btn-admin btn-admin-danger" onclick="suspendSeller('${s.id}')">Suspend Toko</button>
        <button class="btn-admin btn-admin-secondary" onclick="closeModal('seller-detail-modal-overlay')">Tutup</button>
      `;
    } else if (s.status === 'suspended') {
      footerHtml = `
        <button class="btn-admin btn-admin-primary" onclick="approveSeller('${s.id}')">Aktifkan Kembali</button>
        <button class="btn-admin btn-admin-secondary" onclick="closeModal('seller-detail-modal-overlay')">Tutup</button>
      `;
    }

    if (modalActionsFooter) modalActionsFooter.innerHTML = footerHtml;
    window.openModal('seller-detail-modal-overlay');
  };

  // Action Operations
  window.approveSeller = function(id) {
    updateSellerStatus(id, 'active', true, 'kemitraan disetujui & diverifikasi');
  };

  window.suspendSeller = function(id) {
    if (confirm('Apakah Anda yakin ingin menangguhkan/menolak kemitraan toko ini?')) {
      updateSellerStatus(id, 'suspended', false, 'toko ditangguhkan (suspended)');
    }
  };

  function updateSellerStatus(id, status, isVerified, logMsgText) {
    const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
    const idx = users.findIndex(u => u.id === id);

    if (idx !== -1) {
      users[idx].status = status;
      if (!users[idx].shop) {
        users[idx].shop = {};
      }
      users[idx].shop.verified = isVerified;

      localStorage.setItem('kuleather_users', JSON.stringify(users));
      
      // Update local state if active user was approved/suspended
      const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
      if (activeUser && activeUser.id === id) {
        activeUser.status = status;
        activeUser.shop.verified = isVerified;
        localStorage.setItem('kuleather_active_user', JSON.stringify(activeUser));
      }

      // System notification
      const shopName = users[idx].shop.name || 'Toko Mitra';
      createSystemNotification(`Admin Utama menyetujui status: ${shopName} menjadi ${logMsgText.toUpperCase()}`, 'user', 'var(--success)');
      showToast(`Status ${shopName} berhasil diperbarui!`, 'success');

      window.closeModal('seller-detail-modal-overlay');
      loadSellers();
    }
  }

  // Create notifications
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

  loadSellers();
});
