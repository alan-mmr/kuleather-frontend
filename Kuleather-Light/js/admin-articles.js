// ==========================================================================
// 🌿 Kuleather Light — Admin Articles Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core State
  const state = {
    articles: [],
    filteredArticles: [],
    page: 1,
    perPage: 10,
    search: '',
    category: 'Semua',
    status: 'Semua',
    selectedItems: new Set()
  };

  // Article tags helper
  let currentTags = [];

  // DOM Elements
  const tbody = document.getElementById('articles-table-tbody');
  const searchInput = document.getElementById('article-search-input');
  const categorySelect = document.getElementById('filter-category-select');
  const statusSelect = document.getElementById('filter-status-select');
  const paginationContainer = document.getElementById('articles-pagination');
  
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const bulkActionsArea = document.getElementById('bulk-actions-area');
  const bulkCountLabel = document.getElementById('bulk-count-label');
  const totalCountEl = document.getElementById('article-total-count');

  // Modal Fields
  const crudForm = document.getElementById('article-crud-form');
  const idField = document.getElementById('article-id-field');
  const titleField = document.getElementById('article-title');
  const categoryField = document.getElementById('article-category');
  const statusField = document.getElementById('article-status');
  const authorNameField = document.getElementById('article-author-name');
  const authorRoleField = document.getElementById('article-author-role');
  const authorPhotoField = document.getElementById('article-author-photo');
  const readtimeField = document.getElementById('article-readtime');
  const excerptField = document.getElementById('article-excerpt');
  const contentField = document.getElementById('article-content');
  
  const photoField = document.getElementById('article-photo');
  const imgPreview = document.getElementById('article-image-preview');
  const imgPlaceholder = document.getElementById('article-image-placeholder');

  const tagsInput = document.getElementById('article-tags-input');
  const tagsContainer = document.getElementById('article-tags-container');

  // Load articles list
  function loadArticles() {
    state.articles = JSON.parse(localStorage.getItem('kuleather_articles')) || [];
    applyFilters();
  }

  // Filter Articles
  function applyFilters() {
    state.filteredArticles = state.articles.filter(a => {
      // Search term (title or tag)
      const matchesSearch = state.search === '' || 
        a.title.toLowerCase().includes(state.search.toLowerCase()) || 
        (a.tags && a.tags.some(t => t.toLowerCase().includes(state.search.toLowerCase())));

      // Category
      const matchesCategory = state.category === 'Semua' || a.cat === state.category;

      // Status
      const matchesStatus = state.status === 'Semua' || a.status === state.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Reset pagination to page 1 if current page becomes empty
    const maxPages = Math.ceil(state.filteredArticles.length / state.perPage);
    if (state.page > maxPages) state.page = Math.max(1, maxPages);

    totalCountEl.textContent = state.filteredArticles.length;
    renderTable();
    renderPagination();
    updateBulkControls();
  }

  // Render table rows
  function renderTable() {
    if (!tbody) return;

    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const paginated = state.filteredArticles.slice(start, end);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-muted">Tidak ada artikel yang ditemukan</td></tr>`;
      return;
    }

    let html = '';
    paginated.forEach((a, index) => {
      // Index count formatted
      const idx = start + index + 1;
      
      // Cover image
      const imgUrl = a.photo.startsWith('http') || a.photo.startsWith('photo-') ? (a.photo.startsWith('photo-') ? `https://images.unsplash.com/${a.photo}?w=80&h=80&fit=crop&auto=format` : a.photo) : `https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&h=80&fit=crop&auto=format`;

      // Status badge published/draft
      let statusText = 'Draft';
      let statusClass = 'status-draft';
      if (a.status === 'published') { statusText = 'Published'; statusClass = 'status-published'; }

      const isChecked = state.selectedItems.has(a.id) ? 'checked' : '';
      const isSelectedRowClass = state.selectedItems.has(a.id) ? 'selected' : '';

      html += `
        <tr class="${isSelectedRowClass}" data-id="${a.id}">
          <td>
            <label class="admin-checkbox-custom">
              <input type="checkbox" class="row-selector-checkbox" data-id="${a.id}" ${isChecked}>
              <span class="admin-checkbox-checkmark"></span>
            </label>
          </td>
          <td>
            <img src="${imgUrl}" alt="${a.title}" class="admin-table-img">
          </td>
          <td>
            <strong style="display:block; font-size:0.85rem;"><a href="../article.html?id=${a.id}" target="_blank">${a.title}</a></strong>
            <span class="caption text-muted" style="font-family:var(--font-mono); font-size:0.65rem;">ID: ${a.id}</span>
          </td>
          <td><span class="status-pill status-refund" style="font-size:0.6rem; font-weight:normal;">${a.cat}</span></td>
          <td style="font-size:0.75rem;">${a.author ? a.author.name : 'Editor'}</td>
          <td>
            <span class="status-pill ${statusClass}">
              <span class="dot"></span>
              ${statusText}
            </span>
          </td>
          <td class="mono text-muted" style="font-size:0.7rem;">${a.date}</td>
          <td class="mono text-center" style="font-size:0.75rem;">${a.views || '0'}</td>
          <td class="admin-table-actions">
            <button class="admin-table-action-btn" title="Edit Artikel" onclick="openArticleEditModal('${a.id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="admin-table-action-btn delete" title="Hapus Artikel" onclick="deleteArticle('${a.id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    // Attach Row Checkbox Events
    tbody.querySelectorAll('.row-selector-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const tr = tbody.querySelector(`tr[data-id="${id}"]`);
        if (e.target.checked) {
          state.selectedItems.add(id);
          if (tr) tr.classList.add('selected');
        } else {
          state.selectedItems.delete(id);
          if (tr) tr.classList.remove('selected');
        }
        updateBulkControls();
      });
    });
  }

  // Render Pagination
  function renderPagination() {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(state.filteredArticles.length / state.perPage);

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

  // Bulk select toggles
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const start = (state.page - 1) * state.perPage;
      const end = start + state.perPage;
      const paginated = state.filteredArticles.slice(start, end);

      paginated.forEach(a => {
        const tr = tbody.querySelector(`tr[data-id="${a.id}"]`);
        const cb = tr ? tr.querySelector('.row-selector-checkbox') : null;
        if (e.target.checked) {
          state.selectedItems.add(a.id);
          if (cb) cb.checked = true;
          if (tr) tr.classList.add('selected');
        } else {
          state.selectedItems.delete(a.id);
          if (cb) cb.checked = false;
          if (tr) tr.classList.remove('selected');
        }
      });
      updateBulkControls();
    });
  }

  function updateBulkControls() {
    const selectedCount = state.selectedItems.size;
    if (selectedCount > 0) {
      if (bulkActionsArea) bulkActionsArea.style.display = 'flex';
      if (bulkCountLabel) bulkCountLabel.textContent = `${selectedCount} terpilih`;
    } else {
      if (bulkActionsArea) bulkActionsArea.style.display = 'none';
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
    }
  }

  // Bulk Delete
  window.triggerBulkDelete = function() {
    const selectedCount = state.selectedItems.size;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCount} artikel terpilih secara permanen?`)) {
      const aList = state.articles.filter(a => !state.selectedItems.has(a.id));
      localStorage.setItem('kuleather_articles', JSON.stringify(aList));
      
      // Log Notification
      createSystemNotification(`Admin Utama menghapus massal ${selectedCount} artikel`, 'article', 'var(--error)');
      showToast(`${selectedCount} artikel berhasil dihapus secara massal.`, 'success');
      
      state.selectedItems.clear();
      loadArticles();
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

  // Photo live preview
  if (photoField) {
    photoField.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      updateImagePreview(val);
    });
  }

  function updateImagePreview(val) {
    if (val === '') {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'block';
      return;
    }

    const imgUrl = val.startsWith('http') || val.startsWith('photo-') ? (val.startsWith('photo-') ? `https://images.unsplash.com/${val}?w=400&h=300&fit=crop&auto=format` : val) : val;
    imgPreview.src = imgUrl;
    imgPreview.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  }

  // Tag input logic
  function renderTags() {
    const tagElements = tagsContainer.querySelectorAll('.admin-tag-pill');
    tagElements.forEach(el => el.remove());

    currentTags.forEach((tag, idx) => {
      const tagPill = document.createElement('span');
      tagPill.className = 'admin-tag-pill';
      tagPill.innerHTML = `
        ${tag}
        <span class="admin-tag-pill-close" onclick="removeTag(${idx})">×</span>
      `;
      tagsContainer.insertBefore(tagPill, tagsInput);
    });
  }

  window.removeTag = function(index) {
    currentTags.splice(index, 1);
    renderTags();
  };

  if (tagsInput) {
    tagsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = tagsInput.value.trim().replace(',', '');
        if (val && !currentTags.includes(val)) {
          currentTags.push(val);
          renderTags();
        }
        tagsInput.value = '';
      }
    });

    tagsInput.addEventListener('blur', () => {
      const val = tagsInput.value.trim().replace(',', '');
      if (val && !currentTags.includes(val)) {
        currentTags.push(val);
        renderTags();
      }
      tagsInput.value = '';
    });
  }

  // Form Submissions
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = idField.value.trim();
      const title = titleField.value.trim();
      const category = categoryField.value;
      const status = statusField.value;
      const authorName = authorNameField.value.trim();
      const authorRole = authorRoleField.value.trim();
      const authorPhoto = authorPhotoField.value.trim() || 'photo-1472099645785-5658abf4ff4e';
      const readTime = readtimeField.value.trim();
      const excerpt = excerptField.value.trim();
      const content = contentField.value.trim();
      const photo = photoField.value.trim() || 'photo-1565193566173-7a0ee3dbe261';

      // Generate slug ID if new
      let slugId = id;
      if (!slugId) {
        slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const checkConflict = state.articles.find(a => a.id === slugId);
        if (checkConflict) {
          slugId += '-' + Math.floor(Math.random() * 1000);
        }
      }

      // Format Date ID e.g. "11 Jun 2026"
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const articleData = {
        id: slugId,
        cat: category,
        title: title,
        excerpt: excerpt,
        date: id ? (state.articles.find(a => a.id === id)?.date || dateString) : dateString,
        readTime: readTime,
        views: id ? (state.articles.find(a => a.id === id)?.views || '0') : '0',
        viewsCount: id ? (state.articles.find(a => a.id === id)?.viewsCount || 0) : 0,
        author: {
          name: authorName,
          role: authorRole,
          photo: authorPhoto
        },
        photo: photo,
        tags: currentTags,
        status: status,
        content: content,
        createdAt: id ? (state.articles.find(a => a.id === id)?.createdAt || now.toISOString().slice(0, 10)) : now.toISOString().slice(0, 10)
      };

      if (id) {
        // Edit Mode
        const index = state.articles.findIndex(a => a.id === id);
        if (index !== -1) {
          state.articles[index] = articleData;
          createSystemNotification(`Artikel '${title}' diperbarui oleh Admin Utama`, 'article', 'var(--accent)');
          showToast('Artikel berhasil diperbarui.', 'success');
        }
      } else {
        // Add Mode
        state.articles.unshift(articleData);
        createSystemNotification(`Artikel baru '${title}' diterbitkan oleh Admin Utama`, 'article', 'var(--success)');
        showToast('Artikel baru berhasil diterbitkan.', 'success');
      }

      localStorage.setItem('kuleather_articles', JSON.stringify(state.articles));
      closeModal('article-modal-overlay');
      loadArticles();
    });
  }

  // Open Modal Add mode
  window.openArticleAddModal = function() {
    document.getElementById('article-modal-title').textContent = 'Tulis Artikel Baru';
    crudForm.reset();
    idField.value = '';
    
    // Default author data
    authorNameField.value = 'Admin Utama';
    authorRoleField.value = 'Editor Kuleather';
    authorPhotoField.value = 'photo-1472099645785-5658abf4ff4e';
    readtimeField.value = '6 menit';
    
    currentTags = ['Jurnal', 'Magetan'];
    renderTags();
    updateImagePreview('');
    openModal('article-modal-overlay');
  };

  // Open Modal Edit mode
  window.openArticleEditModal = function(id) {
    const a = state.articles.find(art => art.id === id);
    if (!a) return;

    document.getElementById('article-modal-title').textContent = 'Edit Artikel';
    
    // Autofill
    idField.value = a.id;
    titleField.value = a.title;
    categoryField.value = a.cat;
    statusField.value = a.status || 'published';
    authorNameField.value = a.author ? a.author.name : '';
    authorRoleField.value = a.author ? a.author.role : '';
    authorPhotoField.value = a.author ? a.author.photo : '';
    readtimeField.value = a.readTime || '';
    excerptField.value = a.excerpt || '';
    contentField.value = a.content || '';
    photoField.value = a.photo || '';
    
    updateImagePreview(a.photo || '');

    // Tags list copy
    currentTags = a.tags ? [...a.tags] : [];
    renderTags();

    openModal('article-modal-overlay');
  };

  // Delete article
  window.deleteArticle = function(id) {
    const a = state.articles.find(art => art.id === id);
    if (!a) return;

    if (confirm(`Apakah Anda yakin ingin menghapus artikel '${a.title}' secara permanen?`)) {
      state.articles = state.articles.filter(art => art.id !== id);
      localStorage.setItem('kuleather_articles', JSON.stringify(state.articles));
      
      // Log Notification
      createSystemNotification(`Admin Utama menghapus artikel '${a.title}'`, 'article', 'var(--error)');
      showToast(`Artikel '${a.title}' berhasil dihapus.`, 'success');
      
      state.selectedItems.delete(id);
      loadArticles();
    }
  };

  // Initial Load
  loadArticles();
});
