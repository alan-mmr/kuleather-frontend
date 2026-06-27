// ==========================================================================
// KULEATHER CUSTOM SERVICES CATALOG ENGINE
// ==========================================================================

const DEFAULT_SERVICES = [
  {
    id: "SVC-001",
    sellerId: "u02",
    sellerName: "Toko Pak Slamet",
    name: "Custom Jaket Kulit Rider Premium",
    category: "Custom Jaket",
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
    totalOrders: 18,
    status: "active",
    createdAt: "2026-05-15"
  },
  {
    id: "SVC-002",
    sellerId: "u02",
    sellerName: "Toko Pak Slamet",
    name: "Sol & Reparasi Sepatu Boots Kulit",
    category: "Reparasi & Perbaikan",
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
    totalOrders: 32,
    status: "active",
    createdAt: "2026-05-20"
  },
  {
    id: "SVC-003",
    sellerId: "u02",
    sellerName: "Toko Pak Slamet",
    name: "Jahit Tas Kerja Kulit Kustom",
    category: "Custom Tas",
    description: "Bikin tas kerja kulit asli premium (messenger bag / briefcase) sesuai desain dan kebutuhan Anda. Muat laptop 14-16 inch dengan kompartemen rapi.",
    startingPrice: 1650000,
    estimatedTime: "10-14 hari kerja",
    freeRevisions: 3,
    extraRevisionCost: 100000,
    portfolio: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    termsConditions: "Wajib mengirimkan referensi sketsa/gambar tas. Kami menggunakan kulit sapi pull-up tebal 1.8mm.",
    revisionIncludes: "Ubah penempatan saku, panjang tali strap, perbaiki jahitan meleset",
    revisionExcludes: "Ganti model penutup tas setelah kulit dipotong",
    rating: 4.7,
    totalOrders: 12,
    status: "active",
    createdAt: "2026-05-25"
  },
  {
    id: "SVC-004",
    sellerId: "u02",
    sellerName: "Toko Pak Slamet",
    name: "Jasa Penyamakan Kulit Sapi (Tanning Nabati/Chrome)",
    category: "Penyamakan Kulit",
    description: "Jasa memproses kulit mentah (hides) sapi lokal menjadi kulit samak siap pakai tipe Vegetable Tanned (Nabati) atau Chrome Pull-Up kualitas ekspor Magetan.",
    startingPrice: 45000,
    estimatedTime: "30-45 hari kerja",
    freeRevisions: 1,
    extraRevisionCost: 200000,
    portfolio: "../assets/ims/wet_blue_leather.png",
    termsConditions: "Berat kulit mentah minimal 15kg per batch kirim. Biaya kirim bolak-balik ditanggung sepenuhnya oleh pemesan.",
    revisionIncludes: "Pewarnaan ulang tipis jika warna kurang rata setelah dicuci",
    revisionExcludes: "Ganti jenis samak dari nabati ke chrome atau sebaliknya setelah obat masuk",
    rating: 4.8,
    totalOrders: 24,
    status: "active",
    createdAt: "2026-06-01"
  },
  {
    id: "SVC-005",
    sellerId: "u02",
    sellerName: "Toko Pak Slamet",
    name: "Jasa Pewarnaan Ulang & Finishing Kulit Crust",
    category: "Pewarnaan & Finishing",
    description: "Layanan mewarnai ulang (dyeing) kulit crust sapi/domba menjadi aneka warna pilihan fashion (matte/semi-gloss) menggunakan cat impor anti-retak.",
    startingPrice: 150000,
    estimatedTime: "7-10 hari kerja",
    freeRevisions: 2,
    extraRevisionCost: 75000,
    portfolio: "../assets/ims/chemical_dye_red.jpg",
    termsConditions: "Kulit yang dikirim harus berstatus crust (belum finish cat luar) dan tidak cacat lubang parah.",
    revisionIncludes: "Pengecatan ulang area yang kurang rata (patchy)",
    revisionExcludes: "Ganti warna total yang melenceng jauh dari kode warna pesanan",
    rating: 4.7,
    totalOrders: 15,
    status: "active",
    createdAt: "2026-06-05"
  }
];

function getServices() {
  const storedVer = localStorage.getItem('kuleather_services_version');
  if (storedVer !== 'v6') {
    localStorage.removeItem('kuleather_services');
    localStorage.setItem('kuleather_services_version', 'v6');
  }
  const stored = localStorage.getItem('kuleather_services');
  if (stored) {
    const list = JSON.parse(stored);
    return list.filter(s => s.status === 'active');
  }
  localStorage.setItem('kuleather_services', JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
}

const SERVICES = getServices();

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const state = {
    category: 'Semua',
    price: 'Semua',
    rating: 'Semua',
    search: '',
    sort: 'popular',
    page: 1,
    perPage: 9
  };

  function applyFilters() {
    let filtered = SERVICES.filter(s => {
      // 1. Search Query
      if (state.search !== '' && !s.name.toLowerCase().includes(state.search.toLowerCase())) return false;

      // 2. Category
      if (state.category !== 'Semua' && s.category !== state.category) return false;

      // 3. Rating Minimum
      if (state.rating !== 'Semua') {
        const minRating = parseFloat(state.rating);
        if (s.rating < minRating) return false;
      }

      // 4. Price Ranges
      if (state.price === '< Rp 500K' && s.startingPrice >= 500000) return false;
      if (state.price === 'Rp 500K – 1.5JT' && (s.startingPrice < 500000 || s.startingPrice > 1500000)) return false;
      if (state.price === 'Rp 1.5JT – 3JT' && (s.startingPrice < 1500000 || s.startingPrice > 3000000)) return false;
      if (state.price === '> Rp 3JT' && s.startingPrice <= 3000000) return false;

      return true;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
      if (state.sort === 'price-asc') return a.startingPrice - b.startingPrice;
      if (state.sort === 'price-desc') return b.startingPrice - a.startingPrice;
      if (state.sort === 'rating') return b.rating - a.rating;
      return b.totalOrders - a.totalOrders; // popular
    });

    return filtered;
  }

  function renderStars(rating) {
    const rounded = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        html += `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      } else {
        html += `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }
    }
    return html;
  }

  function renderGrid() {
    const filtered = applyFilters();
    const totalCount = filtered.length;

    // Update count display
    const countDisplay = document.getElementById('services-count-display');
    if (countDisplay) {
      const start = totalCount > 0 ? (state.page - 1) * state.perPage + 1 : 0;
      const end = Math.min(state.page * state.perPage, totalCount);
      countDisplay.textContent = `Menampilkan ${start}–${end} dari ${totalCount} layanan jasa`;
    }

    const paginated = filtered.slice((state.page - 1) * state.perPage, state.page * state.perPage);

    if (paginated.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl) 0;">
          <svg style="margin: 0 auto var(--space-md) auto; color: var(--text-muted);" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h4 class="heading-3 mb-sm">Jasa Tidak Ditemukan</h4>
          <p class="text-secondary body-sm">Silakan ubah kriteria pencarian atau filter Anda.</p>
        </div>
      `;
      renderPagination(0);
      return;
    }

    let html = '';
    paginated.forEach(s => {
      const imgUrl = s.portfolio ? s.portfolio : `https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&auto=format`;
      
      html += `
        <div class="service-card">
          <div class="service-card-img-wrapper">
            <a href="service-detail.html?id=${s.id}">
              <img src="${imgUrl}" alt="${s.name}" class="service-card-img">
            </a>
            <div class="service-card-badge">${s.category}</div>
          </div>
          <div class="service-card-body">
            <div class="service-card-meta">
              <span class="eyebrow">${s.category || 'Jasa'}</span>
              <div class="service-card-rating">
                ${renderStars(s.rating)}
                <span style="margin-left:4px;">${s.rating}</span>
              </div>
            </div>
            <h3 class="service-card-title"><a href="service-detail.html?id=${s.id}">${s.name}</a></h3>
            <div class="service-card-seller">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px; height:12px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>${s.sellerName}</span>
            </div>
            <div class="service-card-footer">
              <div>
                <span class="service-price-label">Mulai Dari</span>
                <span class="price" style="font-size:16px; font-weight:700; color:var(--accent);">${formatCurrency(s.startingPrice)}</span>
              </div>
              <a href="service-detail.html?id=${s.id}" class="btn btn-primary btn-sm" style="padding:6px 12px; font-size:10px;">DETAIL JASA</a>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
    renderPagination(totalCount);
  }

  function renderPagination(totalCount) {
    const paginationContainer = document.getElementById('services-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalCount / state.perPage);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHtml = '';
    
    // Prev Button
    paginationHtml += `
      <button class="btn btn-ghost btn-sm prev-page-btn" ${state.page === 1 ? 'disabled' : ''} style="padding: 8px 12px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <button class="btn ${state.page === i ? 'btn-primary' : 'btn-ghost'} btn-sm page-num-btn" style="padding: 8px 14px; font-family:var(--font-mono);">${i}</button>
      `;
    }

    // Next Button
    paginationHtml += `
      <button class="btn btn-ghost btn-sm next-page-btn" ${state.page === totalPages ? 'disabled' : ''} style="padding: 8px 12px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    paginationContainer.innerHTML = paginationHtml;

    // Attach Pagination Events
    paginationContainer.querySelectorAll('.page-num-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        state.page = idx + 1;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const prevBtn = paginationContainer.querySelector('.prev-page-btn');
    if (prevBtn && state.page > 1) {
      prevBtn.addEventListener('click', () => {
        state.page -= 1;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const nextBtn = paginationContainer.querySelector('.next-page-btn');
    if (nextBtn && state.page < totalPages) {
      nextBtn.addEventListener('click', () => {
        state.page += 1;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Bind Category Filters
  const catPills = document.querySelectorAll('#filter-category .filter-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      catPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.category = e.target.getAttribute('data-value');
      state.page = 1;
      renderGrid();
    });
  });

  // Bind Price Range Filters
  const pricePills = document.querySelectorAll('#filter-price .filter-pill');
  pricePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pricePills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.price = e.target.getAttribute('data-value');
      state.page = 1;
      renderGrid();
    });
  });

  // Bind Rating checkboxes
  const ratingCheckboxes = document.querySelectorAll('.rating-filter-checkbox');
  ratingCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        ratingCheckboxes.forEach(c => { if (c !== e.target) c.checked = false; });
        state.rating = e.target.value;
      } else {
        state.rating = 'Semua';
      }
      state.page = 1;
      renderGrid();
    });
  });

  // Search input filter
  const searchInput = document.getElementById('service-search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        renderGrid();
      }, 300);
    });
  }

  // Sorting
  const sortSelect = document.getElementById('sort-services-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  // Reset filter
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.category = 'Semua';
      state.price = 'Semua';
      state.rating = 'Semua';
      state.search = '';
      state.page = 1;

      catPills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-category [data-value="Semua"]').classList.add('active');

      pricePills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-price [data-value="Semua"]').classList.add('active');

      ratingCheckboxes.forEach(c => c.checked = false);
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'popular';

      renderGrid();
    });
  }

  renderGrid();
});
