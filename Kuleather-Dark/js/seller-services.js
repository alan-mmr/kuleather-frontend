// ==========================================================================
// 🏪 Kuleather Light — Seller Services Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;
  const sellerName = window.sellerUser.shop ? window.sellerUser.shop.name : 'Mitra Kuleather';

  // 1. State
  const state = {
    services: [],
    filteredServices: [],
    page: 1,
    perPage: 10,
    search: '',
    category: 'Semua',
    status: 'Semua'
  };

  // DOM Elements
  const tbody = document.getElementById('services-table-tbody');
  const searchInput = document.getElementById('service-search-input');
  const categorySelect = document.getElementById('filter-category-select');
  const statusSelect = document.getElementById('filter-status-select');
  const paginationContainer = document.getElementById('services-pagination');
  const totalCountEl = document.getElementById('service-total-count');

  // Modal Fields
  const crudForm = document.getElementById('service-crud-form');
  const idField = document.getElementById('service-id-field');
  const nameField = document.getElementById('service-name');
  const categoryField = document.getElementById('service-category');
  const priceField = document.getElementById('service-price');
  const timeField = document.getElementById('service-time');
  const freeRevisionsField = document.getElementById('service-free-revisions');
  const extraRevisionCostField = document.getElementById('service-extra-revision-cost');
  const statusField = document.getElementById('service-status');
  const photoField = document.getElementById('service-photo');
  const descriptionField = document.getElementById('service-description');
  const termsField = document.getElementById('service-terms');
  const revisionIncludesField = document.getElementById('service-revision-includes');
  const revisionExcludesField = document.getElementById('service-revision-excludes');

  const DEFAULT_SERVICES = [
    {
      id: "SVC-001",
      sellerId: "u02", // Toko Pak Slamet
      sellerName: "Toko Pak Slamet",
      name: "Custom Jaket Kulit Rider Premium",
      category: "Jaket",
      description: "Jasa jahit jaket kulit kustom ukuran tubuh Anda. Menggunakan bahan kulit domba Garut super lentur. Model klasik rider, slim-fit dengan hardware ritsleting logam antik karat.",
      startingPrice: 2200000,
      estimatedTime: "14-21 hari kerja",
      freeRevisions: 3,
      extraRevisionCost: 150000,
      portfolio: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      termsConditions: "Pembeli wajib mengirimkan spesifikasi ukuran lingkar dada, panjang lengan, dan bahu. Bahan baku kulit disediakan sepenuhnya oleh kami.",
      revisionIncludes: "Ubah ukuran detail (panjang lengan, bahu), ganti kancing, rapihkan jahitan",
      revisionExcludes: "Ganti model jaket total, ganti warna kulit yang sudah dipotong",
      rating: 4.9,
      totalOrders: 8,
      status: "active",
      createdAt: "2026-05-15"
    },
    {
      id: "SVC-002",
      sellerId: "u02", // Toko Pak Slamet
      sellerName: "Toko Pak Slamet",
      name: "Sol & Reparasi Sepatu Boots Kulit",
      category: "Repair",
      description: "Layanan servis, restorasi, ganti sol, dan semir ulang sepatu boots kulit Anda agar tampak seperti baru kembali. Dikerjakan oleh pengrajin senior Magetan.",
      startingPrice: 250000,
      estimatedTime: "5-7 hari kerja",
      freeRevisions: 2,
      extraRevisionCost: 50000,
      portfolio: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      termsConditions: "Pembeli harus mengirimkan sepatu fisik ke workshop kami. Biaya kirim bolak-balik ditanggung sepenuhnya oleh pembeli.",
      revisionIncludes: "Semir kurang rata, sol kurang rekat sedikit",
      revisionExcludes: "Ganti jenis sol yang berbeda dari pesanan awal",
      rating: 4.8,
      totalOrders: 14,
      status: "active",
      createdAt: "2026-05-20"
    }
  ];

  // Load services list
  function loadServices() {
    let allServices = JSON.parse(localStorage.getItem('kuleather_services'));
    if (!allServices) {
      allServices = DEFAULT_SERVICES;
      localStorage.setItem('kuleather_services', JSON.stringify(allServices));
    }
    
    // Filter to only this seller's services
    state.services = allServices.filter(s => s.sellerId === sellerId);
    applyFilters();
  }

  // Filter Services
  function applyFilters() {
    state.filteredServices = state.services.filter(s => {
      // Search term
      const matchesSearch = state.search === '' || 
        s.name.toLowerCase().includes(state.search.toLowerCase());

      // Category
      const matchesCategory = state.category === 'Semua' || s.category === state.category;

      // Status
      const matchesStatus = state.status === 'Semua' || s.status === state.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    const maxPages = Math.ceil(state.filteredServices.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredServices.length;
    renderTable();
    renderPagination();
  }

  // Render Table
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredServices.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada layanan jasa yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach(s => {
      let imgUrl = s.portfolio ? s.portfolio : `https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop&auto=format`;
      if (imgUrl.startsWith('../assets/')) {
        imgUrl = '../' + imgUrl;
      }
      
      let statusText = 'Nonaktif';
      let statusClass = 'status-inactive';
      if (s.status === 'active') { statusText = 'Aktif'; statusClass = 'status-active'; }

      html += `
        <tr>
          <td><img src="${imgUrl}" alt="${s.name}" class="admin-table-img"></td>
          <td><strong style="font-size:0.85rem; display:block;">${s.name}</strong><span class="caption text-muted" style="font-family:var(--font-mono); font-size:0.65rem;">ID: ${s.id}</span></td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; font-weight:normal; background:rgba(0,0,0,0.05); color:var(--text-primary); border:none;">${s.category}</span></td>
          <td class="mono font-weight-bold">${window.idr(s.startingPrice)}</td>
          <td class="mono">${s.estimatedTime}</td>
          <td class="mono">${s.freeRevisions} kali</td>
          <td class="mono">${window.idr(s.extraRevisionCost)}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="admin-table-actions">
              <button class="btn-table-action" onclick="openServiceEditModal('${s.id}')" title="Edit Jasa">
                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="btn-table-action btn-table-action-danger" onclick="deleteService('${s.id}')" title="Hapus Jasa">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // Render Pagination
  function renderPagination() {
    if (!paginationContainer) return;
    
    const maxPages = Math.ceil(state.filteredServices.length / state.perPage);
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

  // Open Add Modal
  window.openServiceAddModal = function() {
    if (crudForm) crudForm.reset();
    document.getElementById('service-modal-title').textContent = 'Tambah Jasa Baru';
    idField.value = '';
    window.openModal('service-modal-overlay');
  };

  // Open Edit Modal
  window.openServiceEditModal = function(id) {
    const s = state.services.find(item => item.id === id);
    if (!s) return;

    document.getElementById('service-modal-title').textContent = 'Edit Layanan Jasa';
    idField.value = s.id;
    nameField.value = s.name;
    categoryField.value = s.category;
    priceField.value = s.startingPrice;
    timeField.value = s.estimatedTime;
    freeRevisionsField.value = s.freeRevisions;
    extraRevisionCostField.value = s.extraRevisionCost;
    statusField.value = s.status;
    photoField.value = s.portfolio;
    descriptionField.value = s.description;
    termsField.value = s.termsConditions;
    revisionIncludesField.value = s.revisionIncludes;
    revisionExcludesField.value = s.revisionExcludes;

    window.openModal('service-modal-overlay');
  };

  // Submit Form (Save/Update)
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = idField.value;
      const allServices = JSON.parse(localStorage.getItem('kuleather_services')) || [];

      const serviceData = {
        name: nameField.value.trim(),
        category: categoryField.value,
        startingPrice: parseInt(priceField.value, 10),
        estimatedTime: timeField.value.trim(),
        freeRevisions: parseInt(freeRevisionsField.value, 10),
        extraRevisionCost: parseInt(extraRevisionCostField.value, 10),
        status: statusField.value,
        portfolio: photoField.value,
        description: descriptionField.value.trim(),
        termsConditions: termsField.value.trim(),
        revisionIncludes: revisionIncludesField.value.trim(),
        revisionExcludes: revisionExcludesField.value.trim()
      };

      if (id === '') {
        // Create new
        const newId = 'SVC-' + (allServices.length + 101).toString();
        const newService = {
          id: newId,
          sellerId: sellerId,
          sellerName: sellerName,
          rating: 5.0,
          totalOrders: 0,
          createdAt: new Date().toISOString().split('T')[0],
          ...serviceData
        };

        allServices.push(newService);
        window.showToast('Layanan jasa baru berhasil ditambahkan!', 'success');
      } else {
        // Update existing
        const index = allServices.findIndex(item => item.id === id);
        if (index !== -1) {
          allServices[index] = {
            ...allServices[index],
            ...serviceData
          };
          window.showToast('Layanan jasa berhasil diperbarui!', 'success');
        }
      }

      localStorage.setItem('kuleather_services', JSON.stringify(allServices));
      window.closeModal('service-modal-overlay');
      loadServices();
    });
  }

  // Delete Jasa
  window.deleteService = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus layanan jasa ini dari toko Anda?')) {
      const allServices = JSON.parse(localStorage.getItem('kuleather_services')) || [];
      const updated = allServices.filter(item => item.id !== id);
      localStorage.setItem('kuleather_services', JSON.stringify(updated));
      window.showToast('Layanan jasa berhasil dihapus.', 'info');
      loadServices();
    }
  };

  loadServices();
});
