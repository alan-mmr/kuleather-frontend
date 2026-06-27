// ==========================================================================
// KULEATHER CATALOG ENGINE
// ==========================================================================

const DEFAULT_PRODUCTS = [
  { id: "tote-full-grain",  name: "Tas Tote Kulit Full Grain Magetan",  price: 1250000,               rating: 4.9, reviewCount: 187, sold: 412,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: ["Best Seller"],     photo: "photo-1548036328-c9fa89d128fa", inStock: true, stock: 25, status: "active", sku: "KUL-BAG-001", variants: ["Cokelat Tua", "Hitam Matte", "Tan Natural"] },
  { id: "dompet-bifold",    name: "Dompet Bifold Kulit Sapi Premium",   price: 350000,                 rating: 4.8, reviewCount: 342, sold: 891,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: ["New"],             photo: "photo-1614252369475-531eba835eb1", inStock: true, stock: 48, status: "active", sku: "KUL-WAL-002", variants: ["Cokelat Tua", "Hitam Matte", "Tan Natural"] },
  { id: "jaket-domba",      name: "Jaket Kulit Domba Classic Rider",    price: 2800000,                rating: 4.9, reviewCount: 98,  sold: 134,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Domba",  origin: "Magetan",    badges: ["Best Seller"],     photo: "photo-1551028719-00167b16eac5",   inStock: true, stock: 12, status: "active", sku: "KUL-JKT-003", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "sabuk-pullup",     name: "Sabuk Pull-Up Leather Artisan",      price: 275000,                 rating: 4.7, reviewCount: 214, sold: 537,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",   origin: "Magetan",    badges: [],                  photo: "photo-1553062407-98eeb64c6a62",   inStock: true, stock: 30, status: "active", sku: "KUL-BEL-004", variants: ["Tan Natural", "Cokelat Tua", "Hitam Matte"] },
  { id: "sepatu-loafer",    name: "Sepatu Loafer Kulit Full Grain",     price: 1650000,                rating: 4.8, reviewCount: 156, sold: 278,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: ["Best Seller"],     photo: "photo-1542291026-7eec264c27ff",   inStock: true, stock: 15, status: "active", sku: "KUL-SHO-005", variants: ["Cokelat Tua", "Tan Natural"] },
  { id: "kulit-sapi-fg",    name: "Kulit Sapi Full Grain (per m²)",    price: 380000,                 rating: 4.8, reviewCount: 412, sold: 1204, sellerId: "u02", seller: "Toko Pak Slamet", cat: "Bahan Baku",  material: "Kulit Sapi",   origin: "Sidoarjo",   badges: [],                  photo: "../assets/ims/leather_sheet_tan_smooth.jpg", inStock: true, stock: 150, status: "active", sku: "KUL-MAT-006", variants: ["Natural Tan", "Dark Brown", "Black"] },
  { id: "card-holder",      name: "Card Holder Kulit Slim Minimalis",   price: 185000, origPrice:240000, rating: 4.6, reviewCount: 189, sold: 623,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",   origin: "Magetan",    badges: ["Best Seller"],     photo: "photo-1584917865442-de89df76afd3", inStock: true, stock: 4, status: "active", sku: "KUL-CRD-007", variants: ["Tan Natural", "Cokelat Tua", "Hitam Matte"] },
  { id: "tas-selempang",    name: "Tas Selempang Kulit Crossbody Pria", price: 875000,                 rating: 4.7, reviewCount: 134, sold: 267,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: [],                  photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 18, status: "active", sku: "KUL-BAG-008", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "sarung-tangan",    name: "Sarung Tangan Kulit Berkendara",     price: 195000,                 rating: 4.6, reviewCount: 211, sold: 489,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Domba",  origin: "Garut",      badges: ["New"],             photo: "photo-1516478177764-9fe5bd7e9717", inStock: true, stock: 22, status: "active", sku: "KUL-GLV-009", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "briefcase",        name: "Tas Briefcase Kulit Executive",      price: 2150000,                rating: 4.9, reviewCount: 67,  sold: 89,   sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Yogyakarta", badges: ["Best Seller"],     photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 8, status: "active", sku: "KUL-BAG-010", variants: ["Cokelat Tua", "Hitam Matte"] },
  { id: "sepatu-derby",     name: "Sepatu Derby Kulit Sapi Formal",     price: 1450000,                rating: 4.7, reviewCount: 143, sold: 201,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: [],                  photo: "photo-1542291026-7eec264c27ff",   inStock: true, stock: 14, status: "active", sku: "KUL-SHO-011", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "ikat-pinggang",    name: "Ikat Pinggang Ukir Khas Magetan",   price: 325000,                 rating: 4.8, reviewCount: 298, sold: 647,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",   origin: "Magetan",    badges: ["Best Seller"],     photo: "photo-1553062407-98eeb64c6a62",   inStock: true, stock: 20, status: "active", sku: "KUL-BEL-012", variants: ["Tan Natural", "Cokelat Tua"] },
  { id: "kulit-domba",      name: "Kulit Domba Garment Supple (per lbr)", price: 220000,              rating: 4.7, reviewCount: 387, sold: 923,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Bahan Baku",  material: "Kulit Domba",  origin: "Garut",      badges: [],                  photo: "../assets/ims/leather_sheet_beige_smooth.jpg", inStock: true, stock: 80, status: "active", sku: "KUL-MAT-013", variants: ["Hitam Matte", "Tan Natural"] },
  { id: "ransel-vintage",   name: "Tas Ransel Kulit Vintage Heritage",  price: 1850000,                rating: 4.8, reviewCount: 112, sold: 178,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Yogyakarta", badges: ["New"],             photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 6, status: "active", sku: "KUL-BAG-014", variants: ["Cokelat Tua", "Tan Natural"] },
  { id: "dompet-zipper",    name: "Dompet Panjang Zipper Kulit Wanita", price: 425000, origPrice:560000, rating: 4.7, reviewCount: 221, sold: 378,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Sidoarjo",   badges: ["Best Seller"],     photo: "photo-1601924994987-69e26d50dc26", inStock: true, stock: 15, status: "active", sku: "KUL-WAL-015", variants: ["Tan Natural", "Cokelat Tua", "Hitam Matte"] },
  { id: "pouch-kosmetik",   name: "Pouch Kosmetik Kulit Handmade",      price: 245000,                 rating: 4.5, reviewCount: 167, sold: 312,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Kambing", origin: "Magetan",   badges: ["New"],             photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 25, status: "active", sku: "KUL-ACC-016", variants: ["Tan Natural", "Cokelat Tua"] },
  { id: "kulit-exotic",     name: "Kulit Buaya Sintetis Premium (per m)", price: 650000,               rating: 4.6, reviewCount: 89,  sold: 142,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Bahan Baku",  material: "Exotic Leather", origin: "Sidoarjo", badges: [],                  photo: "photo-1603400521630-9f2de124b33b", inStock: false, stock: 0, status: "active", sku: "KUL-MAT-017", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "boot-chelsea",     name: "Sepatu Boot Chelsea Kulit Sapi",     price: 1950000,                rating: 4.8, reviewCount: 78,  sold: 103,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",   origin: "Magetan",    badges: ["New"],             photo: "photo-1542291026-7eec264c27ff",   inStock: true, stock: 5, status: "active", sku: "KUL-SHO-018", variants: ["Hitam Matte", "Cokelat Tua"] },
  { id: "tali-jam",         name: "Tali Jam Tangan Kulit Artisan",      price: 145000,                 rating: 4.6, reviewCount: 312, sold: 756,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",   origin: "Magetan",    badges: [],                  photo: "photo-1553062407-98eeb64c6a62",   inStock: true, stock: 40, status: "active", sku: "KUL-ACC-019", variants: ["Cokelat Tua", "Tan Natural", "Hitam Matte"] },
  { id: "tas-shopper",      name: "Tas Shopper Kulit Tote Wanita",      price: 985000,                 rating: 4.8, reviewCount: 203, sold: 445,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Kambing", origin: "Garut",     badges: ["Best Seller"],     photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 9, status: "active", sku: "KUL-BAG-020", variants: ["Tan Natural", "Hitam Matte"] }
];

function getProducts() {
  const stored = localStorage.getItem('kuleather_products');
  if (stored) {
    const list = JSON.parse(stored);
    // Force reload if stored products lack sellerId info, contain old broken photo ID, contain the old photo ID for raw hides, or contain old badges
    if (list.length > 0 && (!list[0].sellerId || stored.includes('photo-1627123424574-724758594785') || stored.includes('photo-1464699908537-0954e50791ee') || stored.includes('"Premium"') || stored.includes('"Sale"'))) {
      localStorage.removeItem('kuleather_products');
    } else {
      return list.filter(p => !p.status || p.status === 'active');
    }
  }
  localStorage.setItem('kuleather_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

const PRODUCTS = getProducts();

// Formatting helper
function formatCurrency(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

// --------------------------------------------------------------------------
// CATALOG PAGE LOGIC
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const catalogGrid = document.getElementById('produk-grid');
  if (!catalogGrid) return; // Exit if not on catalog page

  // Filter State
  const state = {
    cat: 'Semua',
    price: 'Semua',
    rating: 'Semua',
    material: 'Semua',
    origin: 'Semua',
    onlyInStock: false,
    sort: 'newest',
    view: 'grid',
    page: 1,
    perPage: 9,
    search: ''
  };

  // Helper to render stars
  function renderStars(rating) {
    const rounded = Math.round(rating);
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        starsHtml += `<svg style="color:var(--accent); fill:var(--accent);" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      } else {
        starsHtml += `<svg style="color:var(--muted);" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }
    }
    return starsHtml;
  }

  function applyFilters() {
    let filtered = PRODUCTS.filter(p => {
      // 1. Search Query
      if (state.search !== '' && !p.name.toLowerCase().includes(state.search.toLowerCase())) return false;

      // 2. Category
      if (state.cat !== 'Semua' && p.cat !== state.cat) return false;

      // 3. Material
      if (state.material !== 'Semua' && p.material !== state.material) return false;

      // 4. Origin City
      if (state.origin !== 'Semua' && p.origin !== state.origin) return false;

      // 5. Stock status
      if (state.onlyInStock && !p.inStock) return false;

      // 6. Rating minimum
      if (state.rating !== 'Semua') {
        const minRating = parseFloat(state.rating);
        if (p.rating < minRating) return false;
      }

      // 7. Price ranges
      if (state.price === '< Rp 300K' && p.price >= 300000) return false;
      if (state.price === 'Rp 300K – 1JT' && (p.price < 300000 || p.price > 1000000)) return false;
      if (state.price === 'Rp 1JT – 2JT' && (p.price < 1000000 || p.price > 2000000)) return false;
      if (state.price === '> Rp 2JT' && p.price <= 2000000) return false;

      return true;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
      if (state.sort === 'price-asc') return a.price - b.price;
      if (state.sort === 'price-desc') return b.price - a.price;
      if (state.sort === 'rating') return b.rating - a.rating;
      if (state.sort === 'popular') return b.sold - a.sold;
      return 0; // Default newest (original index)
    });

    return filtered;
  }

  function renderCatalog() {
    const filtered = applyFilters();
    const totalCount = filtered.length;
    
    // Update Product Count
    const countDisplay = document.getElementById('produk-count-display');
    if (countDisplay) {
      const start = totalCount > 0 ? (state.page - 1) * state.perPage + 1 : 0;
      const end = Math.min(state.page * state.perPage, totalCount);
      countDisplay.textContent = `Menampilkan ${start}–${end} dari ${totalCount} produk`;
    }

    // Paginate
    const paginated = filtered.slice((state.page - 1) * state.perPage, state.page * state.perPage);

    if (paginated.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl) 0;">
          <svg style="margin: 0 auto var(--space-md) auto; color: var(--text-muted);" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h4 class="heading-3 mb-sm">Produk Tidak Ditemukan</h4>
          <p class="text-secondary body-sm">Silakan ubah filter pencarian Anda untuk menemukan produk.</p>
        </div>
      `;
      renderPagination(0);
      return;
    }

    // Set layout view class
    if (state.view === 'list') {
      catalogGrid.style.gridTemplateColumns = '1fr';
      catalogGrid.style.gap = 'var(--space-md)';
    } else {
      catalogGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
      catalogGrid.style.gap = 'var(--space-lg)';
    }

    let html = '';
    paginated.forEach(p => {
      const imgUrl = p.photo.startsWith('photo-') 
        ? `https://images.unsplash.com/${p.photo}?w=400&h=400&fit=crop&auto=format` 
        : p.photo;
      const badgeHtml = p.badges.map(b => {
        let displayBadge = b;
        let badgeClass = 'badge-bestseller';
        if (b === 'New') {
          badgeClass = 'badge-new';
        } else {
          displayBadge = 'Best Seller';
        }
        return `<span class="badge ${badgeClass}">${displayBadge}</span>`;
      }).join('');

      if (state.view === 'list') {
        // List View Card
        html += `
          <div class="product-card" style="flex-direction:row; height:180px; align-items:stretch;">
            <div class="product-card-img-wrapper" style="width:180px; flex-shrink:0; aspect-ratio:auto;">
              <img src="${imgUrl}" alt="${p.name}" class="product-card-img">
              <div class="product-card-badge-overlay">${badgeHtml}</div>
            </div>
            <div class="product-card-body" style="padding:var(--space-md); flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div class="product-card-meta">
                  <span class="eyebrow">${p.cat}</span>
                  <div class="product-card-rating">
                    ${renderStars(p.rating)}
                    <span style="margin-left:4px;">(${p.reviewCount})</span>
                  </div>
                </div>
                <h3 class="product-card-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
                <div class="product-card-origin" style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-top:2px;">
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>${p.origin} · ${p.material}</span>
                  <span class="text-accent" style="font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase;">${p.seller || 'Mitra Kuleather'}</span>
                </div>
              </div>
              <div class="product-card-footer" style="padding-top:var(--space-xs); border-top:none;">
                <div>
                  <span class="price-lg">${formatCurrency(p.price)}</span>
                  ${p.origPrice ? `<span class="text-subtle" style="text-decoration:line-through; font-size:12px; margin-left:8px;">${formatCurrency(p.origPrice)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-sm list-add-btn" data-id="${p.id}">TAMBAH KE KERANJANG</button>
              </div>
            </div>
          </div>
        `;
      } else {
        // Grid View Card
        const activeUser = typeof getActiveUser === 'function' ? getActiveUser() : null;
        const wishlist = JSON.parse(localStorage.getItem('kuleather_wishlist')) || [];
        const isWishlisted = activeUser && wishlist.some(item => item.userId === activeUser.id && item.productId === p.id);
        const wishClass = isWishlisted ? 'wishlist-btn wishlisted' : 'wishlist-btn';
        const wishFill = isWishlisted ? 'var(--error)' : 'none';

        html += `
          <div class="product-card">
            <div class="product-card-img-wrapper">
              <a href="product.html?id=${p.id}">
                <img src="${imgUrl}" alt="${p.name}" class="product-card-img">
              </a>
              <div class="product-card-badge-overlay">${badgeHtml}</div>
              <button class="${wishClass}" data-id="${p.id}" aria-label="Tambah ke wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishFill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button class="quick-add-btn" data-id="${p.id}">Quick Add</button>
            </div>
            <div class="product-card-body">
              <div class="product-card-meta">
                <span class="eyebrow">${p.cat}</span>
                <div class="product-card-rating">
                  ${renderStars(p.rating)}
                </div>
              </div>
              <h3 class="product-card-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
              <div class="product-card-origin">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>${p.origin}</span>
                <span class="product-seller">${p.seller || 'Mitra Kuleather'}</span>
              </div>
              <div class="product-card-footer">
                <div>
                  <span class="price">${formatCurrency(p.price)}</span>
                  ${p.origPrice ? `<span class="text-subtle" style="text-decoration:line-through; font-size:10px; display:block;">${formatCurrency(p.origPrice)}</span>` : ''}
                </div>
                <span class="caption text-muted">${p.sold} terjual</span>
              </div>
            </div>
          </div>
        `;
      }
    });

    catalogGrid.innerHTML = html;
    attachCatalogEventListeners();
    renderPagination(totalCount);
  }

  function renderPagination(totalCount) {
    const paginationContainer = document.getElementById('catalog-pagination');
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    paginationContainer.innerHTML = paginationHtml;

    // Attach Pagination Events
    paginationContainer.querySelectorAll('.page-num-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        state.page = idx + 1;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const prevBtn = paginationContainer.querySelector('.prev-page-btn');
    if (prevBtn && state.page > 1) {
      prevBtn.addEventListener('click', () => {
        state.page -= 1;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const nextBtn = paginationContainer.querySelector('.next-page-btn');
    if (nextBtn && state.page < totalPages) {
      nextBtn.addEventListener('click', () => {
        state.page += 1;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function attachCatalogEventListeners() {
    // Add to Cart (Quick Add)
    const addBtns = catalogGrid.querySelectorAll('.quick-add-btn, .list-add-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pid = e.target.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === pid);
        if (product && typeof addToCart === 'function') {
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            photo: product.photo,
            variant: 'Cokelat Tua', // Default variant
            qty: 1
          });
        }
      });
    });

    // Wishlist Toggle
    const wishBtns = catalogGrid.querySelectorAll('.wishlist-btn');
    wishBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const btnElem = e.target.closest('.wishlist-btn');
        const activeUser = typeof getActiveUser === 'function' ? getActiveUser() : null;
        
        if (!activeUser) {
          window.showToast('Silakan login terlebih dahulu untuk menambah wishlist.', 'error');
          setTimeout(() => {
            window.location.href = 'auth.html';
          }, 1000);
          return;
        }

        const productId = btnElem.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === productId);
        let wishlist = JSON.parse(localStorage.getItem('kuleather_wishlist')) || [];
        const idx = wishlist.findIndex(item => item.userId === activeUser.id && item.productId === productId);

        btnElem.classList.toggle('wishlisted');
        
        if (btnElem.classList.contains('wishlisted')) {
          btnElem.querySelector('svg').style.fill = 'var(--error)';
          if (idx === -1) {
            wishlist.push({
              userId: activeUser.id,
              productId: product.id,
              name: product.name,
              price: product.price,
              photo: product.photo
            });
            localStorage.setItem('kuleather_wishlist', JSON.stringify(wishlist));
          }
          if (typeof window.showToast === 'function') {
            window.showToast(`Ditambahkan ke wishlist: ${product.name}`, 'success');
          }
        } else {
          btnElem.querySelector('svg').style.fill = 'none';
          wishlist = wishlist.filter(item => !(item.userId === activeUser.id && item.productId === productId));
          localStorage.setItem('kuleather_wishlist', JSON.stringify(wishlist));
          if (typeof window.showToast === 'function') {
            window.showToast(`Dihapus dari wishlist: ${product.name}`, 'info');
          }
        }
      });
    });
  }

  // Bind Sidebar Category Pills
  const catPills = document.querySelectorAll('#filter-category .filter-pill');
  
  // Parse cat parameter from URL to set active category pill on load
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat = urlParams.get('cat');
  if (urlCat) {
    if (urlCat === 'Jasa' || urlCat === 'Jasa Pengrajin') {
      window.location.href = 'services.html';
      return;
    }
    const targetPill = Array.from(catPills).find(p => p.getAttribute('data-value') === urlCat);
    if (targetPill) {
      catPills.forEach(p => p.classList.remove('active'));
      targetPill.classList.add('active');
      state.cat = urlCat;
    }
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const val = e.target.getAttribute('data-value');
      if (val === 'Jasa') {
        window.location.href = 'services.html';
        return;
      }
      catPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.cat = val;
      state.page = 1;
      renderCatalog();
    });
  });

  // Bind Sidebar Price Pills
  const pricePills = document.querySelectorAll('#filter-price .filter-pill');
  pricePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pricePills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.price = e.target.getAttribute('data-value');
      state.page = 1;
      renderCatalog();
    });
  });

  // Bind Sidebar Material Pills
  const matPills = document.querySelectorAll('#filter-material .filter-pill');
  matPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      matPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.material = e.target.getAttribute('data-value');
      state.page = 1;
      renderCatalog();
    });
  });

  // Bind Sidebar Origin City Pills
  const originPills = document.querySelectorAll('#filter-origin .filter-pill');
  originPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      originPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.origin = e.target.getAttribute('data-value');
      state.page = 1;
      renderCatalog();
    });
  });

  // Bind Rating Filter Checkbox
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
      renderCatalog();
    });
  });

  // Stock status toggle
  const stockToggle = document.getElementById('filter-stock-toggle');
  if (stockToggle) {
    stockToggle.addEventListener('change', (e) => {
      state.onlyInStock = e.target.checked;
      state.page = 1;
      renderCatalog();
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset State
      state.cat = 'Semua';
      state.price = 'Semua';
      state.rating = 'Semua';
      state.material = 'Semua';
      state.origin = 'Semua';
      state.onlyInStock = false;
      state.search = '';
      state.page = 1;

      // Reset DOM Styles
      catPills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-category [data-value="Semua"]').classList.add('active');
      
      pricePills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-price [data-value="Semua"]').classList.add('active');
      
      matPills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-material [data-value="Semua"]').classList.add('active');
      
      originPills.forEach(p => p.classList.remove('active'));
      document.querySelector('#filter-origin [data-value="Semua"]').classList.add('active');

      ratingCheckboxes.forEach(c => c.checked = false);
      if (stockToggle) stockToggle.checked = false;

      const searchInput = document.getElementById('produk-search-input');
      if (searchInput) searchInput.value = '';

      renderCatalog();
    });
  }

  // Search Input Bind
  const searchInput = document.getElementById('produk-search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        renderCatalog();
      }, 300); // Debounce
    });
  }

  // Sort Select Bind
  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      state.page = 1;
      renderCatalog();
    });
  }

  // View Layout Toggles
  const gridViewBtn = document.getElementById('view-grid-btn');
  const listViewBtn = document.getElementById('view-list-btn');

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      state.view = 'grid';
      renderCatalog();
    });

    listViewBtn.addEventListener('click', () => {
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      state.view = 'list';
      renderCatalog();
    });
  }

  // Initial render
  renderCatalog();

  // ==========================================================================
  // MOBILE FILTER SIDEBAR TOGGLE
  // ==========================================================================
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const filterOverlay = document.getElementById('filter-overlay');
  const produkSidebar = document.getElementById('produk-sidebar');
  const filterSidebarClose = document.getElementById('filter-sidebar-close');

  function openMobileFilter() {
    if (produkSidebar && filterOverlay) {
      produkSidebar.classList.add('open');
      filterOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (filterSidebarClose) filterSidebarClose.style.display = 'flex';
    }
  }

  function closeMobileFilter() {
    if (produkSidebar && filterOverlay) {
      produkSidebar.classList.remove('open');
      filterOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (filterSidebarClose) filterSidebarClose.style.display = 'none';
    }
  }

  if (filterToggleBtn) filterToggleBtn.addEventListener('click', openMobileFilter);
  if (filterOverlay) filterOverlay.addEventListener('click', closeMobileFilter);
  if (filterSidebarClose) filterSidebarClose.addEventListener('click', closeMobileFilter);

  // Close mobile filter on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileFilter();
  });
});


