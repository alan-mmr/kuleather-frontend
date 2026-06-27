// Auto Redirect to Light theme if preferred
(function() {
  if (localStorage.getItem('kuleather_admin_theme') === 'light') {
    const currentPath = window.location.pathname;
    const adminIndex = currentPath.indexOf('/Kuleather-Dark/');
    if (adminIndex !== -1) {
      const relativePath = currentPath.substring(adminIndex + '/Kuleather-Dark/'.length);
      window.location.replace(currentPath.substring(0, adminIndex) + '/Kuleather-Light/' + relativePath + window.location.search);
    }
  }
})();

// ==========================================================================
// 🌿 Kuleather Dark — Core Admin Engine
// ==========================================================================


// 1. Data Seeding & Initialization
const DEFAULT_PRODUCTS = [
  { id: "tote-full-grain", name: "Tas Tote Kulit Full Grain Magetan", price: 1250000, rating: 4.9, reviewCount: 187, sold: 412, cat: "Barang Jadi", material: "Kulit Sapi", origin: "Magetan", badges: ["Best Seller"], photo: "photo-1548036328-c9fa89d128fa", inStock: true, sku: "KUL-TAS-001", stock: 45, seller: "Toko Pak Slamet", status: "active", description: "Tas tote bag buatan pengrajin Magetan menggunakan kulit sapi full grain asli pilihan. Tahan lama dan memiliki patina indah seiring pemakaian.", variants: ["Cokelat Tua", "Hitam"], createdAt: "2024-01-15" },
  { id: "dompet-bifold", name: "Dompet Bifold Kulit Sapi Premium", price: 350000, rating: 4.8, reviewCount: 342, sold: 891, cat: "Barang Jadi", material: "Kulit Sapi", origin: "Magetan", badges: ["Best Seller"], photo: "photo-1614252369475-531eba835eb1", inStock: true, sku: "KUL-WAL-002", stock: 120, seller: "Toko Pak Slamet", status: "active", description: "Dompet lipat dua klasik dengan jahitan tangan presisi. Dilengkapi dengan 6 slot kartu dan kompartemen uang kertas berlapisan kain suede halus.", variants: ["Cognac", "Hitam", "Dark Brown"], createdAt: "2024-02-10" },
  { id: "jaket-domba", name: "Jaket Kulit Domba Classic Rider", price: 2800000, rating: 4.9, reviewCount: 98, sold: 134, cat: "Barang Jadi", material: "Kulit Domba", origin: "Magetan", badges: ["Best Seller"], photo: "photo-1551028719-00167b16eac5", inStock: true, sku: "KUL-JKT-003", stock: 15, seller: "Garut Leather Wear", status: "active", description: "Jaket kulit domba super supple kelas ekspor dengan risleting YKK metalik dan furing katun yang sejuk. Sangat nyaman dipakai berkendara.", variants: ["Hitam (L)", "Hitam (XL)"], createdAt: "2024-01-20" },
  { id: "sabuk-pullup", name: "Sabuk Pull-Up Leather Artisan", price: 275000, rating: 4.7, reviewCount: 214, sold: 537, cat: "Aksesori", material: "Kulit Sapi", origin: "Magetan", badges: [], photo: "photo-1553062407-98eeb64c6a62", inStock: true, sku: "KUL-BEL-004", stock: 85, seller: "Mitra Magetan", status: "active", description: "Sabuk pria kasual dengan bahan pull-up leather tebal 4mm yang lentur dan kokoh. Buckle berbahan brass solid anti karat.", variants: ["Tan", "Cokelat", "Hitam"], createdAt: "2024-03-05" },
  { id: "sepatu-loafer", name: "Sepatu Loafer Kulit Full Grain", price: 1650000, rating: 4.8, reviewCount: 156, sold: 278, cat: "Barang Jadi", material: "Kulit Sapi", origin: "Magetan", badges: ["Best Seller"], photo: "photo-1542291026-7eec264c27ff", inStock: true, sku: "KUL-SHO-005", stock: 22, seller: "Raja Sepatu Magetan", status: "active", description: "Sepatu formal kasual model slip-on loafer. Outsole karet tebal anti slip dan insole dilapisi latex foam empuk menyerap keringat.", variants: ["Hitam (41)", "Hitam (42)", "Tan (42)"], createdAt: "2024-02-15" },
  { id: "kulit-sapi-fg", name: "Kulit Sapi Full Grain (per m²)", price: 380000, rating: 4.8, reviewCount: 412, sold: 1204, cat: "Bahan Baku", material: "Kulit Sapi", origin: "Sidoarjo", badges: [], photo: "../assets/ims/leather_sheet_tan_smooth.jpg", inStock: true, sku: "MAT-COW-001", stock: 500, seller: "Penyamakan Jaya", status: "active", description: "Lembaran kulit sapi asli jenis full grain ketebalan 1.8 - 2.0mm. Cocok untuk bahan tas mewah, dompet tebal, dan aksesori premium.", variants: ["Tan", "Cokelat Tua", "Hitam"], createdAt: "2024-01-02" },
  { id: "card-holder", name: "Card Holder Kulit Slim Minimalis", price: 185000, rating: 4.6, reviewCount: 189, sold: 623, cat: "Aksesori", material: "Kulit Sapi", origin: "Magetan", badges: ["Best Seller"], photo: "photo-1584917865442-de89df76afd3", inStock: true, sku: "KUL-CRD-006", stock: 150, seller: "Toko Pak Slamet", status: "active", description: "Dompet kartu ultra-slim berkapasitas 6 slot kartu dan 1 slot tengah untuk uang tunai. Ringan dimasukkan ke saku depan celana.", variants: ["Navy", "Cokelat", "Hitam"], createdAt: "2024-03-12" },
  { id: "tas-selempang", name: "Tas Selempang Kulit Crossbody Pria", price: 875000, rating: 4.7, reviewCount: 134, sold: 267, cat: "Barang Jadi", material: "Kulit Sapi", origin: "Magetan", badges: [], photo: "photo-1548036328-c9fa89d128fa", inStock: true, sku: "KUL-TAS-007", stock: 18, seller: "Mitra Magetan", status: "active", description: "Tas selempang kulit model messenger ukuran kompak untuk tablet 10 inch. Menggunakan aksen logam brass antik dan tali kanvas lapis kulit.", variants: ["Cokelat", "Hitam"], createdAt: "2024-02-28" },
  { id: "sarung-tangan", name: "Sarung Tangan Kulit Berkendara", price: 195000, rating: 4.6, reviewCount: 211, sold: 489, cat: "Aksesori", material: "Kulit Domba", origin: "Garut", badges: ["Best Seller"], photo: "photo-1516478177764-9fe5bd7e9717", inStock: true, sku: "KUL-GLV-008", stock: 65, seller: "Garut Leather Wear", status: "active", description: "Sarung tangan motor dari kulit domba yang super lembut dan berpori mikro agar tangan tidak berkeringat. Mendukung layar sentuh ponsel.", variants: ["Hitam (All Size)", "Cokelat (All Size)"], createdAt: "2024-03-20" },
  { id: "briefcase", name: "Tas Briefcase Kulit Executive", price: 2150000, rating: 4.9, reviewCount: 67, sold: 89, cat: "Barang Jadi", material: "Kulit Sapi", origin: "Yogyakarta", badges: ["Best Seller"], photo: "photo-1548036328-c9fa89d128fa", inStock: true, sku: "KUL-TAS-009", stock: 8, seller: "Artisan Jogja", status: "active", description: "Tas kerja eksekutif berukuran besar muat laptop 15.6 inch. Dilengkapi sekat pelindung busa tebal dan tali bahu lepas-pasang.", variants: ["Hitam", "Dark Brown"], createdAt: "2024-02-05" }
];

const DEFAULT_ARTICLES = [
  { id: "vegetable-tanning", cat: "Teknik", title: "Seni Penyamakan Vegetable: Tradisi yang Bertahan Satu Abad", excerpt: "Di sudut tenang Magetan, teknik penyamakan vegetable masih dipraktikkan dengan penuh dedikasi. Mengapa metode yang membutuhkan 60 hari ini justru semakin diminati pasar global?", date: "22 Mei 2026", readTime: "8 menit", views: "4,2K", viewsCount: 4200, author: { name: "Ahmad Rifai", role: "Editor Senior", photo: "photo-1472099645785-5658abf4ff4e" }, photo: "photo-1565193566173-7a0ee3dbe261", tags: ["Teknik", "Vegetable Tanning", "Tradisi", "Magetan"], status: "published", content: "Vegetable tanning (penyamakan nabati) adalah salah satu metode penyamakan kulit tertua di dunia yang mengandalkan zat tanin alami dari tumbuh-tumbuhan, seperti kulit pohon oak, mimosa, atau kastanya. Proses ini sepenuhnya bebas bahan kimia kromium berbahaya.\n\nDi Magetan, beberapa pabrik penyamakan tradisional masih melestarikan teknik ini. Kulit mentah direndam di dalam bak penyamakan dengan konsentrasi tanin yang ditingkatkan secara bertahap selama berminggu-minggu. Seluruh proses memakan waktu 1 hingga 2 bulan.\n\nHasil akhirnya adalah kulit yang berstruktur padat, kokoh, beraroma kayu khas alami, serta memiliki kemampuan luar biasa untuk membentuk 'patina'—perubahan warna menjadi lebih matang dan mengilap seiring pemakaian dan terkena sinar matahari. Keunikan inilah yang membuat pasar mewah Eropa dan Amerika sangat memburu kulit vegetable tanning asal Indonesia.", createdAt: "2026-05-22" },
  { id: "panduan-full-grain", cat: "Panduan Kulit", title: "Panduan Memilih Kulit Full Grain untuk Pemula", excerpt: "Full grain, top grain, genuine leather — istilah-istilah ini membingungkan banyak pembeli. Panduan lengkap ini membantu Anda membuat keputusan yang tepat.", date: "18 Mei 2026", readTime: "6 menit", views: "3,8K", viewsCount: 3800, author: { name: "Dewi Kartika", role: "Jurnalis Mode", photo: "photo-1494790108377-be9c29b29330" }, photo: "photo-1464699908537-0954e50791ee", tags: ["Full Grain", "Panduan", "Pemula", "Kualitas"], status: "published", content: "Istilah kualitas kulit di pasaran seringkali membingungkan. Secara umum, ada tiga tingkatan kualitas utama kulit sapi asli:\n\n1. Full Grain Leather: Merupakan lapisan kulit teratas yang paling luar. Tidak diamplas atau dipoles untuk menghilangkan tekstur pori alami atau bekas luka gigitan serangga. Ini menjadikannya sangat kuat, tahan lama, dan mampu memunculkan patina terbaik.\n2. Top Grain Leather: Lapisan teratas yang telah diamplas tipis untuk membuang cacat permukaan, lalu dicap motif kulit buatan. Lebih lentur tetapi sedikit berkurang kekuatannya dibanding full grain.\n3. Genuine/Split Leather: Lapisan bawah kulit setelah dipisah dari lapisan atas. Seratnya rapuh, biasanya dilapisi polyurethane agar terlihat mirip kulit luar. Harganya murah namun mudah retak dalam setahun.\n\nBagi pemula, membeli produk Full Grain adalah investasi terbaik karena keawetannya yang bisa melampaui 10 tahun jika dirawat dengan benar.", createdAt: "2026-05-18" },
  { id: "pak-slamet", cat: "Profil Pengrajin", title: "Pak Slamet: 40 Tahun Mengukir Keindahan dari Kulit", excerpt: "Empat dekade di balik meja kerja, ribuan produk yang telah menemani perjalanan hidup pemakainya. Kisah seorang maestro yang memilih tetap berkarya di kampung halaman.", date: "15 Mei 2026", readTime: "10 menit", views: "6,1K", viewsCount: 6100, author: { name: "Baskoro Aji", role: "Penulis & Fotografer", photo: "photo-1507003211169-0a1dd7228f2d" }, photo: "photo-1507003211169-0a1dd7228f2d", tags: ["Profil", "Pengrajin", "Magetan", "Inspirasi"], status: "published", content: "Slamet (63) adalah saksi hidup kejayaan industri kulit Jalan Selosari, Magetan. Dengan jemari yang dihiasi bekas luka jarum jahit kulit, ia masih telaten memotong lembaran kulit pull-up cokelat di workshop sederhananya.\n\nIa bercerita, minatnya dimulai sejak usia remaja saat membantu pamannya menjahit sepatu bot tentara. Baginya, kulit bukanlah material mati, melainkan kanvas yang terus bernafas. Setiap garis jahitan tangan dikerjakannya menggunakan benang lilin tebal dengan kerapatan konsisten.\n\n'Mesin jahit memang cepat, tapi tidak punya jiwa. Jahitan tangan saddle stitch tidak akan lepas meskipun salah satu benangnya terputus,' ujarnya bangga. Kini di usianya yang senja, ia menyambut hangat era digital Kuleather yang membantu memasarkan karyanya ke luar daerah tanpa melalui tengkulak.", createdAt: "2026-05-15" }
];

const DEFAULT_USERS = [
  { id: "u01", name: "Budi Santoso", email: "budi.santoso@email.com", phone: "081234567890", role: "pembeli", joined: "10 Mar 2026", status: "active", orders: 3, initials: "BS", address: "Jl. Sawo No. 12, Kel. Selosari, Kec. Magetan, Kabupaten Magetan, Jawa Timur, 63311", password: "user123" },
  { id: "u02", name: "Toko Pak Slamet", email: "slamet@email.com", phone: "087712345678", role: "penjual", joined: "12 Apr 2026", status: "active", orders: 0, initials: "PS", address: "Jl. Selosari Gg. Kulit No. 4, Selosari, Magetan, Jawa Timur", password: "seller123" },
  { id: "u03", name: "Admin Utama", email: "admin@kuleather.id", phone: "081122334455", role: "admin", joined: "01 Jan 2026", status: "active", orders: 0, initials: "AD", address: "Kantor Pusat Kuleather, Magetan, Jawa Timur", password: "admin123" }
];

const DEFAULT_ORDERS = [
  {
    id: "KUL-2026-0001",
    userId: "u01",
    date: "04 Jun 2026",
    total: 1281750, // subtotal 1250000 + shipping 18000 + tax 13750
    status: "Selesai",
    items: [
      { id: "tote-full-grain", name: "Tas Tote Kulit Full Grain Magetan", variant: "Cokelat Tua", qty: 1, price: 1250000, photo: "photo-1548036328-c9fa89d128fa" }
    ],
    buyer: "Budi Santoso",
    buyerEmail: "budi.santoso@email.com",
    seller: "Toko Pak Slamet",
    paymentMethod: "BCA VA",
    shippingCourier: "jne-reg",
    shippingCost: 18000,
    resi: "REG-92817882190",
    notes: "Pengiriman cepat dan aman."
  },
  {
    id: "KUL-2026-0002",
    userId: "u01",
    date: "28 Mei 2026",
    total: 646875, // subtotal 625000 + shipping 15000 + tax 6875
    status: "Diproses",
    items: [
      { id: "dompet-bifold", name: "Dompet Bifold Kulit Sapi Premium", variant: "Cognac", qty: 1, price: 350000, photo: "photo-1614252369475-531eba835eb1" },
      { id: "sabuk-pullup", name: "Sabuk Pull-Up Leather Artisan", variant: "Tan", qty: 1, price: 275000, photo: "photo-1553062407-98eeb64c6a62" }
    ],
    buyer: "Budi Santoso",
    buyerEmail: "budi.santoso@email.com",
    seller: "Toko Pak Slamet",
    paymentMethod: "DANA",
    shippingCourier: "sicepat",
    shippingCost: 15000,
    resi: "",
    notes: "Tolong sabuk dipilihkan warna tan yang agak terang."
  },
  {
    id: "KUL-2026-0003",
    userId: "u01",
    date: "10 Jun 2026",
    total: 1686150, // subtotal 1650000 + shipping 18000 + tax 18150
    status: "Menunggu Pembayaran",
    items: [
      { id: "sepatu-loafer", name: "Sepatu Loafer Kulit Full Grain", variant: "Hitam (42)", qty: 1, price: 1650000, photo: "photo-1542291026-7eec264c27ff" }
    ],
    buyer: "Budi Santoso",
    buyerEmail: "budi.santoso@email.com",
    seller: "Raja Sepatu Magetan",
    paymentMethod: "Mandiri VA",
    shippingCourier: "jne-reg",
    shippingCost: 18000,
    resi: "",
    notes: ""
  }
];

const DEFAULT_FAQ = [
  { id: "faq-001", category: "Pembayaran", question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima pembayaran melalui Virtual Account bank nasional (BCA, Mandiri, BNI, BRI), e-wallet terkemuka (GoPay, OVO, DANA), serta metode Cash on Delivery (COD) untuk wilayah tertentu.", helpful: { yes: 42, no: 3 }, order: 1 },
  { id: "faq-002", category: "Pengiriman", question: "Berapa lama waktu pengiriman paket?", answer: "Pengiriman menggunakan JNE Reguler dan SiCepat berkisar antara 2-4 hari kerja untuk pulau Jawa, dan 3-7 hari kerja untuk luar pulau Jawa. Untuk pengiriman kilat tersedia JNE YES (1 hari kerja).", helpful: { yes: 29, no: 1 }, order: 2 },
  { id: "faq-003", category: "Layanan Kustom", question: "Apakah bisa memesan produk dengan desain sendiri?", answer: "Ya, Kuleather memfasilitasi pemesanan kustom langsung ke pengrajin melalui kategori 'Jasa Pengrajin'. Anda dapat mengunggah sketsa, spesifikasi ukuran, serta jenis bahan kulit yang diinginkan.", helpful: { yes: 58, no: 2 }, order: 3 }
];

const DEFAULT_TESTIMONIALS = [
  { id: "t01", name: "Dewi Sartika", role: "Founder, Linea Shoes Jakarta", photo: "photo-1494790108377-be9c29b29330", quote: "Kuleather memudahkan saya mendapatkan pasokan kulit sapi nabati Magetan berkualitas premium secara konsisten. Sangat direkomendasikan!", rating: 5, featured: true },
  { id: "t02", name: "Bambang Pamungkas", role: "Kolektor Produk Kulit", photo: "photo-1507003211169-0a1dd7228f2d", quote: "Tas ransel vintage yang saya beli memiliki kualitas jahitan saddle stitch yang luar biasa. Harganya sangat jujur untuk kualitas mahakarya.", rating: 5, featured: true }
];

const DEFAULT_PARTNERS = [
  { id: "p01", name: "APKI" },
  { id: "p02", name: "Kemenperin" },
  { id: "p03", name: "Bank BNI" },
  { id: "p04", name: "Dekranas" },
  { id: "p05", name: "Kemendag" }
];

const DEFAULT_STATS = {
  craftsmen: { value: 2500, suffix: "+", label: "Pengrajin Aktif" },
  products: { value: 15000, suffix: "+", label: "Pilihan Produk" },
  orders: { value: 850, suffix: "+", label: "Pesanan Bulanan" },
  cities: { value: 34, suffix: "", label: "Kota Terjangkau" }
};

const DEFAULT_PROMO_CODES = [
  { code: "KULEATHER10", discount: 10, type: "percent", minOrder: 0, active: true, usageCount: 47, usageLimit: 100 },
  { code: "GRATISONGKIR", discount: 0, type: "free_shipping", minOrder: 500000, active: true, usageCount: 12, usageLimit: 50 }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "n001", time: "12:30", date: "11 Jun 2026", text: "Pesanan baru #KUL-2026-0003 masuk dari Budi Santoso", type: "order", color: "var(--warning)", read: false },
  { id: "n002", time: "09:15", date: "11 Jun 2026", text: "Stok produk 'Tas Briefcase Kulit Executive' tersisa 8 unit (Kritis)", type: "stock", color: "var(--error)", read: false },
  { id: "n003", time: "16:40", date: "10 Jun 2026", text: "Registrasi pengguna baru: Admin Utama (Role: admin)", type: "user", color: "var(--info)", read: true }
];

const DEFAULT_SITE_SETTINGS = {
  siteName: "KULEATHER",
  tagline: "Crafted with Heritage",
  email: "halo@kuleather.id",
  phone: "+62 (351) 123-4567",
  address: "Magetan, Jawa Timur, Indonesia",
  socialMedia: { instagram: "#", facebook: "#", twitter: "#" },
  shippingRates: { "jne-reg": 18000, "jne-yes": 42000, "sicepat": 15000 },
  taxRate: 0.011,
  currency: "IDR"
};

const DEFAULT_NEWSLETTER = [
  { email: "andi@gmail.com", date: "01 Jun 2026" },
  { email: "siti.rahma@yahoo.com", date: "05 Jun 2026" }
];

// Seed function
function seedData() {
  const storedProducts = localStorage.getItem('kuleather_products');
  if (storedProducts && (storedProducts.includes('photo-1627123424574-724758594785') || storedProducts.includes('"Premium"') || storedProducts.includes('"Sale"'))) {
    localStorage.removeItem('kuleather_products');
  }
  const storedArticles = localStorage.getItem('kuleather_articles');
  if (storedArticles && (storedArticles.includes('photo-1627123424574-724758594785') || storedArticles.includes('photo-1530018607912-eff2df114f1f') || storedArticles.includes('photo-153062407-98eeb64c6a62'))) {
    localStorage.removeItem('kuleather_articles');
  }
  const storedOrders = localStorage.getItem('kuleather_profile_orders');
  if (storedOrders && storedOrders.includes('photo-1627123424574-724758594785')) {
    localStorage.removeItem('kuleather_profile_orders');
  }

  if (!localStorage.getItem('kuleather_products')) localStorage.setItem('kuleather_products', JSON.stringify(DEFAULT_PRODUCTS));
  if (!localStorage.getItem('kuleather_articles')) localStorage.setItem('kuleather_articles', JSON.stringify(DEFAULT_ARTICLES));
  if (!localStorage.getItem('kuleather_users')) localStorage.setItem('kuleather_users', JSON.stringify(DEFAULT_USERS));
  if (!localStorage.getItem('kuleather_profile_orders')) localStorage.setItem('kuleather_profile_orders', JSON.stringify(DEFAULT_ORDERS));
  if (!localStorage.getItem('kuleather_faq')) localStorage.setItem('kuleather_faq', JSON.stringify(DEFAULT_FAQ));
  if (!localStorage.getItem('kuleather_testimonials')) localStorage.setItem('kuleather_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  if (!localStorage.getItem('kuleather_partners')) localStorage.setItem('kuleather_partners', JSON.stringify(DEFAULT_PARTNERS));
  if (!localStorage.getItem('kuleather_homepage_stats')) localStorage.setItem('kuleather_homepage_stats', JSON.stringify(DEFAULT_STATS));
  if (!localStorage.getItem('kuleather_promo_codes')) localStorage.setItem('kuleather_promo_codes', JSON.stringify(DEFAULT_PROMO_CODES));
  if (!localStorage.getItem('kuleather_notifications')) localStorage.setItem('kuleather_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
  if (!localStorage.getItem('kuleather_site_settings')) localStorage.setItem('kuleather_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
  if (!localStorage.getItem('kuleather_newsletter_subs')) localStorage.setItem('kuleather_newsletter_subs', JSON.stringify(DEFAULT_NEWSLETTER));
}

// Call seed
seedData();

// 2. Route Guard with Bypass parameter
function checkRouteGuard() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Bypass parameter for easy developer testing
  if (urlParams.get('bypass') === 'true') {
    const adminUser = JSON.parse(localStorage.getItem('kuleather_users')).find(u => u.role === 'admin') || DEFAULT_USERS[2];
    localStorage.setItem('kuleather_active_user', JSON.stringify(adminUser));
  }

  const activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
  
  if (!activeUser || activeUser.role !== 'admin') {
    alert('Akses Ditolak: Halaman ini hanya untuk Administrator. Mengalihkan ke login...');
    window.location.href = '../auth.html';
    return false;
  }
  return true;
}

// Check auth before anything else
const isAuthorized = checkRouteGuard();

// 3. Theme Management (Dark ↔ Light)
window.adminSwitchTheme = function() {
  // Current folder is Kuleather-Dark, switch to Kuleather-Light
  const currentPath = window.location.pathname;
  const adminIndex = currentPath.indexOf('/Kuleather-Dark/');
  if (adminIndex === -1) return;
  const relativePath = currentPath.substring(adminIndex + '/Kuleather-Dark/'.length);
  localStorage.setItem('kuleather_admin_theme', 'light');
  // Navigate to same page in Light folder
  const newPath = currentPath.substring(0, adminIndex) + '/Kuleather-Light/' + relativePath;
  window.location.href = newPath + window.location.search;
};

// 4. UI Helpers (Common Sidebar, Toast, Modal handlers)
document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthorized) return;

  // Render theme toggle button in topbar (dark mode active — show sun icon)
  const themeToggleContainer = document.getElementById('admin-theme-toggle');
  if (themeToggleContainer) {
    themeToggleContainer.innerHTML = `
      <button class="admin-topbar-btn admin-theme-toggle-btn" id="admin-theme-btn" onclick="adminSwitchTheme()" aria-label="Ganti ke Mode Terang" title="Ganti ke Mode Terang">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>
    `;
  }

  // Sidebar Toggling
  const sidebar = document.querySelector('.admin-sidebar');
  const toggleBtn = document.querySelector('.admin-sidebar-toggle');
  
  if (sidebar && toggleBtn) {
    // Read previous collapse state from localStorage
    const isCollapsed = localStorage.getItem('kuleather_admin_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('kuleather_admin_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    });
  }

  // Dynamic Injection of Mobile Drawer elements for Admin Panel
  const topbar = document.querySelector('.admin-topbar');
  const wrapper = document.querySelector('.admin-wrapper');
  
  if (topbar && !document.getElementById('admin-mobile-menu-btn')) {
    const menuBtn = document.createElement('button');
    menuBtn.className = 'admin-mobile-menu-btn';
    menuBtn.id = 'admin-mobile-menu-btn';
    menuBtn.setAttribute('aria-label', 'Buka Menu');
    menuBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    topbar.insertBefore(menuBtn, topbar.firstChild);
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
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Also close mobile sidebar when navigating (clicking nav links) on mobile
    const adminNavLinks = document.querySelectorAll('.admin-nav-item');
    adminNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Link Highlighting based on current filename
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

  // Render Datetime in topbar
  const datetimeDisplay = document.getElementById('admin-datetime-display');
  if (datetimeDisplay) {
    function updateDateTime() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      datetimeDisplay.textContent = now.toLocaleDateString('id-ID', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // Unread Notification Badge in sidebar & topbar bell
  updateNotificationBadges();

  // Modal Keyboard Support (ESC to close)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeOverlay = document.querySelector('.admin-modal-overlay.active');
      if (activeOverlay) {
        closeModal(activeOverlay.id);
      }
    }
  });
});

// Toast System
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
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
  
  // Custom styling for premium toast
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

  // Trigger animation
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 10);

  // Dismiss
  setTimeout(() => {
    toast.style.transform = 'translateX(100px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};

// Modal Handlers
window.openModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock body scroll
  }
};

window.closeModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }
};

// Admin Logout handler
window.handleAdminLogout = function() {
  if (confirm('Apakah Anda yakin ingin keluar dari panel administrator?')) {
    localStorage.removeItem('kuleather_active_user');
    window.location.href = '../auth.html';
  }
};


// Update unread notification counters
window.updateNotificationBadges = function() {
  const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Sidebar count badge
  const sidebarBadge = document.getElementById('admin-sidebar-notif-badge');
  if (sidebarBadge) {
    if (unreadCount > 0) {
      sidebarBadge.textContent = unreadCount;
      sidebarBadge.style.display = 'block';
    } else {
      sidebarBadge.style.display = 'none';
    }
  }

  // Topbar bell dot badge
  const bellBadge = document.getElementById('admin-topbar-bell-badge');
  if (bellBadge) {
    if (unreadCount > 0) {
      bellBadge.style.display = 'block';
    } else {
      bellBadge.style.display = 'none';
    }
  }
};

// Formatting Helper Currency
window.idr = function(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

// Generate random ID
window.generateRandomId = function(prefix = 'ID', length = 6) {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

// Create a notification
window.createSystemNotification = function(text, type = 'system', color = 'var(--accent)') {
  const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
  const now = new Date();
  const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const newNotif = {
    id: generateRandomId('NOTIF', 5),
    time: time,
    date: date,
    text: text,
    type: type,
    color: color,
    read: false
  };

  notifications.unshift(newNotif); // prepend
  localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));
  
  // Update badges
  updateNotificationBadges();
};
