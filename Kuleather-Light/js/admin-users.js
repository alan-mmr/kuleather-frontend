// ==========================================================================
// 🌿 Kuleather Light — Admin Users Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. State
  const state = {
    users: [],
    filteredUsers: [],
    page: 1,
    perPage: 10,
    search: '',
    role: 'Semua',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('users-table-tbody');
  const searchInput = document.getElementById('user-search-input');
  const roleSelect = document.getElementById('filter-role-select');
  const statusSelect = document.getElementById('filter-status-select');
  const paginationContainer = document.getElementById('users-pagination');
  const totalCountEl = document.getElementById('user-total-count');

  // Modal Elements
  const crudModalOverlay = document.getElementById('user-modal-overlay');
  const crudForm = document.getElementById('user-crud-form');
  const idField = document.getElementById('user-id-field');
  const nameField = document.getElementById('user-name');
  const emailField = document.getElementById('user-email');
  const phoneField = document.getElementById('user-phone');
  const passwordField = document.getElementById('user-password');
  const roleField = document.getElementById('user-role');
  const statusField = document.getElementById('user-status');
  const addressField = document.getElementById('user-address');

  // Load users
  function loadUsers() {
    state.users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
    calculateRoleCounts();
    applyFilters();
  }

  // Calculate stats role counts
  function calculateRoleCounts() {
    const counts = {
      pembeli: 0,
      penjual: 0,
      admin: 0
    };

    state.users.forEach(u => {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      }
    });

    document.getElementById('count-role-pembeli').textContent = `Pembeli: ${counts.pembeli}`;
    document.getElementById('count-role-penjual').textContent = `Penjual: ${counts.penjual}`;
    document.getElementById('count-role-admin').textContent = `Admin: ${counts.admin}`;
  }

  // Filter
  function applyFilters() {
    state.filteredUsers = state.users.filter(u => {
      // Search term
      const matchesSearch = state.search === '' ||
        u.name.toLowerCase().includes(state.search.toLowerCase()) ||
        u.email.toLowerCase().includes(state.search.toLowerCase());

      // Role
      const matchesRole = state.role === 'Semua' || u.role === state.role;

      // Status
      const matchesStatus = state.status === 'Semua' || u.status === state.status;

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Reset pagination to page 1 if current page becomes empty
    const maxPages = Math.ceil(state.filteredUsers.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredUsers.length;
    renderTable();
    renderPagination();
  }

  // Render Table
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredUsers.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada data pengguna yang cocok</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(u => {
      // Avatar color based on role
      let avatarBg = 'var(--info)';
      let roleText = 'Pembeli';
      let roleClass = 'role-pembeli';

      if (u.role === 'penjual') {
        avatarBg = 'var(--accent)';
        roleText = 'Penjual';
        roleClass = 'role-penjual';
      } else if (u.role === 'admin') {
        avatarBg = 'var(--warning)';
        roleText = 'Admin';
        roleClass = 'role-admin';
      }

      // Status text & pill
      let statusText = 'Aktif';
      let statusClass = 'status-active';
      if (u.status === 'suspended') {
        statusText = 'Suspen';
        statusClass = 'status-suspended';
      }

      // Toggle Suspend Action button text
      const toggleActionText = u.status === 'active' ? 'Suspend' : 'Aktifkan';
      const toggleActionClass = u.status === 'active' ? 'btn-admin-secondary' : 'btn-admin-primary';
      const toggleStyle = u.status === 'active' ? 'color: var(--error); border-color: rgba(196, 98, 58, 0.2);' : '';

      html += `
        <tr>
          <td>
            <div class="admin-table-avatar" style="background-color:${avatarBg};">
              ${u.initials || 'US'}
            </div>
          </td>
          <td>
            <strong style="display:block; font-size:0.85rem;">${u.name}</strong>
            <span class="caption text-muted" style="font-family:var(--font-mono); font-size:0.65rem;">ID: ${u.id}</span>
          </td>
          <td class="mono" style="font-size:0.75rem;">${u.email}</td>
          <td class="mono" style="font-size:0.75rem;">${u.phone || '-'}</td>
          <td>
            <span class="role-badge ${roleClass}">
              ${roleText}
            </span>
          </td>
          <td class="mono text-muted" style="font-size:0.7rem;">${u.joined || '-'}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td class="mono text-center">${u.orders || 0}</td>
          <td class="admin-table-actions" style="justify-content: flex-end;">
            <button class="admin-table-action-btn" title="Edit Akun" onclick="openUserEditModal('${u.id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-admin btn-admin-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.65rem; text-transform: uppercase; ${toggleStyle}" onclick="toggleUserStatus('${u.id}')">
              ${toggleActionText}
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
    const totalPages = Math.ceil(state.filteredUsers.length / state.perPage);

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

  // Toggle user status Suspend / Activate
  window.toggleUserStatus = function(id) {
    const u = state.users.find(user => user.id === id);
    if (!u) return;

    // Do not suspend yourself
    const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
    if (activeUser && activeUser.email === u.email) {
      showToast('Aksi Ditolak: Anda tidak dapat memblokir akun Anda sendiri.', 'error');
      return;
    }

    const nextStatus = u.status === 'active' ? 'suspended' : 'active';
    const actionText = nextStatus === 'suspended' ? 'ditangguhkan (diblokir)' : 'diaktifkan kembali';
    const notifColor = nextStatus === 'suspended' ? 'var(--error)' : 'var(--success)';

    if (confirm(`Apakah Anda yakin ingin mengubah status akun ${u.name} menjadi ${nextStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}?`)) {
      u.status = nextStatus;
      localStorage.setItem('kuleather_users', JSON.stringify(state.users));
      
      // Log Notification
      createSystemNotification(`Akun pengguna ${u.name} (${u.email}) ${actionText} oleh Admin Utama`, 'user', notifColor);
      showToast(`Akun ${u.name} berhasil ${nextStatus === 'active' ? 'diaktifkan' : 'ditangguhkan'}.`, 'success');
      
      loadUsers();
    }
  };

  // Listen filters
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

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      state.role = e.target.value;
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

  // Open Modal Add mode
  window.openUserAddModal = function() {
    document.getElementById('user-modal-title').textContent = 'Tambah Pengguna Baru';
    crudForm.reset();
    idField.value = '';
    passwordField.required = true;
    passwordField.disabled = false;
    openModal('user-modal-overlay');
  };

  // Open Modal Edit mode
  window.openUserEditModal = function(id) {
    const u = state.users.find(user => user.id === id);
    if (!u) return;

    document.getElementById('user-modal-title').textContent = 'Edit Akun Pengguna';
    
    // Autofill
    idField.value = u.id;
    nameField.value = u.name;
    emailField.value = u.email;
    phoneField.value = u.phone || '';
    passwordField.value = u.password || '';
    passwordField.required = false; // not required to edit
    roleField.value = u.role;
    statusField.value = u.status;
    addressField.value = u.address || '';

    openModal('user-modal-overlay');
  };

  // Form submit
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = idField.value.trim();
      const name = nameField.value.trim();
      const email = emailField.value.trim().toLowerCase();
      const phone = phoneField.value.trim();
      const pass = passwordField.value;
      const role = roleField.value;
      const status = statusField.value;
      const address = addressField.value.trim();

      // Check duplicate email (excluding self)
      const conflict = state.users.find(u => u.email.toLowerCase() === email && u.id !== id);
      if (conflict) {
        showToast('Aksi Gagal: Email sudah terdaftar pada pengguna lain.', 'error');
        return;
      }

      // Generate initials
      const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

      if (id) {
        // Edit Mode
        const index = state.users.findIndex(u => u.id === id);
        if (index !== -1) {
          // Keep joined date and original orders count
          const originalJoined = state.users[index].joined;
          const originalOrders = state.users[index].orders || 0;

          state.users[index] = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            role: role,
            joined: originalJoined,
            status: status,
            orders: originalOrders,
            initials: initials || 'US',
            address: address,
            password: pass || state.users[index].password
          };

          createSystemNotification(`Akun pengguna ${name} (${email}) diperbarui oleh Admin Utama`, 'user', 'var(--accent)');
          showToast('Akun pengguna berhasil diperbarui.', 'success');
        }
      } else {
        // Add Mode
        const newId = 'u' + (state.users.length + 1).toString().padStart(2, '0');
        const newUser = {
          id: newId,
          name: name,
          email: email,
          phone: phone,
          role: role,
          joined: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: status,
          orders: 0,
          initials: initials || 'US',
          address: address,
          password: pass
        };

        state.users.push(newUser);
        createSystemNotification(`Pengguna baru ${name} (${email}, Peran: ${role}) didaftarkan oleh Admin Utama`, 'user', 'var(--success)');
        showToast('Pengguna baru berhasil dibuat.', 'success');
      }

      localStorage.setItem('kuleather_users', JSON.stringify(state.users));
      closeModal('user-modal-overlay');
      loadUsers();
    });
  }

  // Load initial dataset
  loadUsers();
});
