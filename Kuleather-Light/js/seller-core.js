// Auto Redirect to Dark theme if preferred
(function() {
  if (localStorage.getItem('kuleather_admin_theme') === 'dark') {
    const currentPath = window.location.pathname;
    const sellerIndex = currentPath.indexOf('/Kuleather-Light/');
    if (sellerIndex !== -1) {
      const relativePath = currentPath.substring(sellerIndex + '/Kuleather-Light/'.length);
      window.location.replace(currentPath.substring(0, sellerIndex) + '/Kuleather-Dark/' + relativePath + window.location.search);
    }
  }
})();

// ==========================================================================
// 🏪 Kuleather Light — Core Seller Engine
// ==========================================================================


// 1. Route Guard for Seller Pages
function checkSellerAuth() {
  const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
  
  if (!activeUser || activeUser.role !== 'penjual') {
    alert('Akses Ditolak: Halaman ini hanya untuk Mitra Penjual. Mengalihkan ke halaman Login...');
    window.location.href = '../auth.html';
    return null;
  }
  
  if (activeUser.status !== 'active') {
    alert('Akun kemitraan Anda masih berstatus: ' + activeUser.status + '. Silakan hubungi admin untuk verifikasi.');
    window.location.href = '../auth.html';
    return null;
  }

  return activeUser;
}

const sellerUser = checkSellerAuth();

// Auto-upgrade user profile on page load to replace emojis with real images
(function upgradeSellerProfile() {
  if (sellerUser) {
    let needsUpdate = false;
    if (!sellerUser.shop) {
      sellerUser.shop = {};
      needsUpdate = true;
    }
    // If avatar is emoji or missing or still using old unsplash URL
    if (!sellerUser.shop.avatar || sellerUser.shop.avatar === '👨‍🎨' || sellerUser.shop.avatar.startsWith('http')) {
      sellerUser.shop.avatar = '../../assets/ims/artisan_pak_slamet.jpg';
      needsUpdate = true;
    }
    // If banner is default or missing or still using old unsplash URL
    if (!sellerUser.shop.banner || sellerUser.shop.banner === 'default' || sellerUser.shop.banner.startsWith('http')) {
      sellerUser.shop.banner = '../../assets/ims/workshop_warehouse_building.jpg';
      needsUpdate = true;
    }
    if (sellerUser.name === 'Toko Pak Slamet') {
      sellerUser.name = 'Slamet Widodo';
      needsUpdate = true;
    }
    if (sellerUser.initials === 'PS' || !sellerUser.initials) {
      sellerUser.initials = 'SW';
      needsUpdate = true;
    }

    if (needsUpdate) {
      localStorage.setItem('kuleather_active_user', JSON.stringify(sellerUser));
      const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
      const idx = users.findIndex(u => u.id === sellerUser.id);
      if (idx !== -1) {
        users[idx] = sellerUser;
        localStorage.setItem('kuleather_users', JSON.stringify(users));
      }
      // Instantly reload to apply changes
      window.location.reload();
    }
  }
})();

window.sellerUser = sellerUser;

window.sellerSwitchTheme = function() {
  const currentPath = window.location.pathname;
  const sellerIndex = currentPath.indexOf('/Kuleather-Light/');
  if (sellerIndex === -1) return;
  const relativePath = currentPath.substring(sellerIndex + '/Kuleather-Light/'.length);
  localStorage.setItem('kuleather_admin_theme', 'dark');
  const newPath = currentPath.substring(0, sellerIndex) + '/Kuleather-Dark/' + relativePath;
  window.location.href = newPath + window.location.search;
};

// Common UI Elements & Initializers
document.addEventListener('DOMContentLoaded', () => {
  if (!sellerUser) return;

  // Render theme toggle button in topbar (light mode active)
  const themeToggleContainer = document.getElementById('seller-theme-toggle');
  if (themeToggleContainer) {
    themeToggleContainer.innerHTML = `
      <button class="admin-topbar-btn admin-theme-toggle-btn" id="admin-theme-btn" onclick="sellerSwitchTheme()" aria-label="Ganti ke Mode Gelap" title="Ganti ke Mode Gelap" style="margin-right: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    `;
  }


  // Render Datetime in topbar
  const datetimeDisplay = document.getElementById('seller-datetime-display');
  if (datetimeDisplay) {
    function updateDateTime() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      datetimeDisplay.textContent = now.toLocaleDateString('id-ID', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // Sidebar Toggling
  const sidebar = document.querySelector('.admin-sidebar');
  const toggleBtn = document.querySelector('.admin-sidebar-toggle');
  
  if (sidebar && toggleBtn) {
    const isCollapsed = localStorage.getItem('kuleather_seller_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('kuleather_seller_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    });
  }

  const topbar = document.querySelector('.admin-topbar');
  const wrapper = document.querySelector('.admin-wrapper');

  if (topbar && !document.getElementById('admin-mobile-logo')) {
    const mobileLogo = document.createElement('a');
    mobileLogo.id = 'admin-mobile-logo';
    mobileLogo.className = 'admin-topbar-logo-mobile';
    mobileLogo.href = '../index.html';
    mobileLogo.style.textDecoration = 'none';
    mobileLogo.innerHTML = `
      <span style="font-family: var(--font-display); font-size: 1.05rem; letter-spacing: 0.12em; font-weight: 700; color: var(--text-primary);">KULEATHER</span>
      <span style="color: var(--accent); font-size: 0.55rem; font-family: var(--font-mono); letter-spacing: 0.2em; font-weight: 600; text-transform: uppercase; margin-left: 4px;">MITRA</span>
    `;
    topbar.insertBefore(mobileLogo, topbar.firstChild);
  }

  if (topbar && !document.getElementById('admin-mobile-menu-btn')) {
    const menuBtn = document.createElement('button');
    menuBtn.className = 'admin-mobile-menu-btn';
    menuBtn.id = 'admin-mobile-menu-btn';
    menuBtn.setAttribute('aria-label', 'Buka Menu');
    menuBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    
    const actionsContainer = topbar.querySelector('.admin-topbar-actions');
    if (actionsContainer) {
      actionsContainer.appendChild(menuBtn);
    } else {
      topbar.appendChild(menuBtn);
    }
  }

  if (wrapper && !document.getElementById('admin-sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';
    overlay.id = 'admin-sidebar-overlay';
    wrapper.appendChild(overlay);
  }

  // Mobile Sidebar Drawer Toggling
  const mobileMenuBtn = document.getElementById('admin-mobile-menu-btn');
  const sidebarOverlay = document.getElementById('admin-sidebar-overlay');

  if (mobileMenuBtn && sidebar && sidebarOverlay) {
    const openSidebar = () => {
      sidebar.classList.add('mobile-open');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      sidebar.classList.remove('mobile-open');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', openSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    // Close drawer on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeSidebar();
    });

    const adminNavLinks = document.querySelectorAll('.admin-nav-item');
    adminNavLinks.forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }

  // Highlight Active Link based on pathname
  const currentPath = window.location.pathname;
  const currentFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const navItems = document.querySelectorAll('.admin-nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (href === currentFilename || href.split('?')[0] === currentFilename)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Seed Database (Products and Orders) if missing or empty
  seedSellerDatabase();

  // Populate Seller Profile Details in UI
  populateSellerUI();
  
  // Render notification badges
  updateSellerNotificationBadges();
});

// Populate Profile
function populateSellerUI() {
  const shopName = sellerUser.shop ? sellerUser.shop.name : 'Toko Saya';
  const ownerName = sellerUser.name || 'Pemilik Toko';
  const initials = sellerUser.initials || 'TS';

  // Elements
  const shopLogoText = document.getElementById('seller-shop-logo-text');
  const sidebarAvatar = document.getElementById('seller-sidebar-avatar');
  const sidebarName = document.getElementById('seller-sidebar-name');
  const sidebarRole = document.getElementById('seller-sidebar-role');
  const topbarShopName = document.getElementById('seller-topbar-shop-name');

  if (shopLogoText) {
    shopLogoText.style.display = 'inline-flex';
    shopLogoText.style.flexDirection = 'column';
    shopLogoText.style.justifyContent = 'center';
    shopLogoText.style.gap = '4px';
    shopLogoText.style.lineHeight = '1';
    shopLogoText.style.paddingTop = '4px'; // Moves it down slightly for perfect vertical alignment
    shopLogoText.innerHTML = `
      <span style="font-size: 1.05rem; letter-spacing: 0.12em; font-weight: 700; color: var(--text-primary);">KULEATHER</span>
      <span style="color: var(--accent); font-size: 0.55rem; font-family: var(--font-mono); letter-spacing: 0.2em; font-weight: 600; text-transform: uppercase;">MITRA</span>
    `;
  }
  
  if (sidebarAvatar) {
    const avatarVal = sellerUser.shop ? sellerUser.shop.avatar : '🏪';
    if (avatarVal && (avatarVal.startsWith('http') || avatarVal.includes('/') || avatarVal.includes('.'))) {
      sidebarAvatar.innerHTML = `<img src="${avatarVal}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
      sidebarAvatar.style.backgroundColor = 'transparent';
      sidebarAvatar.style.border = '1px solid var(--accent)';
    } else {
      sidebarAvatar.textContent = initials;
      sidebarAvatar.style.backgroundColor = 'var(--accent)';
      sidebarAvatar.style.border = 'none';
      sidebarAvatar.innerHTML = initials; // Clear old images
    }
  }

  if (sidebarName) sidebarName.textContent = ownerName;
  if (sidebarRole) sidebarRole.textContent = shopName;
  if (topbarShopName) topbarShopName.textContent = shopName;
}

// Notification badges for seller dashboard
function updateSellerNotificationBadges() {
  const orders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
  // Count pending/new orders for this seller
  const sellerOrders = orders.filter(o => o.items.some(item => {
    const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    const prod = products.find(p => p.id === item.id);
    return prod && prod.sellerId === sellerUser.id;
  }));
  const pendingCount = sellerOrders.filter(o => o.status === 'Menunggu Pembayaran' || o.status === 'Diproses').length;

  const notifBadge = document.getElementById('seller-sidebar-orders-badge');
  if (notifBadge) {
    if (pendingCount > 0) {
      notifBadge.textContent = pendingCount;
      notifBadge.style.display = 'block';
    } else {
      notifBadge.style.display = 'none';
    }
  }
}

// Formatting Helper Currency
window.idr = function(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

// Toast Notification
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('seller-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'seller-toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast`;
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = 'var(--radius-md)';
  toast.style.fontFamily = 'var(--font-mono)';
  toast.style.fontSize = '0.75rem';
  toast.style.textTransform = 'uppercase';
  toast.style.letterSpacing = '0.05em';
  toast.style.boxShadow = 'var(--shadow-lg)';
  toast.style.transform = 'translateX(100px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all var(--transition-base)';
  
  let bg = 'var(--success-bg)';
  let border = 'var(--success)';
  let color = 'var(--success)';
  
  if (type === 'error') {
    bg = 'var(--error-bg)';
    border = 'var(--error)';
    color = 'var(--error)';
  } else if (type === 'info') {
    bg = 'var(--info-bg)';
    border = 'var(--info)';
    color = 'var(--info)';
  } else if (type === 'warning') {
    bg = 'var(--warning-bg)';
    border = 'var(--warning)';
    color = 'var(--warning)';
  }

  toast.style.backgroundColor = bg;
  toast.style.border = `1px solid ${border}`;
  toast.style.borderLeft = `4px solid ${border}`;
  toast.style.color = color;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.transform = 'translateX(100px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};

// Modal Operations
window.openModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

// Close Modal
window.closeModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Logout handler
window.handleSellerLogout = function() {
  if (confirm('Apakah Anda yakin ingin keluar dari panel mitra?')) {
    localStorage.removeItem('kuleather_active_user');
    window.location.href = '../auth.html';
  }
};

// Database Seeder
function seedSellerDatabase() {
  // 1. Seed Products if empty or empty array
  const storedProds = localStorage.getItem('kuleather_products');
  if (!storedProds || JSON.parse(storedProds).length === 0) {
    const defaultProducts = [
      { id: "tote-full-grain",  name: "Tas Tote Kulit Full Grain Magetan",  price: 1250000, rating: 4.9, reviewCount: 187, sold: 412,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",  origin: "Magetan",  badges: ["Best Seller"], photo: "photo-1548036328-c9fa89d128fa", inStock: true, stock: 25,  status: "active", sku: "KUL-BAG-001", variants: ["Cokelat Tua", "Hitam Matte", "Tan Natural"] },
      { id: "dompet-bifold",    name: "Dompet Bifold Kulit Sapi Premium",   price: 350000,  rating: 4.8, reviewCount: 342, sold: 891,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",  origin: "Magetan",  badges: ["New"],         photo: "photo-1614252369475-531eba835eb1", inStock: true, stock: 48,  status: "active", sku: "KUL-WAL-002", variants: ["Cokelat Tua", "Hitam Matte", "Tan Natural"] },
      { id: "jaket-domba",      name: "Jaket Kulit Domba Classic Rider",    price: 2800000, rating: 4.9, reviewCount: 98,  sold: 134,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Domba", origin: "Magetan",  badges: ["Best Seller"], photo: "photo-1551028719-00167b16eac5",   inStock: true, stock: 12,  status: "active", sku: "KUL-JKT-003", variants: ["Hitam Matte", "Cokelat Tua"] },
      { id: "sabuk-pullup",     name: "Sabuk Pull-Up Leather Artisan",      price: 275000,  rating: 4.7, reviewCount: 214, sold: 537,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",  origin: "Magetan",  badges: [],              photo: "photo-1553062407-98eeb64c6a62",   inStock: true, stock: 30,  status: "active", sku: "KUL-BEL-004", variants: ["Tan Natural", "Cokelat Tua", "Hitam Matte"] },
      { id: "sepatu-loafer",    name: "Sepatu Loafer Kulit Full Grain",     price: 1650000, rating: 4.8, reviewCount: 156, sold: 278,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",  origin: "Magetan",  badges: ["Best Seller"], photo: "photo-1542291026-7eec264c27ff",   inStock: true, stock: 15,  status: "active", sku: "KUL-SHO-005", variants: ["Cokelat Tua", "Tan Natural"] },
      { id: "kulit-sapi-fg",    name: "Kulit Sapi Full Grain (per m²)",    price: 380000,  rating: 4.8, reviewCount: 412, sold: 1204, sellerId: "u02", seller: "Toko Pak Slamet", cat: "Bahan Baku",  material: "Kulit Sapi",  origin: "Sidoarjo",  badges: [],              photo: "../assets/ims/leather_sheet_tan_smooth.jpg", inStock: true, stock: 150, status: "active", sku: "KUL-MAT-006", variants: ["Natural Tan", "Dark Brown", "Black"] },
      { id: "card-holder",      name: "Card Holder Kulit Slim Minimalis",   price: 185000,  rating: 4.6, reviewCount: 189, sold: 623,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Aksesori",    material: "Kulit Sapi",  origin: "Magetan",  badges: ["Best Seller"], photo: "photo-1584917865442-de89df76afd3", inStock: true, stock: 4,   status: "active", sku: "KUL-CRD-007", variants: ["Tan Natural", "Cokelat Tua", "Hitam Matte"] },
      { id: "tas-selempang",    name: "Tas Selempang Kulit Crossbody Pria", price: 875000,  rating: 4.7, reviewCount: 134, sold: 267,  sellerId: "u02", seller: "Toko Pak Slamet", cat: "Barang Jadi", material: "Kulit Sapi",  origin: "Magetan",  badges: [],              photo: "photo-1548036328-c9fa89d128fa",   inStock: true, stock: 18,  status: "active", sku: "KUL-BAG-008", variants: ["Hitam Matte", "Cokelat Tua"] }
    ];
    localStorage.setItem('kuleather_products', JSON.stringify(defaultProducts));
  }

  // 2. Seed Orders if empty or empty array
  const storedOrders = localStorage.getItem('kuleather_profile_orders');
  if (!storedOrders || JSON.parse(storedOrders).length === 0) {
    const defaultOrders = [
      {
        id: "ORD-20260312-005",
        buyer: "Budi Santoso",
        buyerEmail: "budi.santoso@email.com",
        buyerPhone: "081234567890",
        buyerAddress: "Jl. Sawo No. 12, Kel. Selosari, Kec. Magetan, Kabupaten Magetan, Jawa Timur, 63311",
        date: "12 Mar 2026",
        paymentMethod: "Transfer Bank",
        shippingCourier: "jne-reg",
        shippingCost: 18000,
        status: "Selesai",
        items: [{ id: "card-holder", name: "Card Holder Kulit Slim Minimalis", price: 185000, qty: 1, variant: "Tan Natural", photo: "photo-1584917865442-de89df76afd3" }]
      },
      {
        id: "ORD-20260405-021",
        buyer: "Siti Aminah",
        buyerEmail: "siti.aminah@email.com",
        buyerPhone: "082345678901",
        buyerAddress: "Jl. Melati No. 5, Jakarta Selatan, DKI Jakarta, 12430",
        date: "05 Apr 2026",
        paymentMethod: "DANA",
        shippingCourier: "sicepat",
        shippingCost: 12000,
        status: "Selesai",
        items: [{ id: "sabuk-pullup", name: "Sabuk Pull-Up Leather Artisan", price: 275000, qty: 2, variant: "Cokelat Tua", photo: "photo-1553062407-98eeb64c6a62" }]
      },
      {
        id: "ORD-20260510-044",
        buyer: "Andi Wijaya",
        buyerEmail: "andi.wijaya@email.com",
        buyerPhone: "083456789012",
        buyerAddress: "Jl. Gajah Mada No. 88, Pontianak, Kalimantan Barat, 78121",
        date: "10 Mei 2026",
        paymentMethod: "VA BCA",
        shippingCourier: "jne-reg",
        shippingCost: 18000,
        status: "Dikirim",
        items: [{ id: "dompet-bifold", name: "Dompet Bifold Kulit Sapi Premium", price: 350000, qty: 1, variant: "Hitam Matte", photo: "photo-1614252369475-531eba835eb1" }]
      },
      {
        id: "ORD-20260601-098",
        buyer: "Rina Putri",
        buyerEmail: "rina.putri@email.com",
        buyerPhone: "084567890123",
        buyerAddress: "Jl. Pahlawan No. 22, Surabaya, Jawa Timur, 60175",
        date: "15 Jun 2026",
        paymentMethod: "QRIS",
        shippingCourier: "jne-yes",
        shippingCost: 25000,
        status: "Selesai",
        items: [{ id: "tote-full-grain", name: "Tas Tote Kulit Full Grain Magetan", price: 1250000, qty: 1, variant: "Cokelat Tua", photo: "photo-1548036328-c9fa89d128fa" }]
      },
      {
        id: "ORD-20260618-105",
        buyer: "Budi Santoso",
        buyerEmail: "budi.santoso@email.com",
        buyerPhone: "081234567890",
        buyerAddress: "Jl. Sawo No. 12, Kel. Selosari, Kec. Magetan, Kabupaten Magetan, Jawa Timur, 63311",
        date: "24 Jun 2026",
        paymentMethod: "QRIS",
        shippingCourier: "sicepat",
        shippingCost: 12000,
        status: "Diproses",
        items: [{ id: "dompet-bifold", name: "Dompet Bifold Kulit Sapi Premium", price: 350000, qty: 2, variant: "Hitam Matte", photo: "photo-1614252369475-531eba835eb1" }]
      },
      {
        id: "ORD-20260620-112",
        buyer: "Hendra Kusuma",
        buyerEmail: "hendra.kusuma@email.com",
        buyerPhone: "085678901234",
        buyerAddress: "Jl. Diponegoro No. 47, Bandung, Jawa Barat, 40115",
        date: "25 Jun 2026",
        paymentMethod: "GoPay",
        shippingCourier: "jne-yes",
        shippingCost: 25000,
        status: "Menunggu Pembayaran",
        items: [{ id: "sabuk-pullup", name: "Sabuk Pull-Up Leather Artisan", price: 275000, qty: 1, variant: "Tan Natural", photo: "photo-1553062407-98eeb64c6a62" }]
      }
    ];
    localStorage.setItem('kuleather_profile_orders', JSON.stringify(defaultOrders));
  }

  // 3. Seed Seller Services if empty or empty array
  const storedServices = localStorage.getItem('kuleather_seller_services');
  if (!storedServices || JSON.parse(storedServices).length === 0) {
    const defaultServices = [
      {
        id: "SVC-001",
        name: "Custom Jaket Kulit Rider",
        description: "Pembuatan jaket kulit custom sesuai ukuran dan desain pelanggan. Menggunakan bahan kulit domba premium pilihan.",
        price: 2200000,
        priceUnit: "per item",
        estimatedDays: 14,
        category: "Custom Order",
        status: "active",
        rating: 4.9,
        reviewCount: 23,
        orderCount: 47
      },
      {
        id: "SVC-002",
        name: "Reparasi & Restorasi Tas Kulit",
        description: "Layanan perbaikan tas kulit: jahitan lepas, ritsleting rusak, pembersihan noda, re-dyeing warna. Garansi 3 bulan.",
        price: 150000,
        priceUnit: "mulai dari",
        estimatedDays: 5,
        category: "Reparasi",
        status: "active",
        rating: 4.8,
        reviewCount: 156,
        orderCount: 312
      },
      {
        id: "SVC-003",
        name: "Deep Cleaning & Perawatan Kulit",
        description: "Pembersihan mendalam, conditioning, dan proteksi untuk tas, jaket, sepatu kulit. Termasuk waterproofing spray.",
        price: 75000,
        priceUnit: "per item",
        estimatedDays: 3,
        category: "Perawatan",
        status: "active",
        rating: 4.7,
        reviewCount: 89,
        orderCount: 204
      }
    ];
    localStorage.setItem('kuleather_seller_services', JSON.stringify(defaultServices));
  }

  // 4. Seed Service Orders (REQUEST JASA) if empty or empty array — CRITICAL for REQUEST JASA tab
  const storedServiceOrders = localStorage.getItem('kuleather_service_orders');
  if (!storedServiceOrders || JSON.parse(storedServiceOrders).length === 0) {
    const defaultServiceOrders = [
      {
        id: "SREQ-202605-001",
        serviceId: "SVC-001",
        serviceName: "Custom Jaket Kulit Rider",
        sellerId: "u02",
        sellerName: "Toko Pak Slamet",
        buyerId: "u01",
        buyerName: "Budi Santoso",
        buyerEmail: "budi.santoso@email.com",
        buyerPhone: "081234567890",
        date: "10 Mei 2026",
        status: "DIKERJAKAN",
        request: {
          description: "Halo Pak Slamet, saya mau pesan jaket kulit rider ukuran L, warna cokelat tua dengan ritsleting silver. Bahan kulit domba kalau bisa. Untuk hadiah ulang tahun suami saya.",
          budget: 2200000,
          deadline: "25 Jun 2026",
          references: []
        },
        offer: {
          finalPrice: 2200000,
          estimatedDays: 14,
          estimatedCompletion: "24 Jun 2026",
          notes: "Bisa dikerjakan. Bahan kulit domba pilihan tersedia. Pengiriman via JNE YES agar sampai tepat waktu."
        },
        revisions: { used: 1, max: 3 },
        progress: 65,
        chat: [
          { sender: "buyer", name: "Budi Santoso", time: "10 Mei 2026, 09:15", message: "Halo Pak Slamet, saya mau pesan jaket kulit rider ukuran L, warna cokelat tua dengan ritsleting silver. Bahan kulit domba kalau bisa.", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "10 Mei 2026, 10:30", message: "Halo Bu Budi! Siap, saya punya stok kulit domba pilihan. Untuk ukuran L estimasi 14 hari kerja. Harga Rp2.200.000 sudah termasuk ongkir. Oke?", isRead: true },
          { sender: "buyer", name: "Budi Santoso", time: "10 Mei 2026, 10:45", message: "Oke setuju! Untuk pembayaran bagaimana?", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "10 Mei 2026, 11:00", message: "Bisa transfer BCA 1234567890 a/n Slamet Widodo. DP 50% dulu Rp1.100.000, sisanya lunas setelah selesai.", isRead: true },
          { sender: "buyer", name: "Budi Santoso", time: "10 Mei 2026, 14:22", message: "Sudah transfer DP ya Pak. Mohon diproses 🙏", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "11 Mei 2026, 08:00", message: "DP sudah masuk, terima kasih! Saya mulai proses hari ini. Nanti saya update progress-nya.", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "18 Mei 2026, 16:30", message: "Update: pola sudah selesai, masuk tahap pemotongan bahan. Progress sekitar 40%.", isRead: true },
          { sender: "buyer", name: "Budi Santoso", time: "18 Mei 2026, 17:00", message: "Wah mantap! Ditunggu pak 😊", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "22 Mei 2026, 09:00", message: "Update: jahitan bagian badan sudah selesai, sekarang masuk pasang ritsleting dan finishing. Progress 65%.", isRead: true }
        ]
      },
      {
        id: "SREQ-202606-007",
        serviceId: "SVC-002",
        serviceName: "Reparasi & Restorasi Tas Kulit",
        sellerId: "u02",
        sellerName: "Toko Pak Slamet",
        buyerId: "u03",
        buyerName: "Rina Putri",
        buyerEmail: "rina.putri@email.com",
        buyerPhone: "084567890123",
        date: "23 Jun 2026",
        status: "REQUEST_SENT",
        request: {
          description: "Tas branded saya jahitan di bagian pegangan lepas dan ada sobekan kecil di sudut kiri. Bisa diperbaiki? Mau tahu estimasi biaya dulu.",
          budget: 200000,
          deadline: "05 Jul 2026",
          references: []
        },
        offer: null,
        revisions: { used: 0, max: 3 },
        progress: 0,
        chat: [
          { sender: "buyer", name: "Rina Putri", time: "23 Jun 2026, 14:30", message: "Halo, tas saya jahitan di pegangan lepas dan ada sobekan kecil di sudut. Bisa diperbaiki? Budget saya sekitar 150-200rb.", isRead: false },
          { sender: "buyer", name: "Rina Putri", time: "23 Jun 2026, 14:31", message: "Tas-nya merk lokal tapi bahan kulit asli. Kondisi sudah 3 tahun pemakaian.", isRead: false }
        ]
      },
      {
        id: "SREQ-202605-003",
        serviceId: "SVC-001",
        serviceName: "Custom Jaket Kulit Rider",
        sellerId: "u02",
        sellerName: "Toko Pak Slamet",
        buyerId: "u04",
        buyerName: "Andi Wijaya",
        buyerEmail: "andi.wijaya@email.com",
        buyerPhone: "083456789012",
        date: "02 Mei 2026",
        status: "PENAWARAN_DIKIRIM",
        request: {
          description: "Minta custom dompet panjang (long wallet) kulit sapi full grain, warna tan natural, ada slot kartu minimal 8 buah. Ada tambahan zipper pocket kalau bisa.",
          budget: 650000,
          deadline: "30 Mei 2026",
          references: []
        },
        offer: {
          finalPrice: 620000,
          estimatedDays: 10,
          estimatedCompletion: "12 Mei 2026",
          notes: "Bisa saya buat dengan spesifikasi tersebut. Full grain Tan Natural tersedia. 8 card slot + 1 zipper pocket. Harga Rp620.000 sudah all-in termasuk ongkir."
        },
        revisions: { used: 0, max: 3 },
        progress: 10,
        chat: [
          { sender: "buyer", name: "Andi Wijaya", time: "02 Mei 2026, 10:00", message: "Minta custom dompet panjang kulit sapi full grain, warna tan natural, slot kartu 8+, ada zipper pocket. Budget 650rb, bisa?", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "02 Mei 2026, 13:15", message: "Bisa Pak! Saya kirimkan penawaran detailnya ya.", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "02 Mei 2026, 13:20", message: "Penawaran saya: Full grain Tan Natural, 8 card slot + 1 zipper pocket. Harga Rp620.000 all-in ongkir. Estimasi 10 hari kerja. Silakan dipertimbangkan 🙏", isRead: true },
          { sender: "buyer", name: "Andi Wijaya", time: "03 Mei 2026, 09:00", message: "Oke saya pikir-pikir dulu pak, nanti saya kabari.", isRead: true }
        ]
      },
      {
        id: "SREQ-202604-003",
        serviceId: "SVC-003",
        serviceName: "Deep Cleaning & Perawatan Kulit",
        sellerId: "u02",
        sellerName: "Toko Pak Slamet",
        buyerId: "u01",
        buyerName: "Budi Santoso",
        buyerEmail: "budi.santoso@email.com",
        buyerPhone: "081234567890",
        date: "15 Apr 2026",
        status: "SELESAI",
        request: {
          description: "Jaket kulit saya butuh deep cleaning, ada noda kopi di bagian depan. Juga tolong kasih conditioning biar ga kering.",
          budget: 100000,
          deadline: "25 Apr 2026",
          references: []
        },
        offer: {
          finalPrice: 75000,
          estimatedDays: 3,
          estimatedCompletion: "18 Apr 2026",
          notes: "Siap! Deep cleaning + conditioning + waterproofing spray. Rp75.000. Silakan kirim jaketnya ke alamat toko."
        },
        revisions: { used: 0, max: 3 },
        progress: 100,
        completedDate: "18 Apr 2026",
        review: {
          rating: 5,
          comment: "Keren banget hasilnya! Noda kopi hilang total, jaket jadi kayak baru lagi. Recommended!",
          date: "19 Apr 2026"
        },
        chat: [
          { sender: "buyer", name: "Budi Santoso", time: "15 Apr 2026, 08:00", message: "Pak, jaket kulit saya ada noda kopi dan mulai kering. Bisa deep cleaning sekalian conditioning?", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "15 Apr 2026, 09:30", message: "Bisa! Rp75.000 all-in untuk deep cleaning + conditioning + waterproofing. Silakan kirim ke alamat toko.", isRead: true },
          { sender: "buyer", name: "Budi Santoso", time: "15 Apr 2026, 10:00", message: "Oke pak, saya kirim siang ini via grab.", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "16 Apr 2026, 14:00", message: "Jaket sudah masuk, saya proses hari ini.", isRead: true },
          { sender: "seller", name: "Toko Pak Slamet", time: "18 Apr 2026, 11:00", message: "Sudah selesai! Noda kopi hilang bersih, kondisi kulit sudah jauh lebih lembap. Saya kirim kembali via grab ya.", isRead: true },
          { sender: "buyer", name: "Budi Santoso", time: "18 Apr 2026, 16:30", message: "Wah bagus banget pak!! Makasih banyak ya, bakal balik lagi kalau ada yang perlu dirawat 🙏⭐⭐⭐⭐⭐", isRead: true }
        ]
      }
    ];
    localStorage.setItem('kuleather_service_orders', JSON.stringify(defaultServiceOrders));
  }

  // 5. Seed withdrawals if empty or empty array
  const wdKey = `kuleather_seller_withdrawals_u02`;
  const storedWds = localStorage.getItem(wdKey);
  if (!storedWds || JSON.parse(storedWds).length === 0) {
    const defaultWithdrawals = [
      { id: "WD-938210", date: "18 Jun 2026", bank: "BCA", accountNumber: "123-456-7890", accountName: "Slamet Widodo", amount: 500000, status: "Selesai" }
    ];
    localStorage.setItem(wdKey, JSON.stringify(defaultWithdrawals));
  }
}



// Mobile sidebar layout is successfully initialized and handled in main DOMContentLoaded block

