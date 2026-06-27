// ==========================================================================
// KULEATHER JOURNAL ENGINE
// ==========================================================================

const DEFAULT_ARTICLES = [
  {
    id: "vegetable-tanning", cat: "Teknik",
    title: "Seni Penyamakan Vegetable: Tradisi yang Bertahan Satu Abad",
    excerpt: "Di sudut tenang Magetan, teknik penyamakan vegetable masih dipraktikkan dengan penuh dedikasi. Mengapa metode yang membutuhkan 60 hari ini justru semakin diminati pasar global?",
    date: "22 Mei 2026", readTime: "8 menit", views: "4,2K",
    author: {
      name: "Ahmad Rifai", role: "Editor Senior",
      photo: "photo-1472099645785-5658abf4ff4e"
    },
    photo: "photo-1565193566173-7a0ee3dbe261",
    tags: ["Teknik", "Vegetable Tanning", "Tradisi", "Magetan"]
  },
  {
    id: "panduan-full-grain", cat: "Panduan Kulit",
    title: "Panduan Memilih Kulit Full Grain untuk Pemula",
    excerpt: "Full grain, top grain, genuine leather — istilah-istilah ini membingungkan banyak pembeli. Panduan lengkap ini membantu Anda membuat keputusan yang tepat.",
    date: "18 Mei 2026", readTime: "6 menit", views: "3,8K",
    author: {
      name: "Dewi Kartika", role: "Jurnalis Mode",
      photo: "photo-1494790108377-be9c29b29330"
    },
    photo: "photo-1464699908537-0954e50791ee",
    tags: ["Full Grain", "Panduan", "Pemula", "Kualitas"]
  },
  {
    id: "pak-slamet", cat: "Profil Pengrajin",
    title: "Pak Slamet: 40 Tahun Mengukir Keindahan dari Kulit",
    excerpt: "Empat dekade di balik meja kerja, ribuan produk yang telah menemani perjalanan hidup pemakainya. Kisah seorang maestro yang memilih tetap berkarya di kampung halaman.",
    date: "15 Mei 2026", readTime: "10 menit", views: "6,1K",
    author: {
      name: "Baskoro Aji", role: "Penulis & Fotografer",
      photo: "photo-1507003211169-0a1dd7228f2d"
    },
    photo: "photo-1507003211169-0a1dd7228f2d",
    tags: ["Profil", "Pengrajin", "Magetan", "Inspirasi"]
  },
  {
    id: "tren-kulit-2026", cat: "Tren Industri",
    title: "Tren Kulit 2026: Dari Lokal ke Panggung Internasional",
    excerpt: "Brand mewah dunia mulai melirik pengrajin Magetan. Apa yang mendorong pergeseran ini dan bagaimana industri kulit Indonesia bisa memanfaatkan momentum bersejarah ini?",
    date: "12 Mei 2026", readTime: "7 menit", views: "5,3K",
    author: {
      name: "Ahmad Rifai", role: "Editor Senior",
      photo: "photo-1472099645785-5658abf4ff4e"
    },
    photo: "photo-1603400521630-9f2de124b33b",
    tags: ["Tren", "Ekspor", "Global", "2026"]
  },
  {
    id: "merawat-tas", cat: "Perawatan",
    title: "Panduan Lengkap Merawat Tas Kulit agar Awet Seumur Hidup",
    excerpt: "Tas kulit berkualitas seharusnya bertahan lebih dari satu generasi. Dengan perawatan yang tepat, investasi Anda akan semakin indah seiring berjalannya waktu.",
    date: "9 Mei 2026", readTime: "5 menit", views: "7,9K",
    author: {
      name: "Dewi Kartika", role: "Jurnalis Mode",
      photo: "photo-1494790108377-be9c29b29330"
    },
    photo: "photo-1548036328-c9fa89d128fa",
    tags: ["Perawatan", "Tas", "Tips", "Investasi"]
  },
  {
    id: "saddle-stitch", cat: "Teknik",
    title: "Saddle Stitch: Mengapa Jahitan Tangan Lebih Superior dari Mesin",
    excerpt: "Dua jarum, satu benang, ketelitian tanpa kompromi. Teknik saddle stitch adalah segel kualitas yang membedakan karya tangan dari produksi massal.",
    date: "6 Mei 2026", readTime: "6 menit", views: "3,2K",
    author: {
      name: "Ahmad Rifai", role: "Editor Senior",
      photo: "photo-1472099645785-5658abf4ff4e"
    },
    photo: "photo-1553062407-98eeb64c6a62",
    tags: ["Teknik", "Saddle Stitch", "Jahit Tangan", "Kualitas"]
  },
  {
    id: "memilih-warna", cat: "Panduan Kulit",
    title: "Seni Memilih Warna Kulit yang Tepat untuk Setiap Aksesori",
    excerpt: "Warna kulit memengaruhi ketahanan, perawatan, dan bagaimana produk berkembang seiring waktu. Panduan ini membantu Anda memilih dengan bijak dan percaya diri.",
    date: "3 Mei 2026", readTime: "4 menit", views: "2,7K",
    author: {
      name: "Dewi Kartika", role: "Jurnalis Mode",
      photo: "photo-1494790108377-be9c29b29330"
    },
    photo: "photo-1553062407-98eeb64c6a62",
    tags: ["Warna", "Panduan", "Aksesori", "Desain"]
  },
  {
    id: "bu-ningsih", cat: "Profil Pengrajin",
    title: "Bu Ningsih dan Impiannya Membawa Magetan ke Panggung Dunia",
    excerpt: "Dari sebuah rumah kecil di pelosok Magetan, Bu Ningsih memimpin kelompok pengrajin perempuan yang kini mengekspor produk ke delapan negara.",
    date: "30 Apr 2026", readTime: "9 menit", views: "8,4K",
    author: {
      name: "Baskoro Aji", role: "Penulis & Fotografer",
      photo: "photo-1507003211169-0a1dd7228f2d"
    },
    photo: "photo-1494790108377-be9c29b29330",
    tags: ["Profil", "Perempuan Pengrajin", "Ekspor", "Inspirasi"]
  },
  {
    id: "digitalisasi", cat: "Tren Industri",
    title: "Digitalisasi dan Masa Depan Ekosistem Kulit Nusantara",
    excerpt: "Platform digital bukan sekadar marketplace. Mereka adalah katalis transformasi yang mengubah cara pengrajin berkarya, berjualan, dan tumbuh bersama.",
    date: "27 Apr 2026", readTime: "8 menit", views: "4,6K",
    author: {
      name: "Ahmad Rifai", role: "Editor Senior",
      photo: "photo-1472099645785-5658abf4ff4e"
    },
    photo: "photo-1581091226825-a6a2a5aee158",
    tags: ["Digital", "Platform", "Transformasi", "UMKM"]
  },
  {
    id: "merawat-sepatu", cat: "Perawatan",
    title: "Teknik Profesional Merawat dan Mengkilapkan Sepatu Kulit",
    excerpt: "Sepatu kulit yang dirawat dengan benar berbicara tentang karakter pemakainya. Pelajari teknik yang digunakan para pembuat sepatu profesional dunia.",
    date: "24 Apr 2026", readTime: "5 menit", views: "5,1K",
    author: {
      name: "Dewi Kartika", role: "Jurnalis Mode",
      photo: "photo-1494790108377-be9c29b29330"
    },
    photo: "photo-1542291026-7eec264c27ff",
    tags: ["Sepatu", "Perawatan", "Poles", "Teknik"]
  },
  {
    id: "burnishing", cat: "Teknik",
    title: "Burnishing: Rahasia di Balik Tepi Kulit yang Sempurna",
    excerpt: "Tepi produk kulit yang halus dan mengkilap membutuhkan burnishing — proses yang memerlukan kesabaran, alat tepat, dan pemahaman mendalam tentang material.",
    date: "21 Apr 2026", readTime: "5 menit", views: "2,9K",
    author: {
      name: "Ahmad Rifai", role: "Editor Senior",
      photo: "photo-1472099645785-5658abf4ff4e"
    },
    photo: "photo-1551028719-00167b16eac5",
    tags: ["Teknik", "Burnishing", "Finishing", "Edge"]
  },
  {
    id: "veg-vs-chrome", cat: "Panduan Kulit",
    title: "Vegetable vs Chrome Tanning: Panduan Memilih yang Tepat",
    excerpt: "Dua metode penyamakan terbesar di dunia, masing-masing dengan kelebihan dan kekurangannya. Pahami perbedaan mendasar sebelum Anda membeli.",
    date: "18 Apr 2026", readTime: "7 menit", views: "6,7K",
    author: {
      name: "Dewi Kartika", role: "Jurnalis Mode",
      photo: "photo-1494790108377-be9c29b29330"
    },
    photo: "photo-1464699908537-0954e50791ee",
    tags: ["Vegetable", "Chrome", "Panduan", "Perbandingan"]
  }
];

function getArticles() {
  const stored = localStorage.getItem('kuleather_articles');
  if (stored) {
    if (stored.includes('photo-1627123424574-724758594785') || stored.includes('photo-1530018607912-eff2df114f1f') || stored.includes('photo-153062407-98eeb64c6a62')) {
      localStorage.removeItem('kuleather_articles');
    } else {
      // Return all articles that are NOT drafts
      return JSON.parse(stored).filter(a => !a.status || a.status === 'published');
    }
  }
  localStorage.setItem('kuleather_articles', JSON.stringify(DEFAULT_ARTICLES));
  return DEFAULT_ARTICLES;
}

const ARTICLES = getArticles();

// --------------------------------------------------------------------------
// JOURNAL PAGE LOGIC
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const journalGrid = document.getElementById('journal-grid');
  const featuredArticleContainer = document.getElementById('featured-article-container');
  
  if (!journalGrid) return; // Exit if not on journal page

  const state = {
    cat: 'Semua',
    search: '',
    page: 1,
    perPage: 6
  };

  function applyFilters() {
    return ARTICLES.filter(art => {
      // 1. Category Filter
      if (state.cat !== 'Semua' && art.cat !== state.cat) return false;

      // 2. Search query matches title, excerpt or tags
      if (state.search !== '') {
        const query = state.search.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query);
        const matchesExcerpt = art.excerpt.toLowerCase().includes(query);
        const matchesTags = art.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesExcerpt && !matchesTags) return false;
      }
      return true;
    });
  }

  function renderArticles() {
    const filtered = applyFilters();
    const totalCount = filtered.length;
    
    // Check if we have articles
    if (totalCount === 0) {
      if (featuredArticleContainer) featuredArticleContainer.innerHTML = '';
      journalGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl) 0;">
          <svg style="margin: 0 auto var(--space-md) auto; color: var(--text-muted);" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h4 class="heading-3 mb-sm">Artikel Tidak Ditemukan</h4>
          <p class="text-secondary body-sm">Silakan ubah kategori atau filter pencarian Anda.</p>
        </div>
      `;
      renderPagination(0);
      return;
    }

    // Set apart Featured article on Page 1 if no search query
    let articlesToDisplay = filtered;
    let featuredArticle = null;

    if (state.page === 1 && state.search === '' && state.cat === 'Semua') {
      featuredArticle = filtered[0];
      articlesToDisplay = filtered.slice(1);
    }

    // Render Featured Article Header
    if (featuredArticleContainer) {
      if (featuredArticle) {
        const featImgUrl = `https://images.unsplash.com/${featuredArticle.photo}?w=1200&h=600&fit=crop&auto=format`;
        const authorImgUrl = `https://images.unsplash.com/${featuredArticle.author.photo}?w=60&h=60&fit=crop&auto=format`;
        
        featuredArticleContainer.innerHTML = `
          <div class="featured-article-card">
            <div class="article-card-img-wrapper">
              <img src="${featImgUrl}" alt="${featuredArticle.title}" style="width:100%; height:100%; object-fit:cover;">
              <span class="badge badge-bestseller" style="position:absolute; top:16px; left:16px; z-index:5;">PILIHAN EDITOR</span>
            </div>
            <div class="article-card-body" style="padding:var(--space-2xl) var(--space-lg); display:flex; flex-direction:column; justify-content:center;">
              <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-sm">
                <span class="badge badge-premium">${featuredArticle.cat}</span>
                <span class="article-card-date">${featuredArticle.date}</span>
              </div>
              <h2 class="display-lg mb-md" style="font-size:32px; line-height:1.2; font-weight:400;">
                <a href="article.html?id=${featuredArticle.id}">${featuredArticle.title}</a>
              </h2>
              <p class="text-secondary body mb-xl">${featuredArticle.excerpt}</p>
              
              <div style="display:flex; align-items:center; gap:var(--space-md); margin-top:auto;" class="pt-md">
                <img src="${authorImgUrl}" alt="${featuredArticle.author.name}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
                <div>
                  <h4 class="body-sm" style="font-weight:600; margin-bottom:2px;">${featuredArticle.author.name}</h4>
                  <p class="caption text-muted">${featuredArticle.author.role}</p>
                </div>
                <div style="margin-left:auto; display:flex; align-items:center; gap:8px;" class="caption text-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>${featuredArticle.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        `;
        featuredArticleContainer.style.display = 'block';
      } else {
        featuredArticleContainer.innerHTML = '';
        featuredArticleContainer.style.display = 'none';
      }
    }

    // Paginate remaining articles
    const perPage = state.page === 1 && featuredArticle ? state.perPage - 1 : state.perPage;
    const startIdx = state.page === 1 ? 0 : (state.page - 1) * state.perPage - (featuredArticle ? 1 : 0);
    const paginated = articlesToDisplay.slice(startIdx, startIdx + perPage);

    let html = '';
    paginated.forEach(art => {
      const artImgUrl = `https://images.unsplash.com/${art.photo}?w=600&h=400&fit=crop&auto=format`;
      const authImgUrl = `https://images.unsplash.com/${art.author.photo}?w=50&h=50&fit=crop&auto=format`;
      
      html += `
        <article class="article-card reveal">
          <div class="article-card-img-wrapper">
            <img src="${artImgUrl}" alt="${art.title}" class="article-card-img">
            <span class="badge badge-premium article-card-badge">${art.cat}</span>
          </div>
          <div class="article-card-body">
            <span class="article-card-date">${art.date}</span>
            <h3 class="article-card-title mb-sm mt-xs" style="font-size:18px;">
              <a href="article.html?id=${art.id}">${art.title}</a>
            </h3>
            <p class="article-card-excerpt body-sm">${art.excerpt}</p>
            
            <div class="article-card-footer">
              <img src="${authImgUrl}" alt="${art.author.name}" class="article-card-author-img">
              <div class="article-card-author-info">
                <span style="font-weight:600; display:block;">${art.author.name}</span>
                <span class="caption text-muted" style="font-size:8px;">${art.author.role}</span>
              </div>
              <div style="margin-left:auto; display:flex; align-items:center; gap:4px;" class="caption text-muted">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>${art.readTime}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    });

    journalGrid.innerHTML = html;
    renderPagination(totalCount);
    
    // Trigger scroll reveal for new elements
    if (typeof window.requestAnimationFrame === 'function') {
      const reveals = journalGrid.querySelectorAll('.reveal');
      setTimeout(() => {
        reveals.forEach(r => r.classList.add('revealed'));
      }, 50);
    }
  }

  function renderPagination(totalCount) {
    const paginationContainer = document.getElementById('journal-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalCount / state.perPage);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHtml = '';
    
    // Prev
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

    // Next
    paginationHtml += `
      <button class="btn btn-ghost btn-sm next-page-btn" ${state.page === totalPages ? 'disabled' : ''} style="padding: 8px 12px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    paginationContainer.innerHTML = paginationHtml;

    // Attach Events
    paginationContainer.querySelectorAll('.page-num-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        state.page = idx + 1;
        renderArticles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const prevBtn = paginationContainer.querySelector('.prev-page-btn');
    if (prevBtn && state.page > 1) {
      prevBtn.addEventListener('click', () => {
        state.page -= 1;
        renderArticles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const nextBtn = paginationContainer.querySelector('.next-page-btn');
    if (nextBtn && state.page < totalPages) {
      nextBtn.addEventListener('click', () => {
        state.page += 1;
        renderArticles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Bind Category Filter Pills
  const catPills = document.querySelectorAll('#journal-category-filters .filter-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      catPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.cat = e.target.getAttribute('data-value');
      state.page = 1;
      renderArticles();
    });
  });

  // Bind Search Input
  const searchInput = document.getElementById('journal-search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        renderArticles();
      }, 300);
    });
  }

  // Initial render
  renderArticles();
});
