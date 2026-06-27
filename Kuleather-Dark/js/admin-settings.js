// ==========================================================================
// 🌿 Kuleather Light — Admin Settings Module
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check auth first
  if (typeof isAuthorized !== 'undefined' && !isAuthorized) return;

  initTabs();
  initSiteInfo();
  initPromoCodes();
  initFaqs();
  initTestimonials();
  initPartners();
  initStats();
  initShippingRates();
  initNewsletter();
});

// ==========================================================================
// 1. TABS NAVIGATION ENGINE
// ==========================================================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content visibility
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

// ==========================================================================
// 2. SITE INFO SETTINGS
// ==========================================================================
function initSiteInfo() {
  const form = document.getElementById('form-setting-site');
  if (!form) return;

  const settings = JSON.parse(localStorage.getItem('kuleather_site_settings')) || {};

  // Prefill fields
  document.getElementById('site-name').value = settings.siteName || '';
  document.getElementById('site-tagline').value = settings.tagline || '';
  document.getElementById('site-email').value = settings.email || '';
  document.getElementById('site-phone').value = settings.phone || '';
  document.getElementById('site-address').value = settings.address || '';
  document.getElementById('site-social-ig').value = (settings.socialMedia && settings.socialMedia.instagram) || '';
  document.getElementById('site-social-fb').value = (settings.socialMedia && settings.socialMedia.facebook) || '';
  document.getElementById('site-social-tw').value = (settings.socialMedia && settings.socialMedia.twitter) || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedSettings = {
      ...settings,
      siteName: document.getElementById('site-name').value.trim(),
      tagline: document.getElementById('site-tagline').value.trim(),
      email: document.getElementById('site-email').value.trim(),
      phone: document.getElementById('site-phone').value.trim(),
      address: document.getElementById('site-address').value.trim(),
      socialMedia: {
        instagram: document.getElementById('site-social-ig').value.trim(),
        facebook: document.getElementById('site-social-fb').value.trim(),
        twitter: document.getElementById('site-social-tw').value.trim()
      }
    };

    localStorage.setItem('kuleather_site_settings', JSON.stringify(updatedSettings));
    showToast('Informasi situs berhasil diperbarui', 'success');
    createSystemNotification('Informasi situs diperbarui oleh admin', 'system', 'var(--info)');
  });
}

// ==========================================================================
// 3. PROMO CODES CRUD SYSTEM
// ==========================================================================
let promoCodes = [];

function initPromoCodes() {
  promoCodes = JSON.parse(localStorage.getItem('kuleather_promo_codes')) || [];
  renderPromoTable();

  const form = document.getElementById('promo-crud-form');
  if (form) {
    form.addEventListener('submit', handlePromoSubmit);
  }
}

function renderPromoTable() {
  const tbody = document.getElementById('promo-table-tbody');
  if (!tbody) return;

  if (promoCodes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">BELUM ADA KODE PROMO</td></tr>`;
    return;
  }

  tbody.innerHTML = promoCodes.map(promo => {
    const discountText = promo.type === 'free_shipping' ? 'Gratis Ongkir' : `${promo.discount}%`;
    const minOrderText = idr(promo.minOrder);
    const statusClass = promo.active ? 'status-pill-success' : 'status-pill-error';
    const statusText = promo.active ? 'Aktif' : 'Nonaktif';

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: bold; color: var(--accent);">${promo.code}</td>
        <td style="font-family: var(--font-mono);">${discountText}</td>
        <td>${promo.type === 'percent' ? 'Persentase' : 'Gratis Ongkir'}</td>
        <td style="font-family: var(--font-mono);">${minOrderText}</td>
        <td>
          <span class="status-pill ${statusClass}">${statusText}</span>
        </td>
        <td style="text-align: center; font-family: var(--font-mono);">${promo.usageCount || 0}</td>
        <td style="text-align: right;">
          <button class="btn-admin-action" onclick="openPromoEditModal('${promo.code}')" title="Edit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-admin-action btn-delete" onclick="deletePromoCode('${promo.code}')" title="Hapus">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openPromoAddModal = function() {
  document.getElementById('promo-modal-title').textContent = 'Tambah Voucher Promo';
  document.getElementById('promo-crud-form').reset();
  document.getElementById('promo-old-code').value = '';
  document.getElementById('promo-code-input').disabled = false;
  openModal('promo-modal-overlay');
};

window.openPromoEditModal = function(code) {
  const promo = promoCodes.find(p => p.code === code);
  if (!promo) return;

  document.getElementById('promo-modal-title').textContent = 'Edit Voucher Promo';
  document.getElementById('promo-old-code').value = promo.code;
  document.getElementById('promo-code-input').value = promo.code;
  document.getElementById('promo-code-input').disabled = true; // prevent changing code directly as primary key
  document.getElementById('promo-discount-input').value = promo.discount;
  document.getElementById('promo-type-input').value = promo.type;
  document.getElementById('promo-minorder-input').value = promo.minOrder;
  document.getElementById('promo-active-input').value = promo.active.toString();

  openModal('promo-modal-overlay');
};

function handlePromoSubmit(e) {
  e.preventDefault();

  const oldCode = document.getElementById('promo-old-code').value;
  const code = document.getElementById('promo-code-input').value.toUpperCase().replace(/\s+/g, '');
  const discount = parseInt(document.getElementById('promo-discount-input').value) || 0;
  const type = document.getElementById('promo-type-input').value;
  const minOrder = parseInt(document.getElementById('promo-minorder-input').value) || 0;
  const active = document.getElementById('promo-active-input').value === 'true';

  if (!oldCode) {
    // Add mode - check duplicate
    if (promoCodes.some(p => p.code === code)) {
      showToast('Kode promo sudah ada!', 'error');
      return;
    }
    const newPromo = { code, discount, type, minOrder, active, usageCount: 0 };
    promoCodes.push(newPromo);
    showToast('Kode promo baru ditambahkan', 'success');
    createSystemNotification(`Kode promo baru ditambahkan: ${code}`, 'system', 'var(--success)');
  } else {
    // Edit mode
    const idx = promoCodes.findIndex(p => p.code === oldCode);
    if (idx !== -1) {
      promoCodes[idx].discount = discount;
      promoCodes[idx].type = type;
      promoCodes[idx].minOrder = minOrder;
      promoCodes[idx].active = active;
      showToast('Kode promo berhasil diedit', 'success');
      createSystemNotification(`Kode promo diedit: ${oldCode}`, 'system', 'var(--info)');
    }
  }

  localStorage.setItem('kuleather_promo_codes', JSON.stringify(promoCodes));
  closeModal('promo-modal-overlay');
  renderPromoTable();
}

window.deletePromoCode = function(code) {
  if (!confirm(`Apakah Anda yakin ingin menghapus kode promo "${code}"?`)) return;

  promoCodes = promoCodes.filter(p => p.code !== code);
  localStorage.setItem('kuleather_promo_codes', JSON.stringify(promoCodes));
  showToast(`Kode promo ${code} berhasil dihapus`, 'success');
  createSystemNotification(`Kode promo dihapus: ${code}`, 'system', 'var(--error)');
  renderPromoTable();
};

// ==========================================================================
// 4. FAQ CRUD SYSTEM
// ==========================================================================
let faqs = [];

function initFaqs() {
  faqs = JSON.parse(localStorage.getItem('kuleather_faq')) || [];
  renderFaqTable();

  const form = document.getElementById('faq-crud-form');
  if (form) {
    form.addEventListener('submit', handleFaqSubmit);
  }
}

function renderFaqTable() {
  const tbody = document.getElementById('faq-table-tbody');
  if (!tbody) return;

  if (faqs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">BELUM ADA DATA FAQ</td></tr>`;
    return;
  }

  // Sort by order ascending
  faqs.sort((a, b) => (a.order || 0) - (b.order || 0));

  tbody.innerHTML = faqs.map(faq => {
    const helpfulYes = (faq.helpful && faq.helpful.yes) || 0;
    const helpfulNo = (faq.helpful && faq.helpful.no) || 0;
    const truncatedAnswer = faq.answer.length > 60 ? faq.answer.substring(0, 57) + '...' : faq.answer;

    return `
      <tr>
        <td style="text-align: center; font-family: var(--font-mono);">${faq.order || 0}</td>
        <td><span class="status-pill status-pill-info" style="font-family:var(--font-mono);">${faq.category}</span></td>
        <td style="font-weight: 500;">${faq.question}</td>
        <td class="text-muted" style="font-size: 0.75rem;">${truncatedAnswer}</td>
        <td style="text-align: center; font-family: var(--font-mono); font-size: 0.7rem;">
          <span class="text-success">👍 ${helpfulYes}</span> / <span class="text-error">👎 ${helpfulNo}</span>
        </td>
        <td style="text-align: right;">
          <button class="btn-admin-action" onclick="openFaqEditModal('${faq.id}')" title="Edit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-admin-action btn-delete" onclick="deleteFaq('${faq.id}')" title="Hapus">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openFaqAddModal = function() {
  document.getElementById('faq-modal-title').textContent = 'Tambah Item FAQ';
  document.getElementById('faq-crud-form').reset();
  document.getElementById('faq-id-field').value = '';
  document.getElementById('faq-order').value = faqs.length + 1;
  openModal('faq-modal-overlay');
};

window.openFaqEditModal = function(id) {
  const faq = faqs.find(f => f.id === id);
  if (!faq) return;

  document.getElementById('faq-modal-title').textContent = 'Edit Item FAQ';
  document.getElementById('faq-id-field').value = faq.id;
  document.getElementById('faq-category').value = faq.category;
  document.getElementById('faq-order').value = faq.order || 1;
  document.getElementById('faq-question').value = faq.question;
  document.getElementById('faq-answer').value = faq.answer;

  openModal('faq-modal-overlay');
};

function handleFaqSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('faq-id-field').value;
  const category = document.getElementById('faq-category').value;
  const order = parseInt(document.getElementById('faq-order').value) || 1;
  const question = document.getElementById('faq-question').value.trim();
  const answer = document.getElementById('faq-answer').value.trim();

  if (!id) {
    // Add mode
    const newFaq = {
      id: generateRandomId('faq', 3).toLowerCase(),
      category,
      question,
      answer,
      helpful: { yes: 0, no: 0 },
      order
    };
    faqs.push(newFaq);
    showToast('FAQ baru berhasil ditambahkan', 'success');
  } else {
    // Edit mode
    const idx = faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      faqs[idx].category = category;
      faqs[idx].order = order;
      faqs[idx].question = question;
      faqs[idx].answer = answer;
      showToast('FAQ berhasil diperbarui', 'success');
    }
  }

  localStorage.setItem('kuleather_faq', JSON.stringify(faqs));
  closeModal('faq-modal-overlay');
  renderFaqTable();
}

window.deleteFaq = function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus item FAQ ini?')) return;

  faqs = faqs.filter(f => f.id !== id);
  localStorage.setItem('kuleather_faq', JSON.stringify(faqs));
  showToast('Item FAQ berhasil dihapus', 'success');
  renderFaqTable();
};

// ==========================================================================
// 5. TESTIMONIALS CRUD SYSTEM
// ==========================================================================
let testimonials = [];

function initTestimonials() {
  testimonials = JSON.parse(localStorage.getItem('kuleather_testimonials')) || [];
  renderTestimonialTable();

  const form = document.getElementById('testimonial-crud-form');
  if (form) {
    form.addEventListener('submit', handleTestimonialSubmit);
  }
}

function renderTestimonialTable() {
  const tbody = document.getElementById('testimonial-table-tbody');
  if (!tbody) return;

  if (testimonials.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">BELUM ADA TESTIMONI</td></tr>`;
    return;
  }

  tbody.innerHTML = testimonials.map(testi => {
    const starText = '⭐'.repeat(testi.rating || 5);
    const featuredClass = testi.featured ? 'status-pill-success' : 'status-pill-muted';
    const featuredText = testi.featured ? 'Featured' : 'Draft';
    const truncatedQuote = testi.quote.length > 50 ? testi.quote.substring(0, 47) + '...' : testi.quote;

    return `
      <tr>
        <td style="font-weight: 500;">${testi.name}</td>
        <td>${testi.role}</td>
        <td style="font-size: 0.75rem; white-space: nowrap;">${starText}</td>
        <td>
          <span class="status-pill ${featuredClass}" style="cursor: pointer;" onclick="toggleTestimonialFeatured('${testi.id}')">${featuredText}</span>
        </td>
        <td class="text-muted" style="font-size: 0.75rem; font-style: italic;">"${truncatedQuote}"</td>
        <td style="text-align: right;">
          <button class="btn-admin-action" onclick="openTestimonialEditModal('${testi.id}')" title="Edit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-admin-action btn-delete" onclick="deleteTestimonial('${testi.id}')" title="Hapus">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleTestimonialFeatured = function(id) {
  const idx = testimonials.findIndex(t => t.id === id);
  if (idx === -1) return;

  testimonials[idx].featured = !testimonials[idx].featured;
  localStorage.setItem('kuleather_testimonials', JSON.stringify(testimonials));
  showToast(`Status featured untuk ${testimonials[idx].name} diubah`, 'success');
  renderTestimonialTable();
};

window.openTestimonialAddModal = function() {
  document.getElementById('testimonial-modal-title').textContent = 'Tambah Testimoni';
  document.getElementById('testimonial-crud-form').reset();
  document.getElementById('testimonial-id-field').value = '';
  document.getElementById('testimonial-featured').value = 'true';
  openModal('testimonial-modal-overlay');
};

window.openTestimonialEditModal = function(id) {
  const testi = testimonials.find(t => t.id === id);
  if (!testi) return;

  document.getElementById('testimonial-modal-title').textContent = 'Edit Testimoni';
  document.getElementById('testimonial-id-field').value = testi.id;
  document.getElementById('testimonial-name').value = testi.name;
  document.getElementById('testimonial-role').value = testi.role;
  document.getElementById('testimonial-rating').value = testi.rating || 5;
  document.getElementById('testimonial-featured').value = testi.featured.toString();
  document.getElementById('testimonial-photo').value = testi.photo || '';
  document.getElementById('testimonial-quote').value = testi.quote;

  openModal('testimonial-modal-overlay');
};

function handleTestimonialSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('testimonial-id-field').value;
  const name = document.getElementById('testimonial-name').value.trim();
  const role = document.getElementById('testimonial-role').value.trim();
  const rating = parseInt(document.getElementById('testimonial-rating').value) || 5;
  const featured = document.getElementById('testimonial-featured').value === 'true';
  const photo = document.getElementById('testimonial-photo').value.trim() || 'photo-1494790108377-be9c29b29330';
  const quote = document.getElementById('testimonial-quote').value.trim();

  if (!id) {
    // Add mode
    const newTesti = {
      id: generateRandomId('t', 3).toLowerCase(),
      name,
      role,
      rating,
      featured,
      photo,
      quote
    };
    testimonials.push(newTesti);
    showToast('Testimoni berhasil ditambahkan', 'success');
  } else {
    // Edit mode
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx !== -1) {
      testimonials[idx].name = name;
      testimonials[idx].role = role;
      testimonials[idx].rating = rating;
      testimonials[idx].featured = featured;
      testimonials[idx].photo = photo;
      testimonials[idx].quote = quote;
      showToast('Testimoni berhasil diperbarui', 'success');
    }
  }

  localStorage.setItem('kuleather_testimonials', JSON.stringify(testimonials));
  closeModal('testimonial-modal-overlay');
  renderTestimonialTable();
}

window.deleteTestimonial = function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return;

  testimonials = testimonials.filter(t => t.id !== id);
  localStorage.setItem('kuleather_testimonials', JSON.stringify(testimonials));
  showToast('Testimoni berhasil dihapus', 'success');
  renderTestimonialTable();
};

// ==========================================================================
// 6. PARTNERS MANAGEMENT
// ==========================================================================
let partners = [];

function initPartners() {
  partners = JSON.parse(localStorage.getItem('kuleather_partners')) || [];
  renderPartners();
}

function renderPartners() {
  const container = document.getElementById('partner-list-container');
  if (!container) return;

  if (partners.length === 0) {
    container.innerHTML = `<div class="text-center py-sm text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">BELUM ADA PARTNER</div>`;
    return;
  }

  container.innerHTML = partners.map(partner => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-alt); padding:6px 12px; border-radius:var(--radius-sm); border: 1px solid var(--muted-light);">
      <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:bold;">${partner.name}</span>
      <button class="btn-admin-action btn-delete" style="padding:2px;" onclick="deletePartner('${partner.id}')" title="Hapus">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');
}

window.addPartnerLogo = function() {
  const input = document.getElementById('partner-name-input');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  // Check duplicate
  if (partners.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    showToast('Nama partner sudah terdaftar!', 'error');
    return;
  }

  const newPartner = {
    id: generateRandomId('p', 2).toLowerCase(),
    name: name
  };

  partners.push(newPartner);
  localStorage.setItem('kuleather_partners', JSON.stringify(partners));
  input.value = '';
  renderPartners();
  showToast(`Partner "${name}" ditambahkan`, 'success');
  createSystemNotification(`Partner baru ditambahkan: ${name}`, 'system', 'var(--success)');
};

// Add partner on enter press
const partnerInput = document.getElementById('partner-name-input');
if (partnerInput) {
  partnerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addPartnerLogo();
    }
  });
}

window.deletePartner = function(id) {
  const partner = partners.find(p => p.id === id);
  if (!partner) return;

  if (!confirm(`Hapus partner "${partner.name}" dari list marquee?`)) return;

  partners = partners.filter(p => p.id !== id);
  localStorage.setItem('kuleather_partners', JSON.stringify(partners));
  renderPartners();
  showToast(`Partner "${partner.name}" dihapus`, 'success');
};

// ==========================================================================
// 7. HOMEPAGE COUNTER STATS
// ==========================================================================
function initStats() {
  const form = document.getElementById('form-setting-stats');
  if (!form) return;

  const stats = JSON.parse(localStorage.getItem('kuleather_homepage_stats')) || {};

  // Prefill
  document.getElementById('stats-craftsmen-val').value = (stats.craftsmen && stats.craftsmen.value) || 0;
  document.getElementById('stats-craftsmen-suff').value = (stats.craftsmen && stats.craftsmen.suffix) || '';
  
  document.getElementById('stats-products-val').value = (stats.products && stats.products.value) || 0;
  document.getElementById('stats-products-suff').value = (stats.products && stats.products.suffix) || '';
  
  document.getElementById('stats-orders-val').value = (stats.orders && stats.orders.value) || 0;
  document.getElementById('stats-orders-suff').value = (stats.orders && stats.orders.suffix) || '';
  
  document.getElementById('stats-cities-val').value = (stats.cities && stats.cities.value) || 0;
  document.getElementById('stats-cities-suff').value = (stats.cities && stats.cities.suffix) || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedStats = {
      craftsmen: {
        value: parseInt(document.getElementById('stats-craftsmen-val').value) || 0,
        suffix: document.getElementById('stats-craftsmen-suff').value.trim(),
        label: 'Pengrajin Aktif'
      },
      products: {
        value: parseInt(document.getElementById('stats-products-val').value) || 0,
        suffix: document.getElementById('stats-products-suff').value.trim(),
        label: 'Pilihan Produk'
      },
      orders: {
        value: parseInt(document.getElementById('stats-orders-val').value) || 0,
        suffix: document.getElementById('stats-orders-suff').value.trim(),
        label: 'Pesanan Bulanan'
      },
      cities: {
        value: parseInt(document.getElementById('stats-cities-val').value) || 0,
        suffix: document.getElementById('stats-cities-suff').value.trim(),
        label: 'Kota Terjangkau'
      }
    };

    localStorage.setItem('kuleather_homepage_stats', JSON.stringify(updatedStats));
    showToast('Statistik homepage berhasil disimpan', 'success');
  });
}

// ==========================================================================
// 8. SHIPPING FLAT RATES
// ==========================================================================
function initShippingRates() {
  const form = document.getElementById('form-setting-shipping');
  if (!form) return;

  const settings = JSON.parse(localStorage.getItem('kuleather_site_settings')) || {};
  const rates = settings.shippingRates || {};

  // Prefill
  document.getElementById('shipping-jne-reg').value = rates['jne-reg'] || 0;
  document.getElementById('shipping-jne-yes').value = rates['jne-yes'] || 0;
  document.getElementById('shipping-sicepat').value = rates['sicepat'] || 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const jneReg = parseInt(document.getElementById('shipping-jne-reg').value) || 0;
    const jneYes = parseInt(document.getElementById('shipping-jne-yes').value) || 0;
    const sicepat = parseInt(document.getElementById('shipping-sicepat').value) || 0;

    const updatedSettings = {
      ...settings,
      shippingRates: {
        'jne-reg': jneReg,
        'jne-yes': jneYes,
        'sicepat': sicepat
      }
    };

    localStorage.setItem('kuleather_site_settings', JSON.stringify(updatedSettings));
    showToast('Tarif pengiriman berhasil diperbarui', 'success');
    createSystemNotification('Konfigurasi tarif pengiriman diperbarui', 'system', 'var(--info)');
  });
}

// ==========================================================================
// 9. NEWSLETTER SUBSCRIBERS
// ==========================================================================
let newsletterSubs = [];

function initNewsletter() {
  newsletterSubs = JSON.parse(localStorage.getItem('kuleather_newsletter_subs')) || [];
  renderNewsletterTable();
}

function renderNewsletterTable() {
  const tbody = document.getElementById('newsletter-table-tbody');
  if (!tbody) return;

  if (newsletterSubs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">BELUM ADA SUBSCRIBER</td></tr>`;
    return;
  }

  tbody.innerHTML = newsletterSubs.map((sub, index) => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight: 500;">${sub.email}</td>
      <td style="font-family: var(--font-mono);">${sub.date}</td>
      <td style="text-align: right;">
        <button class="btn-admin-action btn-delete" onclick="deleteSubscriber(${index})" title="Hapus">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

window.deleteSubscriber = function(index) {
  const sub = newsletterSubs[index];
  if (!sub) return;

  if (!confirm(`Hapus email "${sub.email}" dari pelanggan newsletter?`)) return;

  newsletterSubs.splice(index, 1);
  localStorage.setItem('kuleather_newsletter_subs', JSON.stringify(newsletterSubs));
  renderNewsletterTable();
  showToast('Pelanggan newsletter berhasil dihapus', 'success');
};

window.exportNewsletterCsv = function() {
  if (newsletterSubs.length === 0) {
    showToast('Tidak ada data subscriber untuk diexport', 'warning');
    return;
  }

  // Create CSV content
  const headers = ['Email', 'Tanggal Berlangganan'];
  const rows = newsletterSubs.map(sub => [sub.email, sub.date]);
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  
  showToast('File CSV berhasil diexport', 'success');
};
