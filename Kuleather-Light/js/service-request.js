// ==========================================================================
// KULEATHER CUSTOM SERVICE NEGOTIATION WORKSPACE ENGINE
// ==========================================================================

// IDR formatter
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Data Setup & Seeding
  const SERVICES = JSON.parse(localStorage.getItem('kuleather_services')) || [];
  let serviceOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
  let needsSave = false;
  
  // Seed SVO-101 if not exists or is incomplete
  let svo101 = serviceOrders.find(o => o.id === 'SVO-101');
  if (!svo101 || !svo101.messages || svo101.messages.length === 0 || !svo101.timeline || !svo101.escrow || !svo101.revisions || !svo101.progress) {
    serviceOrders = serviceOrders.filter(o => o.id !== 'SVO-101');
    svo101 = {
      id: "SVO-101",
      serviceId: "SVC-004",
      serviceName: "Jasa Penyamakan Kulit Sapi",
      buyerId: "u01",
      buyerName: "Budi Santoso",
      sellerId: "u02",
      sellerName: "Toko Pak Slamet",
      status: "DIKERJAKAN",
      date: "15 Jun 2026",
      time: "10:00",
      photo: "../assets/ims/wet_blue_leather.png",
      request: {
        description: "Penyamakan kulit sapi mentah 5 lembar menjadi warna tan smooth finishing.",
        referenceImages: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
        specifications: "Tebal kulit 1.8mm - 2.0mm, warna cokelat tan alami.",
        budget: 1500000,
        notes: "Tolong dikerjakan sehalus mungkin."
      },
      offer: {
        finalPrice: 1500000,
        completionDays: 14,
        estimatedDays: "14 Hari Kerja",
        freeRevisions: 3
      },
      negotiation: [
        {
          from: "buyer",
          message: "Mengajukan Request Jasa dengan budget awal Rp 1.500.000.",
          date: "15/06/2026",
          time: "10:00"
        },
        {
          from: "seller",
          message: "mengirimkan penawaran harga Rp 1.500.000 dengan estimasi 14 hari pengerjaan dan 3x kuota revisi gratis.",
          date: "15/06/2026",
          time: "10:05"
        },
        {
          from: "buyer",
          message: "menerima penawaran dan menyetujui ketentuan pengerjaan.",
          date: "15/06/2026",
          time: "10:10"
        }
      ],
      progress: [
        {
          id: "PROG-001",
          date: "16 Jun 2026",
          time: "10:30",
          description: "Paket kulit mentah dari Budi Santoso telah diterima di workshop Toko Pak Slamet, Selosari, Magetan. Kondisi kulit sapi mentah dalam keadaan baik dan siap masuk proses beamhouse."
        },
        {
          id: "PROG-002",
          date: "18 Jun 2026",
          time: "11:30",
          description: "Tahap Fleshing, Liming, dan Deliming selesai. Bulu dan lapisan lemak pada kulit sapi telah bersih sepenuhnya. Kulit siap masuk ke dalam drum penyamakan utama.",
          images: ["../assets/ims/wet_blue_leather.png"]
        },
        {
          id: "PROG-003",
          date: "22 Jun 2026",
          time: "09:00",
          description: "Proses Tanning dan Stuffing sedang berjalan. Kami menambahkan minyak pelembap serat alami (fatliquor) agar kulit berstruktur lembut dan lentur untuk kenyamanan sepatu loafer."
        }
      ],
      results: [],
      revisions: {
        used: 0,
        max: 3,
        extraCost: 150000,
        history: []
      },
      escrow: {
        status: "DITAHAN",
        amount: 1500000,
        platformFee: 75000,
        sellerReceives: 1425000
      },
      timeline: [
        { status: "REQUEST_SENT", date: "15/06/2026 10:00", text: "Request jangkauan pengerjaan dikirim." },
        { status: "DEAL", date: "15/06/2026 10:30", text: "Kesepakatan harga & waktu tercapai." },
        { status: "DIBAYAR_ESCROW", date: "15/06/2026 11:00", text: "Dana escrow sebesar Rp 1.500.000 telah didepositkan." },
        { status: "DIKERJAKAN", date: "15/06/2026 11:15", text: "Proses pengerjaan kustom dimulai." }
      ],
      negotiationCount: 1,
      messages: [
        {
          from: "buyer",
          senderName: "Budi Santoso",
          text: "Halo Pak Slamet, mohon info apakah kulitnya bisa dibuat agak lemas/supple? Rencananya mau saya pakai untuk bahan membuat sepatu loafer.",
          date: "15/06/2026",
          time: "10:30"
        },
        {
          from: "seller",
          senderName: "Toko Pak Slamet",
          text: "Halo Mas Budi, bisa sekali. Kami akan sesuaikan campuran fatliquor (minyak pelembap serat) saat proses fatstuffing agar hasil akhirnya lembut dan lemas sesuai spesifikasi sepatu loafer.",
          date: "15/06/2026",
          time: "11:15"
        },
        {
          from: "buyer",
          senderName: "Budi Santoso",
          text: "Baik Pak, terima kasih banyak atas responnya yang cepat.",
          date: "15/06/2026",
          time: "11:20"
        },
        {
          from: "seller",
          senderName: "Toko Pak Slamet",
          text: "Sama-sama Mas Budi. Update progres pengerjaan berkala akan kami kirimkan ke chatroom ini ya.",
          date: "15/06/2026",
          time: "11:30"
        },
        {
          from: "buyer",
          senderName: "Budi Santoso",
          text: "Mantap Pak, ditunggu update-nya.",
          date: "18/06/2026",
          time: "12:00"
        }
      ]
    };
    serviceOrders.push(svo101);
    needsSave = true;
  }

  // Seed SVO-102 if not exists or is incomplete
  let svo102 = serviceOrders.find(o => o.id === 'SVO-102');
  if (!svo102 || !svo102.messages || !svo102.timeline || !svo102.escrow || !svo102.revisions || !svo102.negotiation) {
    serviceOrders = serviceOrders.filter(o => o.id !== 'SVO-102');
    svo102 = {
      id: "SVO-102",
      serviceId: "SVC-002",
      serviceName: "Sol & Reparasi Sepatu Boots Kulit",
      buyerId: "u01",
      buyerName: "Budi Santoso",
      sellerId: "u02",
      sellerName: "Toko Pak Slamet",
      status: "REQUEST_SENT",
      date: "25 Jun 2026",
      time: "07:41",
      photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      request: {
        description: "Reparasi sol bawah sepatu boots kulit saya yang jebol dan semir ulang agar kinclong kembali.",
        referenceImages: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
          "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80"
        ],
        specifications: "Sepatu boots size 42, merek lokal, sol Goodyear welted jebol di bagian tumit kanan.",
        budget: 250000,
        notes: "Tolong dikerjakan secepatnya, mau dipakai untuk acara wisuda."
      },
      offer: null,
      negotiation: [
        {
          from: "buyer",
          message: "Mengajukan Request Jasa dengan budget awal Rp 250.000.",
          date: "25/06/2026",
          time: "07:41"
        }
      ],
      progress: [],
      results: [],
      revisions: {
        used: 0,
        max: 2,
        extraCost: 50000,
        history: []
      },
      escrow: {
        status: "BELUM_DIBAYAR",
        amount: 250000,
        platformFee: 12500,
        sellerReceives: 237500
      },
      timeline: [
        { status: "REQUEST_SENT", date: "25/06/2026 07:41", text: "Request jangkauan pengerjaan dikirim." }
      ],
      negotiationCount: 0,
      messages: []
    };
    serviceOrders.push(svo102);
    needsSave = true;
  }

  if (needsSave) {
    localStorage.setItem('kuleather_service_orders', JSON.stringify(serviceOrders));
  }

  // 2. Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id');
  const orderId = urlParams.get('orderId');

  // Check login user
  let activeUser = null;
  try {
    activeUser = JSON.parse(localStorage.getItem('kuleather_active_user'));
  } catch (e) {
    activeUser = null;
  }

  // Guard for guests
  if (!activeUser) {
    window.showToast('Silakan login terlebih dahulu.', 'error');
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1500);
    return;
  }

  // Setup UI elements
  const screenRequestForm = document.getElementById('screen-request-form');
  const screenNegotiationWorkspace = document.getElementById('screen-negotiation-workspace');
  const simulationBar = document.getElementById('simulation-bar');

  let simulationUserRole = 'buyer'; // 'buyer' or 'seller'
  let triggerSimulationResponseFn = null;
  let isChatBound = false;
  let revisionPayStep = 1;
  let selectedRevisionPayMethod = 'QRIS';

  // Escrow Payment Modal setup
  const paymentModal = document.getElementById('escrow-payment-modal');
  const paymentCards = document.querySelectorAll('#escrow-payment-modal .payment-card');
  const btnCloseModal = document.getElementById('btn-close-payment-modal');
  const btnCancelPay = document.getElementById('btn-cancel-escrow-pay');
  const btnConfirmPay = document.getElementById('btn-confirm-escrow-pay');
  
  const stepSelection = document.getElementById('escrow-payment-step-selection');
  const stepDetails = document.getElementById('escrow-payment-step-details');
  const btnNextPay = document.getElementById('btn-next-escrow-pay');
  const btnBackPay = document.getElementById('btn-back-escrow-pay');
  const detailsTitle = document.getElementById('escrow-details-title');
  const detailsContent = document.getElementById('escrow-details-content');

  let selectedPaymentMethod = 'QRIS';

  function resetPaymentModal() {
    if (stepSelection && stepSelection.classList) stepSelection.classList.remove('hidden');
    if (stepDetails && stepDetails.classList) stepDetails.classList.add('hidden');
  }

  if (paymentCards) {
    paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        paymentCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          selectedPaymentMethod = radio.value;
        }
      });
    });
  }

  if (btnCloseModal && typeof btnCloseModal.addEventListener === 'function') {
    btnCloseModal.addEventListener('click', () => {
      if (paymentModal && paymentModal.classList) paymentModal.classList.add('hidden');
      resetPaymentModal();
    });
  }

  if (btnCancelPay && typeof btnCancelPay.addEventListener === 'function') {
    btnCancelPay.addEventListener('click', () => {
      if (paymentModal && paymentModal.classList) paymentModal.classList.add('hidden');
      resetPaymentModal();
    });
  }

  if (btnBackPay && typeof btnBackPay.addEventListener === 'function') {
    btnBackPay.addEventListener('click', () => {
      resetPaymentModal();
    });
  }

  if (btnNextPay && typeof btnNextPay.addEventListener === 'function') {
    btnNextPay.addEventListener('click', () => {
      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const order = allOrders.find(o => o.id === orderId);
      const dealPrice = order ? (order.offer ? order.offer.finalPrice : order.request.budget) : 0;
      const formattedPrice = formatIDR(dealPrice);

      if (stepSelection && stepSelection.classList) stepSelection.classList.add('hidden');
      if (stepDetails && stepDetails.classList) stepDetails.classList.remove('hidden');

      if (detailsTitle) detailsTitle.textContent = `Instruksi Pembayaran - ${selectedPaymentMethod}`;

      if (detailsContent) {
        if (selectedPaymentMethod === 'QRIS') {
          detailsContent.innerHTML = `
            <div class="flex-y align-center text-center gap-sm" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;">
              <p class="body-sm text-secondary" style="font-size:13px;">Silakan scan kode QRIS di bawah ini menggunakan aplikasi mobile banking atau e-wallet Anda (GoPay, OVO, Dana, LinkAja):</p>
              <div style="background: white; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-medium); width: fit-content; margin: 8px auto;">
                <svg width="150" height="150" viewBox="0 0 29 29" style="display: block; shape-rendering: crispEdges; fill: #000000;">
                  <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h1v1h-1zm1 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm1 0h4v7h-4zm1 1v5h2V1zm5 0h1v1h-1zm-6 2h1v1H-1zm2 0h1v1h-1zm1 0h2v2h-1v-1h-1zm-3 1h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-9 2h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v2h-1zm2 0h1v1h-1zm1 0h2v1h-2zm-3 1h2v1h-2zm4 0h1v1h-1zm1 0h1v1h-1zm-11 1h1v1H8zm5 0h2v1h-2zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h2v1h-2zm-14 1h7v7H0zm1 1v5h5V9zm8 0h1v1H9zm1 0h2v1h-2zm3 0h1v2h-1v-1zm1 0h1v1h-1zm2 0h2v1h-2zm1 0h1v2h-1zm-6 1h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm-6 1h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm-7 1h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm2 0h2v1H4zm3 0h1v1H7zm1 0h2v1H8zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h2v1h-2zm-13 1h1v1H1zm2 0h1v1H3zm1 0h1v1H4zm3 0h1v1H7zm2 0h2v1H9zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm3 0h1v1H5zm1 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm2 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm1 0h2v1H9zm3 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1z"/>
                </svg>
              </div>
              <p style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent);">Merchant: KULEATHER ESCROW</p>
              <p class="font-weight-bold" style="font-size: 14px; color: var(--text-primary); margin-top: 4px;">Total Tagihan: <span class="text-accent">${formattedPrice}</span></p>
            </div>
          `;
        } else if (selectedPaymentMethod.includes('Virtual Account')) {
          const bankName = selectedPaymentMethod.split(' ')[0];
          const vaNumber = `88012${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          detailsContent.innerHTML = `
            <div class="flex-y gap-md" style="display: flex; flex-direction: column; gap: var(--space-md);">
              <p class="body-sm text-secondary" style="font-size:13px;">Lakukan transfer dari ATM atau Mobile Banking Anda ke nomor Virtual Account di bawah ini:</p>
              <div style="background: var(--bg-alt); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display:flex; flex-direction:column; gap:4px;">
                <span class="caption text-muted" style="font-size: 8px; text-transform: uppercase;">BANK TUJUAN</span>
                <strong style="font-size: 13px; color: var(--text-primary);">${bankName} Virtual Account</strong>
                
                <span class="caption text-muted" style="font-size: 8px; text-transform: uppercase; margin-top: 12px;">NOMOR VIRTUAL ACCOUNT</span>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong class="mono" style="font-size: 16px; color: var(--accent); letter-spacing: 1px;">${vaNumber}</strong>
                  <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${vaNumber}'); window.showToast('Nomor VA disalin!', 'info');" style="padding: 4px 8px; font-size: 9px; min-height: unset; height: fit-content;">SALIN</button>
                </div>
                
                <span class="caption text-muted" style="font-size: 8px; text-transform: uppercase; margin-top: 12px;">TOTAL PEMBAYARAN</span>
                <strong class="mono text-primary" style="font-size: 14px;">${formattedPrice}</strong>
              </div>
              <div class="caption text-secondary" style="font-size: 11px; line-height: 1.4;">
                <strong>Petunjuk Transfer Singkat:</strong>
                <ol style="margin-left: 16px; margin-top: 4px;">
                  <li>Pilih menu Transfer > Virtual Account.</li>
                  <li>Masukkan nomor VA di atas.</li>
                  <li>Konfirmasi detail tagihan yang muncul atas nama Kuleather.</li>
                  <li>Selesaikan transfer.</li>
                </ol>
              </div>
            </div>
          `;
        } else if (selectedPaymentMethod === 'GoPay' || selectedPaymentMethod === 'OVO') {
          detailsContent.innerHTML = `
            <div class="flex-y gap-md" style="display: flex; flex-direction: column; gap: var(--space-md);">
              <p class="body-sm text-secondary" style="font-size:13px;">Silakan masukkan nomor handphone terdaftar yang terhubung dengan akun <strong>${selectedPaymentMethod}</strong> Anda untuk mengirimkan permintaan pembayaran (push notification):</p>
              <div class="form-group" style="margin: 8px 0;">
                <label class="form-label" style="font-size: 8px; font-weight:700;">NOMOR HANDPHONE E-WALLET</label>
                <div style="display: flex; gap: 8px;">
                  <span style="background: var(--bg-alt); border: 1px solid var(--border-medium); padding: 8px 12px; border-radius: var(--radius-md); font-weight:700; font-size:13px; display:flex; align-items:center;">+62</span>
                  <input type="tel" id="ewallet-phone-input" class="form-input" style="flex:1; padding:8px 12px; font-size:13px; border-radius:var(--radius-md);" placeholder="81234567890" value="81294857283">
                </div>
              </div>
              <p class="caption text-muted" style="font-size: 11px;">Setelah mengklik Konfirmasi, buka aplikasi ${selectedPaymentMethod} Anda dan setujui permintaan pembayaran sebelum waktu habis.</p>
              <p class="font-weight-bold" style="font-size: 14px; color: var(--text-primary);">Total Tagihan: <span class="text-accent">${formattedPrice}</span></p>
            </div>
          `;
        }
      }
    });
  }

  if (btnConfirmPay && typeof btnConfirmPay.addEventListener === 'function') {
    btnConfirmPay.addEventListener('click', () => {
      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === orderId);

      if (idx !== -1) {
        const dealPrice = allOrders[idx].offer ? allOrders[idx].offer.finalPrice : allOrders[idx].request.budget;
        
        allOrders[idx].status = 'DIBAYAR_ESCROW';
        allOrders[idx].escrow = {
          status: "DITAHAN",
          amount: dealPrice,
          platformFee: dealPrice * 0.05,
          sellerReceives: dealPrice * 0.95
        };

        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Melakukan pembayaran deposit escrow berhasil sebesar ${formatIDR(dealPrice)} via ${selectedPaymentMethod}. Dana aman ditahan oleh platform.`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        allOrders[idx].timeline.push({
          status: "DIBAYAR_ESCROW",
          date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: "Deposit escrow diamankan platform."
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        if (paymentModal && paymentModal.classList) {
          paymentModal.classList.add('hidden');
        }
        resetPaymentModal();
        window.showToast('Pembayaran deposit escrow berhasil diamankan!', 'success');

        const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
        notifications.unshift({
          id: 'notif-' + Date.now(),
          message: `Deposit escrow untuk order #${orderId} berhasil disetorkan pembeli.`,
          type: 'service',
          read: false,
          color: 'var(--success)',
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));

        initializeWorkspace(orderId);

        setTimeout(() => {
          if (triggerSimulationResponseFn) {
            triggerSimulationResponseFn(`[Pembayaran Escrow via ${selectedPaymentMethod}]`);
          }
        }, 1000);
      }
    });
  }

  if (orderId) {
    // We are viewing an existing negotiation
    initializeWorkspace(orderId);
  } else if (serviceId) {
    // We are submitting a new request
    initializeRequestForm(serviceId);
  } else {
    // No params, redirect to services list
    window.location.href = 'services.html';
  }

  // ==========================================================================
  // SCREEN 1: NEW REQUEST FORM
  // ==========================================================================
  function initializeRequestForm(svcId) {
    if (!screenRequestForm) return;
    screenRequestForm.classList.remove('hidden');
    
    const s = SERVICES.find(item => item.id === svcId);
    if (!s) {
      window.showToast('Layanan Jasa tidak ditemukan.', 'error');
      setTimeout(() => {
        window.location.href = 'services.html';
      }, 1500);
      return;
    }

    // Populate read-only form details
    document.getElementById('req-service-name').value = s.name;
    document.getElementById('req-seller-name').value = s.sellerName;
    document.getElementById('req-budget').value = s.startingPrice;
    document.getElementById('req-budget').min = s.startingPrice;

    // Handle Image Picker interaction
    const pickerItems = document.querySelectorAll('#req-ref-picker .image-picker-item');
    pickerItems.forEach(item => {
      item.addEventListener('click', () => {
        const checkbox = item.querySelector('.image-picker-checkbox');
        item.classList.toggle('selected');
        checkbox.checked = item.classList.contains('selected');
        
        // Count selected
        const selectedCount = document.querySelectorAll('#req-ref-picker .image-picker-item.selected').length;
        if (selectedCount > 2) {
          // Unselect
          item.classList.remove('selected');
          checkbox.checked = false;
          window.showToast('Anda hanya bisa memilih maksimal 2 gambar referensi.', 'warning');
        }
      });
    });

    // Handle Form Submit
    const reqForm = document.getElementById('new-service-request-form');
    reqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const budget = parseInt(document.getElementById('req-budget').value, 10);
      const desc = document.getElementById('req-desc').value.trim();
      const specs = document.getElementById('req-specs').value.trim();
      const notes = document.getElementById('req-notes').value.trim();

      if (desc === '') {
        window.showToast('Deskripsi model custom wajib diisi.', 'error');
        return;
      }

      // Collect selected reference images
      const refImages = [];
      document.querySelectorAll('#req-ref-picker .image-picker-item.selected').forEach(item => {
        refImages.push(item.getAttribute('data-url'));
      });

      // Generate Service Order ID
      const serviceOrdersList = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const newOrderId = 'SVO-' + (100 + serviceOrdersList.length + 1).toString();

      // Create new Service Order
      const newOrder = {
        id: newOrderId,
        serviceId: s.id,
        serviceName: s.name,
        buyerId: activeUser.id,
        buyerName: activeUser.name,
        sellerId: s.sellerId,
        sellerName: s.sellerName,
        status: "REQUEST_SENT",
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        request: {
          description: desc,
          referenceImages: refImages,
          specifications: specs || 'Tidak ada spesifikasi khusus',
          budget: budget,
          notes: notes || 'Tidak ada catatan khusus'
        },
        offer: null,
        negotiation: [
          {
            from: "buyer",
            message: `Mengajukan Request Jasa dengan budget awal ${formatIDR(budget)}.`,
            date: new Date().toLocaleDateString('id-ID'),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ],
        progress: [],
        results: [],
        revisions: {
          used: 0,
          max: s.freeRevisions,
          extraCost: s.extraRevisionCost,
          history: []
        },
        escrow: {
          status: "BELUM_DIBAYAR",
          amount: 0,
          platformFee: 0,
          sellerReceives: 0
        },
        timeline: [
          { status: "REQUEST_SENT", date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: "Request jangkauan pengerjaan dikirim." }
        ],
        negotiationCount: 0, // max 3 counter negosiasi
        messages: [] // normal chat messages
      };

      serviceOrdersList.push(newOrder);
      localStorage.setItem('kuleather_service_orders', JSON.stringify(serviceOrdersList));

      // Notification for admin and seller
      const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(Math.random() * 90000 + 10000),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        text: `Request Jasa baru #${newOrderId} dari ${activeUser.name} untuk ${s.sellerName}`,
        type: "service",
        color: "var(--accent)",
        read: false
      });
      localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));

      window.showToast('Request Jasa berhasil diajukan!', 'success');
      setTimeout(() => {
        window.location.href = `service-request.html?orderId=${newOrderId}`;
      }, 1500);
    });
  }

  // ==========================================================================
  // SCREEN 2: NEGOTIATION ROOM WORKSPACE
  // ==========================================================================
  function initializeWorkspace(ordId) {
    if (!screenNegotiationWorkspace) return;
    screenNegotiationWorkspace.classList.remove('hidden');

    // Fetch order
    const orders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
    const order = orders.find(o => o.id === ordId);

    if (!order) {
      window.showToast('ID Order Jasa tidak ditemukan.', 'error');
      setTimeout(() => {
        window.location.href = 'services.html';
      }, 1500);
      return;
    }

    // Defensive property initialization for backward compatibility
    let needsResave = false;
    if (!order.revisions) { order.revisions = { used: 0, max: 2, extraCost: 50000, history: [] }; needsResave = true; }
    if (!order.negotiation) { order.negotiation = []; needsResave = true; }
    if (!order.timeline) { order.timeline = []; needsResave = true; }
    if (!order.messages) { order.messages = []; needsResave = true; }
    if (!order.progress) { order.progress = []; needsResave = true; }
    if (!order.results) { order.results = []; needsResave = true; }
    if (!order.escrow) { order.escrow = { status: "BELUM_DIBAYAR", amount: 0, platformFee: 0, sellerReceives: 0 }; needsResave = true; }
    if (order.negotiationCount === undefined) { order.negotiationCount = 0; needsResave = true; }
    if (!order.buyerName) { order.buyerName = "Budi Santoso"; needsResave = true; }
    if (!order.sellerName) { order.sellerName = "Toko Pak Slamet"; needsResave = true; }
    
    if (needsResave) {
      localStorage.setItem('kuleather_service_orders', JSON.stringify(orders));
    }

    // Set initial simulation role based on logged-in role
    if (activeUser.role === 'penjual' && activeUser.id === order.sellerId) {
      simulationUserRole = 'seller';
    } else {
      simulationUserRole = 'buyer';
    }
    triggerSimulationResponseFn = triggerSimulationResponse;

    // Bind text message input sending
    const btnSend = document.getElementById('btn-chat-send');
    const txtInput = document.getElementById('chat-text-input');

    if (btnSend && txtInput && !isChatBound) {
      btnSend.addEventListener('click', () => {
        sendChatMessage();
      });

      txtInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendChatMessage();
        }
      });
      isChatBound = true;
    }

    function sendChatMessage() {
      try {
        let msgText = txtInput.value.trim();
        if (msgText === '') {
          // Get template message based on current order status
          const currentOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
          const currentOrder = currentOrders.find(o => o.id === ordId);
          if (currentOrder) {
            msgText = getTemplateMessage(currentOrder.status, ordId);
          }
        }
        if (!msgText) return;

        const currentOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
        const currentOrderIdx = currentOrders.findIndex(o => o.id === ordId);

        if (currentOrderIdx !== -1) {
          const freshOrder = currentOrders[currentOrderIdx];
          if (!freshOrder.messages) freshOrder.messages = [];

          freshOrder.messages.push({
            from: simulationUserRole,
            senderName: simulationUserRole === 'buyer' ? (freshOrder.buyerName || 'Budi Santoso') : (freshOrder.sellerName || 'Toko Pak Slamet'),
            text: msgText,
            date: new Date().toLocaleDateString('id-ID'),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          });

          localStorage.setItem('kuleather_service_orders', JSON.stringify(currentOrders));
          txtInput.value = '';
          initializeWorkspace(ordId); // Reload data

          // Trigger simulation response
          triggerSimulationResponse(msgText);
        }
      } catch (err) {
        console.error("Error in sendChatMessage:", err);
        if (typeof window.showToast === 'function') {
          window.showToast("Gagal mengirim pesan: " + err.message, "error");
        }
      }
    }

    function getTemplateMessage(status, orderId) {
      if (orderId === 'SVO-102') {
        switch (status) {
          case 'REQUEST_SENT':
            return "Halo Toko Pak Slamet, mohon diperiksa request reparasi sol sepatu boots saya.";
          case 'PENAWARAN_DIKIRIM':
            return "Saya setuju dengan penawaran harga Rp 250.000 dan estimasi waktu 5 hari.";
          case 'DEAL':
            return "Saya akan membayar deposit escrow sekarang.";
          case 'DIBAYAR_ESCROW':
            return "Pembayaran deposit escrow sudah diselesaikan. Silakan mulai pengerjaannya.";
          case 'DIKERJAKAN':
            const orders102 = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
            const ord102 = orders102.find(o => o.id === orderId);
            if (ord102 && ord102.progress && ord102.progress.length > 0) {
              return "Apakah hasil pengerjaannya sudah selesai dan bisa dikirim?";
            }
            return "Bagaimana perkembangan progres pengerjaan sepatu boots saya?";
          case 'HASIL_DIKIRIM':
            return "Hasilnya sangat rapi dan bagus! Saya konfirmasi setuju dan transaksi selesai.";
          case 'SELESAI':
            return "Terima kasih banyak atas kerjasamanya!";
          default:
            return "Halo, mohon bantuannya.";
        }
      } else if (orderId === 'SVO-101') {
        switch (status) {
          case 'DIKERJAKAN':
            const orders101 = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
            const ord101 = orders101.find(o => o.id === orderId);
            if (ord101 && ord101.progress && ord101.progress.length > 3) {
              return "Apakah hasil penyamakan kulit sapinya sudah selesai?";
            }
            return "Bagaimana progres penyamakan kulit sapi saya?";
          case 'HASIL_DIKIRIM':
            return "Hasil penyamakan sangat lembut dan supple! Saya terima hasil penyamakannya.";
          case 'SELESAI':
            return "Terima kasih banyak Pak Slamet!";
          default:
            return "Halo Pak Slamet.";
        }
      } else {
        switch (status) {
          case 'REQUEST_SENT':
            return "Halo, mohon diperiksa pengajuan request jasa kustom saya.";
          case 'PENAWARAN_DIKIRIM':
            return "Saya setuju dengan penawaran yang diajukan.";
          case 'DEAL':
            return "Saya akan membayar deposit escrow sekarang.";
          case 'DIBAYAR_ESCROW':
            return "Pembayaran deposit escrow sudah masuk. Silakan mulai pengerjaan.";
          case 'DIKERJAKAN':
            const ordersGen = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
            const ordGen = ordersGen.find(o => o.id === orderId);
            if (ordGen && ordGen.progress && ordGen.progress.length > 0) {
              return "Apakah pengerjaan kustomnya sudah selesai?";
            }
            return "Bagaimana perkembangan pengerjaan pesanan kustom saya?";
          case 'HASIL_DIKIRIM':
            return "Hasil jadinya bagus! Saya setuju untuk menyelesaikan transaksi.";
          case 'SELESAI':
            return "Terima kasih banyak atas pengerjaannya!";
          default:
            return "Halo.";
        }
      }
    }

    function triggerSimulationResponse(userMessage) {
      try {
        const chatContainer = document.getElementById('chat-messages-container');
        if (!chatContainer) return;

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-bubble incoming';
        typingIndicator.id = 'chat-typing-indicator';
        typingIndicator.style.alignSelf = 'flex-start';
        typingIndicator.style.backgroundColor = 'var(--surface)';
        typingIndicator.style.border = '1px solid var(--muted-light)';
        typingIndicator.style.padding = '12px var(--space-md)';
        typingIndicator.style.borderRadius = 'var(--radius-lg)';
        typingIndicator.style.borderTopLeftRadius = '0';
        typingIndicator.style.marginTop = '8px';
        typingIndicator.style.width = 'fit-content';
        
        typingIndicator.innerHTML = `
          <div class="typing-dots" style="display: flex; gap: 4px; align-items: center; height: 12px;">
            <span style="width: 6px; height: 6px; background-color: var(--text-muted); border-radius: 50%; animation: typing-bounce 1.4s infinite both;"></span>
            <span style="width: 6px; height: 6px; background-color: var(--text-muted); border-radius: 50%; animation: typing-bounce 1.4s infinite both; animation-delay: .2s;"></span>
            <span style="width: 6px; height: 6px; background-color: var(--text-muted); border-radius: 50%; animation: typing-bounce 1.4s infinite both; animation-delay: .4s;"></span>
          </div>
        `;
        
        if (!document.getElementById('typing-animation-style')) {
          const style = document.createElement('style');
          style.id = 'typing-animation-style';
          style.innerHTML = `
            @keyframes typing-bounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1.2); opacity: 1; }
            }
          `;
          document.head.appendChild(style);
        }

        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        setTimeout(() => {
          try {
            const indicator = document.getElementById('chat-typing-indicator');
            if (indicator && typeof indicator.remove === 'function') {
              indicator.remove();
            } else if (indicator && indicator.parentNode) {
              indicator.parentNode.removeChild(indicator);
            }

            const freshOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
            const freshOrderIdx = freshOrders.findIndex(o => o.id === ordId);

            if (freshOrderIdx !== -1) {
              const order = freshOrders[freshOrderIdx];
              let replyText = "";
              let notificationMsg = "";
              
              if (ordId === 'SVO-102') {
                if (order.status === 'REQUEST_SENT') {
                  order.status = 'PENAWARAN_DIKIRIM';
                  order.offer = {
                    finalPrice: 250000,
                    completionDays: 5,
                    estimatedDays: "5 Hari Kerja",
                    freeRevisions: 2,
                    extraRevisionCost: 50000,
                    notes: "Ganti sol baru Goodyear welted & semir ulang."
                  };
                  order.revisions.max = 2;
                  order.revisions.extraCost = 50000;
                  order.negotiation.push({
                    from: "seller",
                    message: "Mengirimkan penawaran harga final sebesar Rp 250.000 dengan estimasi pengerjaan 5 Hari Kerja. Batas revisi gratis: 2 kali (Revisi tambahan: Rp 50.000 /revisi).\nCatatan: \"Ganti sol baru Goodyear welted & semir ulang.\"",
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'PENAWARAN_DIKIRIM')) {
                    order.timeline.push({
                      status: "PENAWARAN_DIKIRIM",
                      date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      text: "Penawaran harga dari pengrajin dikirim."
                    });
                  }
                  replyText = "Halo Mas Budi, request sepatu boots-nya sudah saya periksa. Sol Goodyear welted yang jebol akan kami jahit ulang dengan sol kulit berkualitas tinggi agar kokoh kembali untuk wisuda, lalu disemir ulang agar kinclong. Sudah saya ajukan penawaran harga resminya Rp 250.000 ya, silakan di-review.";
                  notificationMsg = `Pengrajin mengirimkan penawaran kustom untuk #${ordId}.`;
                } 
                else if (order.status === 'PENAWARAN_DIKIRIM') {
                  order.status = 'DEAL';
                  order.negotiation.push({
                    from: "buyer",
                    message: "Menyetujui penawaran pengrajin. Transaksi siap dibayar ke escrow.",
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'DEAL')) {
                    order.timeline.push({
                      status: "DEAL",
                      date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      text: "Kesepakatan harga & waktu tercapai."
                    });
                  }
                  replyText = "Penawaran disetujui! Silakan lakukan pembayaran deposit Escrow Kuleather agar dana aman dan pengerjaan reparasi bisa segera kami mulai.";
                } 
                else if (order.status === 'DEAL') {
                  order.status = 'DIBAYAR_ESCROW';
                  order.escrow = {
                    status: "DITAHAN",
                    amount: 250000,
                    platformFee: 12500,
                    sellerReceives: 237500
                  };
                  order.negotiation.push({
                    from: "buyer",
                    message: "Melakukan pembayaran deposit escrow berhasil sebesar Rp 250.000 via BCA Virtual Account. Dana aman ditahan oleh platform.",
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'DIBAYAR_ESCROW')) {
                    order.timeline.push({
                      status: "DIBAYAR_ESCROW",
                      date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      text: "Deposit escrow diamankan platform."
                    });
                  }
                  replyText = "Terima kasih Mas Budi! Pembayaran deposit escrow sebesar Rp 250.000 sudah masuk dan diamankan platform. Kami siap memproses pengerjaan fisik sepatunya.";
                  notificationMsg = `Deposit escrow untuk order #${ordId} berhasil disetorkan pembeli.`;
                } 
                else if (userMessage.includes('[Pembayaran Escrow')) {
                  replyText = `Terima kasih Mas Budi! Pembayaran deposit escrow sebesar ${formatIDR(order.offer ? order.offer.finalPrice : order.request.budget)} via ${selectedPaymentMethod} telah kami terima dan diamankan platform. Kami siap memproses pengerjaan kustom Anda.`;
                }
                else if (userMessage.includes('[Pembayaran Revisi')) {
                  replyText = `Terima kasih atas pembayarannya! Pembayaran biaya revisi tambahan sebesar ${formatIDR(order.revisions.extraCost)} via ${selectedRevisionPayMethod} sudah terkonfirmasi. Silakan kirimkan instruksi revisi detail Anda di bawah agar bisa segera kami kerjakan.`;
                }
                else if (userMessage.includes('[Permintaan Revisi:')) {
                  const notesRev = userMessage.replace('[Permintaan Revisi: ', '').replace(']', '');
                  replyText = `Baik Mas Budi, catatan revisi untuk perbaikan "${notesRev}" sudah kami terima. Kami akan segera mengerjakannya ulang secepatnya.`;
                }
                else if (order.status === 'DIBAYAR_ESCROW') {
                  if (userMessage.includes('Pembayaran Escrow')) {
                    replyText = "Terima kasih Mas Budi! Deposit escrow sebesar Rp 250.000 sudah masuk dan diamankan platform. Kami siap memproses pengerjaan fisik sepatunya.";
                  } else {
                    order.status = 'DIKERJAKAN';
                    if (!order.timeline.find(t => t.status === 'DIKERJAKAN')) {
                      order.timeline.push({
                        status: "DIKERJAKAN",
                        date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        text: "Pengerjaan fisik oleh pengrajin dimulai."
                      });
                    }
                    replyText = "Pengerjaan sol sepatu boots kustom Anda resmi dimulai pagi ini! Kami sedang membongkar bagian sol yang lama dengan hati-hati.";
                  }
                } 
                else if (order.status === 'DIKERJAKAN') {
                  if (order.progress.length === 0) {
                    order.progress.push({
                      id: "PROG-102-1",
                      date: new Date().toLocaleDateString('id-ID'),
                      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      description: "Sol Goodyear welted baru selesai dijahit tangan di sekeliling konstruksi sepatu.",
                      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"]
                    });
                    replyText = "Update Progres WIP: Sol Goodyear welted baru sudah selesai dijahit tangan secara presisi. Langkah berikutnya adalah peminyakan dan pewarnaan pinggiran sol.";
                  } else {
                    order.status = 'HASIL_DIKIRIM';
                    order.results.push({
                      notes: "Reparasi sol Goodyear welted selesai dengan jahitan ganda, sol kokoh kembali, kulit sepatu sudah di-conditioning dan semir warna hitam natural.",
                      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"],
                      date: new Date().toLocaleDateString('id-ID'),
                      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    });
                    if (!order.timeline.find(t => t.status === 'HASIL_DIKIRIM')) {
                      order.timeline.push({
                        status: "HASIL_DIKIRIM",
                        date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        text: "Hasil akhir jadi diserahkan pengrajin."
                      });
                    }
                    replyText = "Kabar baik Mas Budi, sol sepatu boots Anda sudah selesai direparasi total dan disemir mengkilap! Hasil jadi sudah kami kirimkan, mohon di-review.";
                    notificationMsg = `Hasil pengerjaan kustom #${ordId} telah diserahkan. Perlu review Anda.`;
                  }
                } 
                else if (order.status === 'HASIL_DIKIRIM') {
                  order.status = 'SELESAI';
                  order.escrow.status = 'DILEPAS';
                  order.negotiation.push({
                    from: "buyer",
                    message: "Menyetujui pengerjaan selesai. Terima kasih atas kerja samanya!",
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'SELESAI')) {
                    order.timeline.push({
                      status: "SELESAI",
                      date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      text: "Order selesai disetujui pembeli."
                    });
                  }
                  replyText = "Terima kasih banyak atas persetujuan dan ulasannya Mas Budi! Sangat senang bisa membantu menyukseskan acara wisuda Anda. Transaksi custom selesai.";
                  notificationMsg = `Transaksi custom #${ordId} selesai disetujui.`;
                } 
                else {
                  replyText = "Transaksi custom ini telah selesai. Terima kasih atas kepercayaannya menghubungi Toko Pak Slamet!";
                }
              } 
              else if (ordId === 'SVO-101') {
                if (order.status === 'DIKERJAKAN') {
                  if (order.progress.length === 3) {
                    order.progress.push({
                      id: "PROG-004",
                      date: new Date().toLocaleDateString('id-ID'),
                      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      description: "Proses pengeringan kulit sapi (toggling) selesai. Tekstur kulit sangat supple, halus, dan lentur.",
                      images: ["../assets/ims/wet_blue_leather.png"]
                    });
                    replyText = "Update Progres WIP: Penyamakan kulit sapi mentah 5 lembar telah selesai melalui proses fatstuffing dan toggling (pengeringan). Hasilnya sangat lemas dan lembut sesuai specifications loafer Anda.";
                  } else {
                    order.status = 'HASIL_DIKIRIM';
                    order.results.push({
                      notes: "Penyamakan 5 lembar kulit sapi grade A selesai. Warna cokelat tan konsisten, supple finishing, tebal rata 1.9mm.",
                      images: ["../assets/ims/wet_blue_leather.png"],
                      date: new Date().toLocaleDateString('id-ID'),
                      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    });
                    if (!order.timeline.find(t => t.status === 'HASIL_DIKIRIM')) {
                      order.timeline.push({
                        status: "HASIL_DIKIRIM",
                        date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        text: "Hasil akhir jadi diserahkan pengrajin."
                      });
                    }
                    replyText = "Hasil Akhir Selesai: Penyamakan kulit sapi 5 lembar warna cokelat tan alami sudah selesai diproses dan siap dikirim ke alamat Anda! Silakan di-review.";
                    notificationMsg = `Hasil pengerjaan kustom #${ordId} telah diserahkan. Perlu review Anda.`;
                  }
                } 
                else if (order.status === 'HASIL_DIKIRIM') {
                  order.status = 'SELESAI';
                  order.escrow.status = 'DILEPAS';
                  order.negotiation.push({
                    from: "buyer",
                    message: "Menyetujui pengerjaan selesai. Terima kasih atas kerja samanya!",
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'SELESAI')) {
                    order.timeline.push({
                      status: "SELESAI",
                      date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                      text: "Order selesai disetujui pembeli."
                    });
                  }
                  replyText = "Terima kasih banyak Mas Budi! Sangat senang bekerja sama dengan Anda. Transaksi custom selesai.";
                  notificationMsg = `Transaksi custom #${ordId} selesai disetujui.`;
                } 
                else {
                  replyText = "Transaksi custom ini telah selesai. Terima kasih atas kepercayaannya menghubungi Toko Pak Slamet!";
                }
              }
              else {
                // Generic simulation for any other order ID
                const sellerName = order.sellerName || 'Pengrajin';
                if (order.status === 'REQUEST_SENT') {
                  const budget = order.request ? order.request.budget : 0;
                  const estimasi = '7 Hari Kerja';
                  const harga = budget;
                  order.status = 'PENAWARAN_DIKIRIM';
                  order.offer = {
                    finalPrice: harga,
                    completionDays: 7,
                    estimatedDays: estimasi,
                    freeRevisions: 2,
                    extraRevisionCost: 75000,
                    notes: 'Kami siap memproses pesanan kustom Anda sesuai spesifikasi.'
                  };
                  order.revisions.max = 2;
                  order.revisions.extraCost = 75000;
                  order.negotiation.push({
                    from: 'seller',
                    message: `Mengirimkan penawaran harga final sebesar ${formatIDR(harga)} dengan estimasi pengerjaan ${estimasi}. Batas revisi gratis: 2 kali (Revisi tambahan: ${formatIDR(75000)} /revisi).\nCatatan: "Kami siap memproses pesanan kustom Anda sesuai spesifikasi."`,
                    date: new Date().toLocaleDateString('id-ID'),
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (!order.timeline.find(t => t.status === 'PENAWARAN_DIKIRIM')) {
                    order.timeline.push({ status: 'PENAWARAN_DIKIRIM', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Penawaran harga dari pengrajin dikirim.' });
                  }
                  replyText = `Halo, request kustom Anda sudah kami terima dan periksa. Kami siap mengerjakan sesuai spesifikasi yang diminta. Sudah kami kirimkan penawaran harga ${formatIDR(harga)} dengan estimasi ${estimasi}, silakan di-review.`;
                  notificationMsg = `Pengrajin mengirimkan penawaran kustom untuk #${ordId}.`;
                } else if (order.status === 'PENAWARAN_DIKIRIM') {
                  order.status = 'DEAL';
                  order.negotiation.push({ from: 'buyer', message: 'Menyetujui penawaran pengrajin. Transaksi siap dibayar ke escrow.', date: new Date().toLocaleDateString('id-ID'), time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
                  if (!order.timeline.find(t => t.status === 'DEAL')) {
                    order.timeline.push({ status: 'DEAL', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Kesepakatan harga & waktu tercapai.' });
                  }
                  replyText = 'Penawaran disetujui! Silakan lakukan pembayaran deposit Escrow Kuleather agar pengerjaan segera dimulai.';
                } else if (order.status === 'DEAL') {
                  const dealPrice = order.offer ? order.offer.finalPrice : (order.request ? order.request.budget : 0);
                  order.status = 'DIBAYAR_ESCROW';
                  order.escrow = { status: 'DITAHAN', amount: dealPrice, platformFee: dealPrice * 0.05, sellerReceives: dealPrice * 0.95 };
                  order.negotiation.push({ from: 'buyer', message: `Melakukan pembayaran deposit escrow berhasil sebesar ${formatIDR(dealPrice)} via Escrow Kuleather. Dana aman ditahan platform.`, date: new Date().toLocaleDateString('id-ID'), time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
                  if (!order.timeline.find(t => t.status === 'DIBAYAR_ESCROW')) {
                    order.timeline.push({ status: 'DIBAYAR_ESCROW', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Deposit escrow diamankan platform.' });
                  }
                  replyText = `Terima kasih! Pembayaran escrow sudah masuk dan diamankan platform. Kami akan segera memulai proses pengerjaan kustom Anda.`;
                  notificationMsg = `Deposit escrow untuk order #${ordId} berhasil disetorkan.`;
                } else if (order.status === 'DIBAYAR_ESCROW') {
                  order.status = 'DIKERJAKAN';
                  if (!order.timeline.find(t => t.status === 'DIKERJAKAN')) {
                    order.timeline.push({ status: 'DIKERJAKAN', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Pengerjaan fisik oleh pengrajin dimulai.' });
                  }
                  replyText = 'Pengerjaan kustom Anda resmi dimulai! Kami akan mengirimkan update progress secara berkala.';
                } else if (order.status === 'DIKERJAKAN') {
                  if (order.progress.length === 0) {
                    order.progress.push({ id: 'PROG-GEN-1', date: new Date().toLocaleDateString('id-ID'), time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), description: 'Proses pemotongan pola dan persiapan bahan sudah selesai. Pengerjaan utama sedang berlangsung.', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80'] });
                    replyText = 'Update Progress WIP: Proses persiapan bahan sudah selesai, pengerjaan utama sedang berjalan dengan lancar!';
                  } else {
                    order.status = 'HASIL_DIKIRIM';
                    order.results.push({ notes: 'Pengerjaan kustom selesai sesuai spesifikasi. Produk siap dikirimkan ke pembeli.', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80'], date: new Date().toLocaleDateString('id-ID'), time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
                    if (!order.timeline.find(t => t.status === 'HASIL_DIKIRIM')) {
                      order.timeline.push({ status: 'HASIL_DIKIRIM', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Hasil akhir jadi diserahkan pengrajin.' });
                    }
                    replyText = 'Kabar baik! Pengerjaan kustom Anda sudah selesai dan produk siap dikirimkan. Silakan review hasil pengerjaan.';
                    notificationMsg = `Hasil pengerjaan kustom #${ordId} telah diserahkan. Perlu review Anda.`;
                  }
                } else if (order.status === 'HASIL_DIKIRIM') {
                  order.status = 'SELESAI';
                  order.escrow.status = 'DILEPAS';
                  order.negotiation.push({ from: 'buyer', message: 'Menyetujui pengerjaan selesai. Terima kasih atas kerja samanya!', date: new Date().toLocaleDateString('id-ID'), time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
                  if (!order.timeline.find(t => t.status === 'SELESAI')) {
                    order.timeline.push({ status: 'SELESAI', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Order selesai disetujui pembeli.' });
                  }
                  replyText = 'Terima kasih banyak! Sangat senang bisa membantu. Semoga produk kustom Anda memuaskan. Transaksi selesai.';
                  notificationMsg = `Transaksi custom #${ordId} selesai disetujui.`;
                } else {
                  replyText = 'Transaksi ini telah selesai. Terima kasih atas kepercayaan Anda!';
                }
              }
    
              if (!order.messages) order.messages = [];
              if (replyText) {
                order.messages.push({
                  from: "seller",
                  senderName: "Toko Pak Slamet",
                  text: replyText,
                  date: new Date().toLocaleDateString('id-ID'),
                  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                });
              }
    
              localStorage.setItem('kuleather_service_orders', JSON.stringify(freshOrders));
              
              if (notificationMsg) {
                createSystemNotification(notificationMsg, 'service', 'var(--success)');
              }
    
              initializeWorkspace(ordId); // Reload data
            }
          } catch (innerErr) {
            console.error("Error inside simulation response timeout:", innerErr);
            if (typeof window.showToast === 'function') {
              window.showToast("Gagal memproses simulasi: " + innerErr.message, "error");
            }
          }
        }, 1500);
      } catch (err) {
        console.error("Error in triggerSimulationResponse:", err);
        if (typeof window.showToast === 'function') {
          window.showToast("Gagal memproses simulasi: " + err.message, "error");
        }
      }
    }

    renderWorkspace();

    // Render workspace contents
    function renderWorkspace() {
      // Reload order data to get fresh updates
      const freshOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const freshOrder = freshOrders.find(o => o.id === ordId);

      // 1. Sidebar Info Rendering
      // Timeline items status check
      const statuses = ['REQUEST_SENT', 'PENAWARAN_DIKIRIM', 'DIBAYAR_ESCROW', 'DIKERJAKAN', 'HASIL_DIKIRIM', 'SELESAI'];
      const currentStatusIdx = statuses.indexOf(freshOrder.status);

      statuses.forEach((st, idx) => {
        const item = document.getElementById(`tl-${st}`);
        const dateEl = document.getElementById(`tld-${st}`);

        if (item) {
          item.classList.remove('active', 'completed');
          if (idx === currentStatusIdx) {
            item.classList.add('active');
          } else if (idx < currentStatusIdx) {
            item.classList.add('completed');
          }
        }

        // Timeline date display matching logs
        const match = freshOrder.timeline.find(t => t.status === st);
        if (dateEl && match) {
          dateEl.textContent = match.date;
        }
      });

      // Service general info
      document.getElementById('side-service-name').textContent = freshOrder.serviceName;
      document.getElementById('side-seller-name').textContent = freshOrder.sellerName;
      document.getElementById('side-buyer-name').textContent = freshOrder.buyerName;

      // Revision limits rendering
      const revRatio = document.getElementById('side-revision-ratio');
      const revBar = document.getElementById('side-revision-bar');
      const revExtra = document.getElementById('side-extra-cost');

      revRatio.textContent = `${freshOrder.revisions.used} / ${freshOrder.revisions.max}`;
      revExtra.textContent = `${formatIDR(freshOrder.revisions.extraCost)} /revisi`;
      
      const ratioPct = Math.min((freshOrder.revisions.used / freshOrder.revisions.max) * 100, 100);
      revBar.style.width = `${ratioPct}%`;

      if (freshOrder.revisions.used >= freshOrder.revisions.max) {
        revBar.style.backgroundColor = 'var(--error)';
        revRatio.style.color = 'var(--error)';
      } else {
        revBar.style.backgroundColor = 'var(--accent)';
        revRatio.style.color = 'var(--accent)';
      }

      // Financial calculations
      document.getElementById('side-budget-val').textContent = formatIDR(freshOrder.request.budget);
      const dealValEl = document.getElementById('side-deal-val');
      const escrowStatusEl = document.getElementById('side-escrow-status');

      if (freshOrder.offer) {
        dealValEl.textContent = formatIDR(freshOrder.offer.finalPrice);
      } else {
        dealValEl.textContent = 'Menunggu Deal';
      }

      escrowStatusEl.textContent = freshOrder.escrow.status;
      if (freshOrder.escrow.status === 'DITAHAN') {
        escrowStatusEl.style.color = 'var(--warning)';
      } else if (freshOrder.escrow.status === 'DILEPAS') {
        escrowStatusEl.style.color = 'var(--success)';
      } else {
        escrowStatusEl.style.color = 'var(--error)';
      }

      // 2. Chat Log rendering
      document.getElementById('chat-header-order-id').textContent = `ORDER ID: ${freshOrder.id} · ${freshOrder.date}`;
      document.getElementById('chat-header-service-title').textContent = freshOrder.serviceName;
      
      const statusBadge = document.getElementById('chat-header-status-badge');
      statusBadge.textContent = translateStatus(freshOrder.status);

      // Messages Loop
      const chatContainer = document.getElementById('chat-messages-container');
      chatContainer.innerHTML = '';

      // Message 1: Initial Request Details Card
      let refImagesHtml = '';
      if (freshOrder.request.referenceImages && freshOrder.request.referenceImages.length > 0) {
        refImagesHtml = `
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top:8px;">
            ${freshOrder.request.referenceImages.map(img => `<img src="${img}" style="width:100%; max-height:100px; object-fit:cover; border:1px solid var(--muted-light);">`).join('')}
          </div>
        `;
      }

      const isBuyer = simulationUserRole === 'buyer';
      const requestAlignment = isBuyer ? 'outgoing' : 'incoming';
      chatContainer.innerHTML += `
        <div class="chat-bubble buyer ${requestAlignment}" style="width: 80%; max-width:85%;">
          <div style="font-weight: 700; border-bottom:1px solid var(--muted-light); padding-bottom:4px; margin-bottom:6px; font-size:11px;" class="text-accent">// DETAIL REQUEST CUSTOM AWAL</div>
          <div class="body-xs" style="line-height:1.4;">
            <strong>Deskripsi Custom:</strong> ${freshOrder.request.description}<br>
            <strong>Spesifikasi Ukuran:</strong> ${freshOrder.request.specifications}<br>
            <strong>Budget Diajukan:</strong> <span class="mono text-primary font-weight-bold">${formatIDR(freshOrder.request.budget)}</span><br>
            <strong>Catatan Tambahan:</strong> ${freshOrder.request.notes}
          </div>
          ${refImagesHtml}
          <div class="chat-bubble-meta">
            <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${isBuyer ? 'Saya' : freshOrder.buyerName}</span>
            <span style="flex-shrink:0;">${freshOrder.time}</span>
          </div>
        </div>
      `;

      // Render negotiations & messages chronological list
      // We will combine negotiations (offers/system events), progress logs, delivery results, and chat messages into a timeline list sorted by time.
      const chronologicalTimeline = [];

      // Add normal messages
      if (freshOrder.messages) {
        freshOrder.messages.forEach(m => {
          chronologicalTimeline.push({
            type: 'message',
            from: m.from,
            name: m.senderName,
            text: m.text,
            date: m.date,
            time: m.time,
            timestamp: parseTimestamp(m.date, m.time)
          });
        });
      }

      // Add negotiation logs (e.g. offers sent)
      if (freshOrder.negotiation) {
        // Skip first buyer offer since we render it as Request card above
        freshOrder.negotiation.slice(1).forEach(n => {
          chronologicalTimeline.push({
            type: 'nego',
            from: n.from,
            text: n.message,
            date: n.date,
            time: n.time || '10:00',
            timestamp: parseTimestamp(n.date, n.time || '10:00')
          });
        });
      }

      // Add WIP progress updates
      if (freshOrder.progress) {
        freshOrder.progress.forEach(p => {
          chronologicalTimeline.push({
            type: 'wip',
            from: 'seller',
            text: p.description,
            images: p.images || [],
            date: p.date,
            time: p.time || '12:00',
            timestamp: parseTimestamp(p.date, p.time || '12:00')
          });
        });
      }

      // Add Results Delivery
      if (freshOrder.results) {
        freshOrder.results.forEach(r => {
          chronologicalTimeline.push({
            type: 'delivery',
            from: 'seller',
            text: r.notes,
            images: r.images || [],
            date: r.date,
            time: r.time || '14:00',
            timestamp: parseTimestamp(r.date, r.time || '14:00')
          });
        });
      }

      // Add Revisions requested
      if (freshOrder.revisions && freshOrder.revisions.history) {
        freshOrder.revisions.history.forEach((rev, rIdx) => {
          chronologicalTimeline.push({
            type: 'revision',
            from: 'buyer',
            text: `Revisi #${rIdx + 1}: ${rev.request}`,
            date: rev.date || new Date().toLocaleDateString('id-ID'),
            time: rev.time || '15:00',
            timestamp: parseTimestamp(rev.date || new Date().toLocaleDateString('id-ID'), rev.time || '15:00')
          });
        });
      }

      // Sort timeline
      chronologicalTimeline.sort((a, b) => a.timestamp - b.timestamp);

      // Render timeline
      chronologicalTimeline.forEach(evt => {
        const isSelf = evt.from === simulationUserRole;
        const alignmentClass = isSelf ? 'outgoing' : 'incoming';

        if (evt.type === 'message') {
          const displayName = isSelf ? 'Saya' : (evt.name || (evt.from === 'seller' ? freshOrder.sellerName : freshOrder.buyerName));
          chatContainer.innerHTML += `
            <div class="chat-bubble ${evt.from === 'buyer' ? 'buyer' : 'seller'} ${alignmentClass}">
              <div class="body-xs">${evt.text}</div>
              <div class="chat-bubble-meta">
                <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${displayName}</span>
                <span style="flex-shrink:0;">${evt.time}</span>
              </div>
            </div>
          `;
        } else if (evt.type === 'nego') {
          const isOffer = evt.text.includes('mengirimkan penawaran');
          if (isOffer) {
            chatContainer.innerHTML += `
              <div class="chat-bubble seller ${alignmentClass}" style="width: 80%; max-width:85%;">
                <div style="font-weight: 700; border-bottom:1px solid var(--muted-light); padding-bottom:4px; margin-bottom:6px; font-size:11px;" class="text-accent">// PENAWARAN HARGA DAN KETENTUAN PENGERJAAN</div>
                <div class="body-xs" style="line-height:1.4;">
                  ${evt.text.replace(/\n/g, '<br>')}
                </div>
                <div class="chat-bubble-meta">
                  <span>Sistem Mitra</span>
                  <span>${evt.time}</span>
                </div>
              </div>
            `;
          } else {
            chatContainer.innerHTML += `
              <div class="chat-bubble ${evt.from === 'buyer' ? 'buyer' : 'seller'} ${alignmentClass}">
                <div class="body-xs"><strong>Negosiasi:</strong> ${evt.text}</div>
                <div class="chat-bubble-meta">
                  <span>Sistem</span>
                  <span>${evt.time}</span>
                </div>
              </div>
            `;
          }
        } else if (evt.type === 'wip') {
          let progressImgHtml = '';
          if (evt.images && evt.images.length > 0) {
            progressImgHtml = `<img src="${evt.images[0]}" style="width:100%; border:1px solid var(--muted-light); margin-top:6px; max-height:120px; object-fit:cover;">`;
          }
          chatContainer.innerHTML += `
            <div class="chat-bubble seller ${alignmentClass}" style="max-width: 80%; background-color: var(--surface); border: 1px solid var(--muted-light);">
              <span class="eyebrow" style="font-size: 8px; color: var(--accent); font-weight:700;">// UPDATE PROGRESS PROGRES PENGERJAAN</span>
              <div class="body-xs" style="margin-top:4px;">${evt.text}</div>
              ${progressImgHtml}
              <div class="chat-bubble-meta">
                <span>Pengrajin</span>
                <span>${evt.time}</span>
              </div>
            </div>
          `;
        } else if (evt.type === 'delivery') {
          let deliveryImgHtml = '';
          if (evt.images && evt.images.length > 0) {
            deliveryImgHtml = `<img src="${evt.images[0]}" style="width:100%; border:1px solid var(--muted-light); margin-top:6px; max-height:220px; object-fit:cover;">`;
          }
          chatContainer.innerHTML += `
            <div class="chat-bubble seller ${alignmentClass}" style="width:85%; max-width:85%; background-color: var(--surface); border: 2px solid var(--success);">
              <span class="badge" style="background-color: var(--success); color: white; border-radius:0; font-size:8px; margin-bottom:4px;">HASIL AKHIR DIKIRIM</span>
              <div class="body-xs" style="line-height:1.4; font-weight:500;">
                <strong>Catatan Pengiriman:</strong> ${evt.text}
              </div>
              ${deliveryImgHtml}
              <div class="chat-bubble-meta">
                <span>Diserahkan oleh Pengrajin</span>
                <span>${evt.time}</span>
              </div>
            </div>
          `;
        } else if (evt.type === 'revision') {
          chatContainer.innerHTML += `
            <div class="chat-bubble buyer ${alignmentClass}" style="width:80%; max-width:80%; border: 1px dashed var(--error);">
              <span class="badge" style="background-color: var(--error); color: white; border-radius:0; font-size:8px; margin-bottom:4px;">PERMINTAAN REVISI DIKIRIM</span>
              <div class="body-xs" style="line-height:1.4;">
                ${evt.text}
              </div>
              <div class="chat-bubble-meta">
                <span>Diajukan oleh Pembeli</span>
                <span>${evt.time}</span>
              </div>
            </div>
          `;
        }
      });

      // Auto scroll chat to bottom
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 50);

      // 3. Render Action Box actions
      renderActionBox(freshOrder);
    }

    // Helper timestamp parse
    function parseTimestamp(dateStr, timeStr) {
      try {
        if (!dateStr) return Date.now();
        if (!timeStr) timeStr = '00:00';
        
        let parts;
        if (dateStr.includes('/')) {
          parts = dateStr.split('/');
        } else {
          const months = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'Mei': '05', 'Jun': '06',
            'Jul': '07', 'Agu': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12'
          };
          const rawParts = dateStr.split(' ');
          const day = rawParts[0].padStart(2, '0');
          const month = months[rawParts[1]] || '01';
          const year = rawParts[2] || '2026';
          parts = [day, month, year];
        }
        
        const timeParts = timeStr.split(':');
        const hour = timeParts[0].padStart(2, '0');
        const min = timeParts[1].padStart(2, '0');
        
        const isoStr = `${parts[2]}-${parts[1]}-${parts[0]}T${hour}:${min}:00`;
        return new Date(isoStr).getTime();
      } catch (e) {
        return Date.now();
      }
    }

    // Render Action buttons based on Role and Status
    function renderActionBox(orderData) {
      const container = document.getElementById('chat-footer-actions-container');
      container.innerHTML = '';

      const isBuyer = simulationUserRole === 'buyer';

      if (orderData.status === 'REQUEST_SENT') {
        if (isBuyer) {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <div class="preloader-spinner" style="width:14px; height:14px; display:inline-block; margin-right:8px; vertical-align:middle;"></div>
              <span>Menunggu Pengrajin memberikan detail penawaran harga final dan kuota kerja...</span>
            </div>
          `;
        } else {
          // Seller form to send quote
          container.innerHTML = `
            <div class="action-box-form">
              <strong class="caption text-accent" style="font-weight:700;">FORM PENAWARAN HARGA MITRA</strong>
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label" style="font-size: 8px;">HARGA DEAL FINAL (RP)</label>
                  <input type="number" id="act-offer-price" class="form-input" style="width:100%;" value="${orderData.request.budget}" min="10000">
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size: 8px;">ESTIMASI WAKTU PENGERJAAN</label>
                  <input type="text" id="act-offer-time" class="form-input" style="width:100%;" value="14 hari kerja">
                </div>
              </div>
              <div class="grid-2 mt-xs">
                <div class="form-group">
                  <label class="form-label" style="font-size: 8px;">JUMLAH REVISI GRATIS</label>
                  <input type="number" id="act-offer-rev-max" class="form-input" style="width:100%;" value="${orderData.revisions.max}" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size: 8px;">BIAYA REVISI TAMBAHAN (RP)</label>
                  <input type="number" id="act-offer-rev-extra" class="form-input" style="width:100%;" value="${orderData.revisions.extraCost}" min="0">
                </div>
              </div>
              <div class="form-group mt-xs">
                <label class="form-label" style="font-size: 8px;">PESAN / CATATAN PENAWARAN</label>
                <textarea id="act-offer-notes" class="form-textarea" rows="2" style="width:100%;" placeholder="Saya siap memproses jaket rider domba ini dengan spesifikasi ukuran Anda..."></textarea>
              </div>
              <button class="btn btn-primary mt-sm" id="btn-submit-offer">KIRIM PENAWARAN KE PEMBELI</button>
            </div>
          `;

          document.getElementById('btn-submit-offer').addEventListener('click', () => {
            submitOfferQuote();
          });
        }
      } 
      else if (orderData.status === 'PENAWARAN_DIKIRIM') {
        if (isBuyer) {
          // Buyer can Accept, Nego, or Reject
          container.innerHTML = `
            <div class="action-box-form" style="background-color: var(--surface-hover); border-color: var(--accent);">
              <strong class="caption text-accent" style="font-weight:700;">REVIEW PENAWARAN PENGRAJIN</strong>
              <p class="body-xs text-secondary" style="font-size:12px; margin-bottom: 6px;">
                Pengrajin telah mengajukan penawaran harga sebesar <strong>${formatIDR(orderData.offer.finalPrice)}</strong> dengan estimasi waktu <strong>${orderData.offer.estimatedDays}</strong> dan kuota <strong>${orderData.offer.freeRevisions} kali revisi gratis</strong>.
              </p>
              
              <div id="nego-inputs-container" class="hidden flex-y gap-xs mb-sm" style="border-top:1px dashed var(--muted); padding-top:8px;">
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">TAWARAN BUDGET ANDA (RP)</label>
                  <input type="number" id="act-nego-price" class="form-input" style="width:100%;" value="${Math.round(orderData.offer.finalPrice * 0.9)}">
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">PESAN TAWARAN / ALASAN NEGO</label>
                  <input type="text" id="act-nego-msg" class="form-input" style="width:100%;" placeholder="Bisa turun harga sedikit ke nominal ini?">
                </div>
              </div>

              <div class="flex-x gap-sm" style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-sm" id="btn-buyer-nego-trigger" style="flex:1;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  NEGO HARGA (${3 - orderData.negotiationCount}x sisa)
                </button>
                <button class="btn btn-primary btn-sm" id="btn-buyer-accept" style="flex:1.5;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  TERIMA & DEAL
                </button>
                <button class="btn btn-ghost btn-sm text-error" id="btn-buyer-reject" style="flex:0.8;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  TOLAK
                </button>
              </div>
            </div>
          `;

          // Bind Nego trigger toggles
          const btnNegoTrigger = document.getElementById('btn-buyer-nego-trigger');
          const negoInputs = document.getElementById('nego-inputs-container');

          if (orderData.negotiationCount >= 3) {
            btnNegoTrigger.disabled = true;
            btnNegoTrigger.textContent = 'NEGO HABIS';
          }

          btnNegoTrigger.addEventListener('click', () => {
            if (negoInputs.classList.contains('hidden')) {
              negoInputs.classList.remove('hidden');
              btnNegoTrigger.textContent = 'KIRIM TAWARAN NEGO';
            } else {
              // Send counter offer nego
              submitCounterNego();
            }
          });

          document.getElementById('btn-buyer-accept').addEventListener('click', () => {
            acceptServiceQuote();
          });

          document.getElementById('btn-buyer-reject').addEventListener('click', () => {
            rejectServiceQuote();
          });

        } else {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <div class="preloader-spinner" style="width:14px; height:14px; display:inline-block; margin-right:8px; vertical-align:middle;"></div>
              <span>Penawaran terkirim. Menunggu respon review (Terima/Nego/Tolak) dari Pembeli...</span>
            </div>
          `;
        }
      }
      else if (orderData.status === 'DEAL') {
        if (isBuyer) {
          container.innerHTML = `
            <div class="action-box-form" style="background-color: var(--surface-hover); border-color: var(--accent);">
              <strong class="caption text-accent" style="font-weight:700;">AMANKAN PEMBAYARAN ESCROW</strong>
              <p class="body-xs text-secondary" style="font-size:12px; margin-bottom:8px;">
                Penawaran deal disepakati! Silakan depositkan dana sebesar <strong>${formatIDR(orderData.offer.finalPrice)}</strong> ke escrow Kuleather untuk mengunci pengerjaan oleh pengrajin.
              </p>
              <button class="btn btn-primary" id="btn-buyer-pay-escrow">BAYAR SEKARANG via ESCROW</button>
            </div>
          `;

          document.getElementById('btn-buyer-pay-escrow').addEventListener('click', () => {
            payEscrowDeposit();
          });
        } else {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <div class="preloader-spinner" style="width:14px; height:14px; display:inline-block; margin-right:8px; vertical-align:middle;"></div>
              <span>Penawaran Deal! Menunggu Pembeli mengamankan deposit ke Escrow Kuleather...</span>
            </div>
          `;
        }
      }
      else if (orderData.status === 'DIBAYAR_ESCROW') {
        if (isBuyer) {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--success); display:inline-block; margin-right:6px; vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Dana Anda disimpan di Escrow. Menunggu Pengrajin menekan tombol Mulai Pengerjaan...</span>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="action-box-form">
              <strong class="caption text-success" style="font-weight:700;">DEPOSIT ESCROW DITERIMA</strong>
              <p class="body-xs text-secondary" style="font-size:11px; margin-bottom:8px;">
                Dana pembayaran pembeli telah diamankan di Escrow platform. Silakan mulai pengerjaan kustom Anda sekarang.
              </p>
              <button class="btn btn-primary" id="btn-seller-start">MULAI PENGERJAAN FISIK</button>
            </div>
          `;

          document.getElementById('btn-seller-start').addEventListener('click', () => {
            startSellerWork();
          });
        }
      }
      else if (orderData.status === 'DIKERJAKAN') {
        if (isBuyer) {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <div class="preloader-spinner" style="width:14px; height:14px; display:inline-block; margin-right:8px; vertical-align:middle;"></div>
              <span>Pesanan sedang dikerjakan. Anda dapat berdiskusi via komentar chat di atas...</span>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="action-box-form">
              <strong class="caption text-accent" style="font-weight:700;">UPDATE PROGRES DAN SERAHKAN HASIL</strong>
              <div class="flex-x gap-sm" style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-sm" id="btn-trigger-wip" style="flex:1;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  UPDATE PROGRES (WIP)
                </button>
                <button class="btn btn-primary btn-sm" id="btn-trigger-delivery" style="flex:1;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                  KIRIM HASIL AKHIR
                </button>
              </div>

              <!-- Form collapse WIP -->
              <div id="wip-inputs-container" class="hidden flex-y gap-xs mt-sm" style="border-top:1px dashed var(--muted); padding-top:8px;">
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">DESKRIPSI AKTIVITAS PROGRESS</label>
                  <input type="text" id="act-wip-desc" class="form-input" style="width:100%;" placeholder="Contoh: Pola kulit sudah dipotong & siap dijahit...">
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">FOTO PROGRESS</label>
                  <select id="act-wip-photo" class="form-select" style="width:100%;">
                    <option value="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80">Foto Pemotongan Pola Jaket</option>
                    <option value="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80">Foto Perakitan Jahitan Tas</option>
                    <option value="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80">Foto Rekat Sol Sol Sepatu</option>
                  </select>
                </div>
                <button class="btn btn-secondary btn-sm mt-xs" id="btn-submit-wip">KIRIM FOTO PROGRESS</button>
              </div>

              <!-- Form collapse Delivery -->
              <div id="delivery-inputs-container" class="hidden flex-y gap-xs mt-sm" style="border-top:1px dashed var(--muted); padding-top:8px;">
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">CATATAN PENYERAHAN HASIL AKHIR</label>
                  <textarea id="act-del-notes" class="form-textarea" rows="2" style="width:100%;" placeholder="Jaket kulit kustom Anda sudah selesai dijahit dengan rapi dan lulus QC..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size:8px;">GAMBAR PRODUK JADI</label>
                  <select id="act-del-photo" class="form-select" style="width:100%;">
                    <option value="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80">Hasil Jadi Jaket Premium Domba Garut</option>
                    <option value="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80">Hasil Jadi Messenger Bag Leather Pull-up</option>
                    <option value="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80">Hasil Jadi Sepatu Loafer Tan Selesai Sol</option>
                  </select>
                </div>
                <button class="btn btn-primary btn-sm mt-xs" id="btn-submit-delivery">KIRIM PRODUK JADI SELESAI</button>
              </div>
            </div>
          `;

          const btnTriggerWip = document.getElementById('btn-trigger-wip');
          const btnTriggerDelivery = document.getElementById('btn-trigger-delivery');
          const wipContainer = document.getElementById('wip-inputs-container');
          const deliveryContainer = document.getElementById('delivery-inputs-container');

          btnTriggerWip.addEventListener('click', () => {
            wipContainer.classList.remove('hidden');
            deliveryContainer.classList.add('hidden');
          });

          btnTriggerDelivery.addEventListener('click', () => {
            deliveryContainer.classList.remove('hidden');
            wipContainer.classList.add('hidden');
          });

          document.getElementById('btn-submit-wip').addEventListener('click', () => {
            submitWipUpdate();
          });

          document.getElementById('btn-submit-delivery').addEventListener('click', () => {
            submitDeliveryResults();
          });
        }
      }
      else if (orderData.status === 'HASIL_DIKIRIM') {
        if (isBuyer) {
          // Buyer can Accept or Request Revision (NO Dispute/Komplain)
          let revisionInputsHtml = '';
          const used = orderData.revisions.used;
          const max = orderData.revisions.max;
          const extraCost = orderData.revisions.extraCost;
          
          if (used < max) {
            // Normal revision text area
            revisionInputsHtml = `
              <div id="revision-inputs-container" class="hidden flex-y gap-xs mb-sm" style="border-top:1px dashed var(--muted-light); padding-top:8px;">
                <div class="form-group">
                  <label class="form-label" style="font-size:8px; font-weight:700;">DESKRIPSI PERBAIKAN REVISI YANG DIMINTA</label>
                  <textarea id="act-rev-desc" class="form-textarea" rows="2" style="width:100%; padding:8px; border:1px solid var(--border-medium); border-radius:var(--radius-md);" placeholder="Tolong rapihkan jahitan di kantong saku sebelah kanan bawah..."></textarea>
                </div>
                <button class="btn btn-secondary btn-sm mt-xs" id="btn-submit-revision-request" style="font-size:10px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:4px; vertical-align:middle;"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  KIRIM PERMINTAAN REVISI
                </button>
              </div>
            `;
          } else {
            // Mini payment wizard for extra revision
            if (revisionPayStep === 1) {
              revisionInputsHtml = `
                <div id="revision-inputs-container" class="hidden flex-y gap-xs mb-sm" style="border-top:1px dashed var(--muted-light); padding-top:8px;">
                  <div style="background-color: var(--error-bg); border: 1px solid var(--error); padding: 8px var(--space-md); border-radius: var(--radius-md); font-size:11px; margin-bottom:8px; color: var(--error);">
                    ⚠️ Kuota revisi gratis Anda telah habis (<strong>${used}/${max}</strong>). Pembayaran sebesar <strong>${formatIDR(extraCost)}</strong> diperlukan untuk pengajuan revisi tambahan.
                  </div>
                  <label class="form-label" style="font-size:8px; font-weight:700;">PILIH METODE PEMBAYARAN REVISI</label>
                  <div class="payment-card-grid mb-sm" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-bottom:12px;">
                    <label class="payment-card ${selectedRevisionPayMethod === 'QRIS' ? 'selected' : ''}" style="padding: 8px; position:relative; cursor:pointer; border: 1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column;">
                      <input type="radio" name="rev-pay-method" value="QRIS" ${selectedRevisionPayMethod === 'QRIS' ? 'checked' : ''} style="position:absolute; right:6px; top:6px;">
                      <span style="font-weight:700; font-size:11px;">QRIS (GPN)</span>
                      <span style="font-size:9px; color:var(--text-muted);">Instan</span>
                    </label>
                    <label class="payment-card ${selectedRevisionPayMethod === 'BCA Virtual Account' ? 'selected' : ''}" style="padding: 8px; position:relative; cursor:pointer; border: 1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column;">
                      <input type="radio" name="rev-pay-method" value="BCA Virtual Account" ${selectedRevisionPayMethod === 'BCA Virtual Account' ? 'checked' : ''} style="position:absolute; right:6px; top:6px;">
                      <span style="font-weight:700; font-size:11px;">BCA VA</span>
                      <span style="font-size:9px; color:var(--text-muted);">Otomatis</span>
                    </label>
                    <label class="payment-card ${selectedRevisionPayMethod === 'GoPay' ? 'selected' : ''}" style="padding: 8px; position:relative; cursor:pointer; border: 1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column;">
                      <input type="radio" name="rev-pay-method" value="GoPay" ${selectedRevisionPayMethod === 'GoPay' ? 'checked' : ''} style="position:absolute; right:6px; top:6px;">
                      <span style="font-weight:700; font-size:11px;">GoPay</span>
                      <span style="font-size:9px; color:var(--text-muted);">Instan</span>
                    </label>
                    <label class="payment-card ${selectedRevisionPayMethod === 'OVO' ? 'selected' : ''}" style="padding: 8px; position:relative; cursor:pointer; border: 1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column;">
                      <input type="radio" name="rev-pay-method" value="OVO" ${selectedRevisionPayMethod === 'OVO' ? 'checked' : ''} style="position:absolute; right:6px; top:6px;">
                      <span style="font-weight:700; font-size:11px;">OVO</span>
                      <span style="font-size:9px; color:var(--text-muted);">Instan</span>
                    </label>
                  </div>
                  <button class="btn btn-primary btn-sm" id="btn-next-rev-pay" style="font-size:10px; width:100%;">LANJUTKAN PEMBAYARAN REVISI</button>
                </div>
              `;
            } else if (revisionPayStep === 2) {
              let instructionsHtml = '';
              if (selectedRevisionPayMethod === 'QRIS') {
                instructionsHtml = `
                  <div class="flex-y align-center text-center gap-xs" style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px;">
                    <p class="body-xs text-secondary" style="font-size:11px;">Scan kode QRIS di bawah ini sebesar <strong>${formatIDR(extraCost)}</strong>:</p>
                    <div style="background: white; padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-medium); width: fit-content;">
                      <svg width="100" height="100" viewBox="0 0 29 29" style="display: block; shape-rendering: crispEdges; fill: #000000;">
                        <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h1v1h-1zm1 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm1 0h4v7h-4zm1 1v5h2V1zm5 0h1v1h-1zm-6 2h1v1H-1zm2 0h1v1h-1zm1 0h2v2h-1v-1h-1zm-3 1h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-9 2h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v2h-1zm2 0h1v1h-1zm1 0h2v1h-2zm-3 1h2v1h-2zm4 0h1v1h-1zm1 0h1v1h-1zm-11 1h1v1H8zm5 0h2v1h-2zm3 0h1v1h-1zm1 0h1v1h-1zm1 0h2v1h-2zm-14 1h7v7H0zm1 1v5h5V9zm8 0h1v1H9zm1 0h2v1h-2zm3 0h1v2h-1v-1zm1 0h1v1h-1zm2 0h2v1h-2zm1 0h1v2h-1zm-6 1h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm-6 1h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm-7 1h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm2 0h2v1H4zm3 0h1v1H7zm1 0h2v1H8zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h2v1h-2zm-13 1h1v1H1zm2 0h1v1H3zm1 0h1v1H4zm3 0h1v1H7zm2 0h2v1H9zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm3 0h1v1H5zm1 0h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-15 1h1v1H0zm2 0h1v1H2zm2 0h1v1H4zm2 0h1v1H6zm2 0h1v1H8zm1 0h2v1H9zm3 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1z"/>
                      </svg>
                    </div>
                  </div>
                `;
              } else if (selectedRevisionPayMethod.includes('Virtual Account')) {
                const bankName = selectedRevisionPayMethod.split(' ')[0];
                const vaNumber = `88012${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                instructionsHtml = `
                  <div style="background: var(--bg-alt); padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display:flex; flex-direction:column; gap:2px; font-size:11px;">
                    <span class="caption text-muted" style="font-size:8px;">BANK VA TUJUAN</span>
                    <strong style="color:var(--text-primary);">${bankName} Virtual Account</strong>
                    <span class="caption text-muted" style="font-size:8px; margin-top:6px;">NOMOR VIRTUAL ACCOUNT</span>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <strong class="mono" style="font-size:13px; color:var(--accent);">${vaNumber}</strong>
                      <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${vaNumber}'); window.showToast('Nomor VA disalin!', 'info');" style="padding: 2px 6px; font-size: 8px; min-height:unset; height:fit-content;">SALIN</button>
                    </div>
                    <span class="caption text-muted" style="font-size:8px; margin-top:6px;">TOTAL TAGIHAN</span>
                    <strong class="mono text-primary">${formatIDR(extraCost)}</strong>
                  </div>
                `;
              } else {
                instructionsHtml = `
                  <div class="flex-y gap-xs" style="display:flex; flex-direction:column; gap:4px; font-size:11px;">
                    <p class="body-xs text-secondary">Masukkan nomor handphone terdaftar <strong>${selectedRevisionPayMethod}</strong>:</p>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <span style="background: var(--bg-alt); border: 1px solid var(--border-medium); padding: 4px 8px; border-radius: var(--radius-md); font-weight:700; font-size:11px;">+62</span>
                      <input type="tel" id="ewallet-rev-phone" class="form-input" style="flex:1; padding:4px 8px; font-size:11px; border-radius:var(--radius-md);" placeholder="81234567890" value="81294857283">
                    </div>
                  </div>
                `;
              }
              
              revisionInputsHtml = `
                <div id="revision-inputs-container" class="hidden flex-y gap-xs mb-sm" style="border-top:1px dashed var(--muted-light); padding-top:8px;">
                  <strong class="caption text-accent" style="font-size:10px;">Instruksi Pembayaran - ${selectedRevisionPayMethod}</strong>
                  ${instructionsHtml}
                  <div class="flex-x gap-sm mt-xs" style="display:flex; gap:8px; margin-top:6px;">
                    <button class="btn btn-secondary btn-sm" id="btn-back-rev-pay" style="flex:1; padding:6px 10px; font-size:10px;">Kembali</button>
                    <button class="btn btn-primary btn-sm" id="btn-confirm-rev-pay" style="flex:1.5; padding:6px 10px; font-size:10px;">Konfirmasi & Bayar</button>
                  </div>
                </div>
              `;
            }
          }

          container.innerHTML = `
            <div class="action-box-form" style="background-color: var(--surface-hover); border-color: var(--success);">
              <strong class="caption text-success" style="font-weight:700;">PRODUK SELESAI DIKIRIM - REVIEW HASIL</strong>
              <p class="body-xs text-secondary" style="font-size:11px; margin-bottom:8px;">
                Pengrajin telah menyerahkan hasil jadi pengerjaan kustom. Silakan periksa detailnya. Anda dapat menerima hasil atau meminta revisi.
              </p>
              
              <!-- Injected Revision Details or Payment Wizard -->
              ${revisionInputsHtml}

              <div class="flex-x gap-sm" style="display:flex; gap:8px; margin-top:12px;">
                <button class="btn btn-secondary btn-sm" id="btn-buyer-revision-trigger" style="flex:1;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:6px; vertical-align:middle;"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  MINTA REVISI
                </button>
                <button class="btn btn-primary btn-sm" id="btn-buyer-approve-delivery" style="flex:1.5;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; margin-right:6px; vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  TERIMA & SELESAIKAN
                </button>
              </div>
            </div>
          `;

          const btnRevTrigger = document.getElementById('btn-buyer-revision-trigger');
          const revContainer = document.getElementById('revision-inputs-container');

          if (btnRevTrigger && revContainer) {
            btnRevTrigger.addEventListener('click', () => {
              revContainer.classList.toggle('hidden');
            });
          }

          if (revisionPayStep > 1 && revContainer) {
            revContainer.classList.remove('hidden');
          }

          const btnSubmitRevision = document.getElementById('btn-submit-revision-request');
          if (btnSubmitRevision) {
            btnSubmitRevision.addEventListener('click', () => {
              submitRevisionRequest();
            });
          }

          const btnNextRevPay = document.getElementById('btn-next-rev-pay');
          if (btnNextRevPay) {
            btnNextRevPay.addEventListener('click', () => {
              revisionPayStep = 2;
              renderWorkspace();
            });

            const revCards = document.querySelectorAll('#revision-inputs-container .payment-card');
            revCards.forEach(card => {
              card.addEventListener('click', () => {
                revCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const radio = card.querySelector('input[type="radio"]');
                if (radio) {
                  radio.checked = true;
                  selectedRevisionPayMethod = radio.value;
                }
              });
            });
          }

          const btnBackRevPay = document.getElementById('btn-back-rev-pay');
          if (btnBackRevPay) {
            btnBackRevPay.addEventListener('click', () => {
              revisionPayStep = 1;
              renderWorkspace();
            });
          }

          const btnConfirmRevPay = document.getElementById('btn-confirm-rev-pay');
          if (btnConfirmRevPay) {
            btnConfirmRevPay.addEventListener('click', () => {
              const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
              const idx = allOrders.findIndex(o => o.id === ordId);
              if (idx !== -1) {
                const extraCost = allOrders[idx].revisions.extraCost;
                allOrders[idx].revisions.max += 1;
                allOrders[idx].offer.finalPrice += extraCost;
                allOrders[idx].escrow.amount += extraCost;
                allOrders[idx].escrow.sellerReceives += (extraCost * 0.95);
                allOrders[idx].escrow.platformFee += (extraCost * 0.05);

                allOrders[idx].negotiation.push({
                  from: "buyer",
                  message: `Melakukan pembayaran biaya revisi tambahan berhasil sebesar ${formatIDR(extraCost)} via ${selectedRevisionPayMethod}. Kuota revisi ditambahkan (+1).`,
                  date: new Date().toLocaleDateString('id-ID'),
                  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                });

                localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
                window.showToast('Pembayaran revisi tambahan berhasil! Kuota ditambahkan.', 'success');
                
                revisionPayStep = 1;
                initializeWorkspace(ordId);

                setTimeout(() => {
                  if (triggerSimulationResponseFn) {
                    triggerSimulationResponseFn(`[Pembayaran Revisi via ${selectedRevisionPayMethod}]`);
                  }
                }, 1000);
              }
            });
          }

          document.getElementById('btn-buyer-approve-delivery').addEventListener('click', () => {
            approveDeliveryComplete();
          });
        } else {
          container.innerHTML = `
            <div class="caption text-muted" style="text-align:center; padding:12px 0;">
              <div class="preloader-spinner" style="width:14px; height:14px; display:inline-block; margin-right:8px; vertical-align:middle;"></div>
              <span>Hasil jadi selesai terkirim. Menunggu konfirmasi kelayakan atau permintaan revisi dari Pembeli...</span>
            </div>
          `;
        }
      }
      else if (orderData.status === 'SELESAI') {
        container.innerHTML = `
          <div style="background-color: var(--success-bg); border:1px solid var(--success); padding:10px; display:flex; justify-content:space-between; align-items:center; width:100%;">
            <div>
              <strong class="body-xs text-success" style="font-weight:700;">TRANSAKSI CUSTOM SELESAI</strong>
              <p class="caption text-secondary" style="font-size:10px; margin-top:2px;">Dana escrow telah dicairkan ke saldo keuangan pengrajin.</p>
            </div>
            ${isBuyer ? `<button class="btn btn-primary btn-sm" id="btn-leave-review" style="padding:6px 12px; font-size:10px;">BERIKAN RATING</button>` : ''}
          </div>
        `;

        if (isBuyer) {
          document.getElementById('btn-leave-review').addEventListener('click', () => {
            leaveServiceReview();
          });
        }
      }
      else if (orderData.status === 'DIBATALKAN') {
        container.innerHTML = `
          <div style="background-color: var(--error-bg); border:1px solid var(--error); padding:10px; text-align:center; width:100%;" class="text-error font-weight-bold body-xs">
            Transaksi Custom telah dibatalkan / ditolak.
          </div>
        `;
      }
      else if (orderData.status === 'DISPUTE') {
        container.innerHTML = `
          <div style="background-color: var(--warning-bg); border:1px solid var(--warning); padding:10px; text-align:center; width:100%;" class="text-secondary font-weight-bold body-xs">
            ⚠️ Status Komplain Mediasi Admin. Peninjauan kelayakan revisi sedang ditangani platform.
          </div>
        `;
      }
    }

    // ==========================================================================
    // ACTION HANDLERS
    // ==========================================================================

    // A. SELLER: Submit Penawaran
    function submitOfferQuote() {
      const price = parseInt(document.getElementById('act-offer-price').value, 10);
      const time = document.getElementById('act-offer-time').value.trim();
      const revMax = parseInt(document.getElementById('act-offer-rev-max').value, 10);
      const revExtra = parseInt(document.getElementById('act-offer-rev-extra').value, 10);
      const notes = document.getElementById('act-offer-notes').value.trim() || 'Saya siap memproses pesanan kustom Anda.';

      if (price <= 0 || time === '') {
        window.showToast('Harga dan estimasi wajib diisi.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        allOrders[idx].status = 'PENAWARAN_DIKIRIM';
        allOrders[idx].offer = {
          finalPrice: price,
          estimatedDays: time,
          freeRevisions: revMax,
          extraRevisionCost: revExtra,
          notes: notes
        };
        allOrders[idx].revisions.max = revMax;
        allOrders[idx].revisions.extraCost = revExtra;

        allOrders[idx].negotiation.push({
          from: "seller",
          message: `Mengirimkan penawaran harga final sebesar ${formatIDR(price)} dengan estimasi pengerjaan ${time}. Batas revisi gratis: ${revMax} kali (Revisi tambahan: ${formatIDR(revExtra)} /revisi).\nCatatan: "${notes}"`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        allOrders[idx].timeline.push({
          status: "PENAWARAN_DIKIRIM",
          date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: "Penawaran harga dari pengrajin dikirim."
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Penawaran final terkirim ke pembeli.', 'success');
        
        // Notification for buyer
        createSystemNotification(`Pengrajin mengirimkan penawaran kustom untuk #${ordId}.`, 'service', 'var(--accent)');

        initializeWorkspace(ordId); // Reload
      }
    }

    // B. BUYER: Counter Nego
    function submitCounterNego() {
      const counterPrice = parseInt(document.getElementById('act-nego-price').value, 10);
      const counterMsg = document.getElementById('act-nego-msg').value.trim() || 'Bisa kurang sedikit harganya?';

      if (counterPrice <= 0) {
        window.showToast('Masukkan nominal tawaran yang valid.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        const count = allOrders[idx].negotiationCount || 0;
        if (count >= 3) {
          window.showToast('Batas kuota tawar/nego harga Anda sudah habis (maksimal 3x).', 'error');
          return;
        }

        allOrders[idx].status = 'REQUEST_SENT'; // Send back to request state
        allOrders[idx].negotiationCount = count + 1;
        
        // Update request budget to counter
        allOrders[idx].request.budget = counterPrice;
        allOrders[idx].offer = null; // Reset seller quote for re-quote

        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Menolak penawaran seller dan mengajukan counter-nego budget baru sebesar ${formatIDR(counterPrice)}.\nPesan: "${counterMsg}"`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Counter nego berhasil dikirim ke pengrajin.', 'success');

        createSystemNotification(`Pembeli mengajukan counter nego harga untuk #${ordId}.`, 'service', 'var(--warning)');

        initializeWorkspace(ordId);
      }
    }

    // C. BUYER: Accept Quote
    function acceptServiceQuote() {
      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        allOrders[idx].status = 'DEAL';
        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Menyetujui penawaran pengrajin. Transaksi siap dibayar ke escrow.`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Penawaran disetujui! Silakan lanjutkan pembayaran.', 'success');
        
        initializeWorkspace(ordId);
      }
    }

    // D. BUYER: Reject request
    function rejectServiceQuote() {
      const reason = prompt('Masukkan alasan penolakan request jasa ini:');
      if (reason === null) return;
      if (reason.trim() === '') {
        window.showToast('Alasan penolakan wajib diisi.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        allOrders[idx].status = 'DIBATALKAN';
        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Menolak/Membatalkan pengerjaan kustom. Alasan: "${reason}"`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Request jasa dibatalkan.', 'info');
        initializeWorkspace(ordId);
      }
    }

    // E. BUYER: Pay Escrow
    function payEscrowDeposit() {
      // Always read fresh from localStorage to avoid stale closure data
      const freshOrders2 = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const freshOrder2 = freshOrders2.find(o => o.id === ordId);
      const dealAmt = freshOrder2 && freshOrder2.offer ? freshOrder2.offer.finalPrice : (freshOrder2 ? freshOrder2.request.budget : 0);
      const modalAmountEl = document.getElementById('escrow-modal-amount');
      if (modalAmountEl) {
        modalAmountEl.textContent = formatIDR(dealAmt);
      }
      if (paymentModal) {
        paymentModal.classList.remove('hidden');
      }
    }

    // F. SELLER: Start Work
    function startSellerWork() {
      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        allOrders[idx].status = 'DIKERJAKAN';
        allOrders[idx].timeline.push({
          status: "DIKERJAKAN",
          date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: "Pengerjaan fisik oleh pengrajin dimulai."
        });

        allOrders[idx].negotiation.push({
          from: "seller",
          message: `Memulai pengerjaan kustom kerajinan kulit Anda. Estimasi selesai disinkronkan.`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Status pengerjaan dimulai!', 'success');
        initializeWorkspace(ordId);
      }
    }

    // G. SELLER: Update WIP Progress
    function submitWipUpdate() {
      const desc = document.getElementById('act-wip-desc').value.trim();
      const photo = document.getElementById('act-wip-photo').value;

      if (desc === '') {
        window.showToast('Tulis deskripsi progres pengerjaan.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        if (!allOrders[idx].progress) allOrders[idx].progress = [];

        allOrders[idx].progress.push({
          description: desc,
          images: [photo],
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Update progress WIP terkirim.', 'success');
        document.getElementById('act-wip-desc').value = '';
        initializeWorkspace(ordId);
      }
    }

    // H. SELLER: Deliver Results (Final)
    function submitDeliveryResults() {
      const notes = document.getElementById('act-del-notes').value.trim();
      const photo = document.getElementById('act-del-photo').value;

      if (notes === '') {
        window.showToast('Masukkan catatan penyerahan hasil jadi.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        if (!allOrders[idx].results) allOrders[idx].results = [];

        allOrders[idx].status = 'HASIL_DIKIRIM';
        allOrders[idx].results.push({
          notes: notes,
          images: [photo],
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        allOrders[idx].timeline.push({
          status: "HASIL_DIKIRIM",
          date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: "Hasil akhir jadi diserahkan pengrajin."
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Hasil akhir selesai diserahkan ke pembeli!', 'success');
        
        createSystemNotification(`Hasil pengerjaan kustom #${ordId} telah diserahkan. Perlu review Anda.`, 'service', 'var(--success)');

        initializeWorkspace(ordId);
      }
    }

    // I. BUYER: Request Revision
    function submitRevisionRequest() {
      const revText = document.getElementById('act-rev-desc').value.trim();
      if (revText === '') {
        window.showToast('Tuliskan detail perbaikan revisi secara jelas.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        const used = allOrders[idx].revisions.used;
        const max = allOrders[idx].revisions.max;
        const extraCost = allOrders[idx].revisions.extraCost;

        if (used >= max) {
          // Extra revision payment simulation
          if (!confirm(`Kuota revisi gratis habis. Anda akan dikenakan tagihan tambahan sebesar ${formatIDR(extraCost)} untuk request revisi ini. Lanjutkan?`)) {
            return;
          }
          // Increment cost
          allOrders[idx].offer.finalPrice += extraCost;
          allOrders[idx].escrow.amount += extraCost;
          allOrders[idx].escrow.sellerReceives += (extraCost * 0.95);
          allOrders[idx].escrow.platformFee += (extraCost * 0.05);
        }

        allOrders[idx].status = 'DIKERJAKAN'; // Set back to progress state
        allOrders[idx].revisions.used = used + 1;
        
        if (!allOrders[idx].revisions.history) allOrders[idx].revisions.history = [];
        allOrders[idx].revisions.history.push({
          request: revText,
          status: "done",
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Mengajukan Permintaan Revisi Baru: "${revText}"`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Permintaan revisi terkirim ke pengrajin.', 'success');
        
        createSystemNotification(`Pembeli mengajukan revisi pengerjaan untuk #${ordId}.`, 'service', 'var(--error)');

        initializeWorkspace(ordId);
      }
    }

    // J. BUYER: Approve & Complete
    function approveDeliveryComplete() {
      if (confirm('Apakah Anda yakin menyetujui hasil pengerjaan kustom ini dan menyelesaikan transaksi? Dana escrow akan dilepas sepenuhnya ke pengrajin.')) {
        const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
        const idx = allOrders.findIndex(o => o.id === ordId);

        if (idx !== -1) {
          allOrders[idx].status = 'SELESAI';
          allOrders[idx].escrow.status = 'DILEPAS';
          
          allOrders[idx].timeline.push({
            status: "SELESAI",
            date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            text: "Order selesai disetujui pembeli."
          });

          allOrders[idx].negotiation.push({
            from: "buyer",
            message: `Menyetujui pengerjaan selesai. Terima kasih atas kerja samanya!`,
            date: new Date().toLocaleDateString('id-ID'),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          });

          // Add to buyer loyalty points
          let usersList = JSON.parse(localStorage.getItem('kuleather_users')) || [];
          const buyerIdx = usersList.findIndex(u => u.id === order.buyerId);
          if (buyerIdx !== -1) {
            const pointsGained = Math.round(allOrders[idx].offer.finalPrice / 10000); // 1 point per 10k Rp
            usersList[buyerIdx].points = (usersList[buyerIdx].points || 0) + pointsGained;
            localStorage.setItem('kuleather_users', JSON.stringify(usersList));
          }

          // Transfer earnings to seller account balance
          // Update total orders for the service
          const svcIdx = SERVICES.findIndex(s => s.id === order.serviceId);
          if (svcIdx !== -1) {
            SERVICES[svcIdx].totalOrders = (SERVICES[svcIdx].totalOrders || 0) + 1;
            localStorage.setItem('kuleather_services', JSON.stringify(SERVICES));
          }

          localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
          window.showToast('Transaksi kustom diselesaikan! Dana diteruskan.', 'success');

          createSystemNotification(`Transaksi custom #${ordId} selesai disetujui.`, 'service', 'var(--success)');

          initializeWorkspace(ordId);
        }
      }
    }

    // K. BUYER: Dispute Mediation
    function disputeOrderMediate() {
      const reason = prompt('Masukkan alasan mengajukan komplain/dispute mediasi platform:');
      if (reason === null) return;
      if (reason.trim() === '') {
        window.showToast('Alasan komplain wajib diisi.', 'error');
        return;
      }

      const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
      const idx = allOrders.findIndex(o => o.id === ordId);

      if (idx !== -1) {
        allOrders[idx].status = 'DISPUTE';
        allOrders[idx].negotiation.push({
          from: "buyer",
          message: `Mengajukan Dispute Mediasi Admin. Alasan: "${reason}"`,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
        window.showToast('Komplain terkirim. Admin platform akan segera menengahi.', 'warning');
        initializeWorkspace(ordId);
      }
    }

    // L. BUYER: Leave Review
    function leaveServiceReview() {
      const reviewModal = document.getElementById('review-rating-modal');
      const ratingInput = document.getElementById('selected-rating-value');
      const commentInput = document.getElementById('review-comment-text');
      const stars = document.querySelectorAll('#review-rating-modal .star-item');

      if (commentInput) commentInput.value = '';
      if (ratingInput) ratingInput.value = '5';

      if (stars) {
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-rating'), 10);
          if (sVal <= 5) {
            s.style.color = 'var(--accent)';
          } else {
            s.style.color = 'var(--muted-light)';
          }
        });
      }

      if (reviewModal) {
        reviewModal.classList.remove('hidden');
      }
    }

    // Set up star selection globally (once)
    const stars = document.querySelectorAll('#review-rating-modal .star-item');
    const ratingInput = document.getElementById('selected-rating-value');
    
    if (stars && ratingInput) {
      stars.forEach(star => {
        star.addEventListener('click', () => {
          const rating = parseInt(star.getAttribute('data-rating'), 10);
          ratingInput.value = rating;
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-rating'), 10);
            if (sVal <= rating) {
              s.style.color = 'var(--accent)';
            } else {
              s.style.color = 'var(--muted-light)';
            }
          });
        });

        star.addEventListener('mouseover', () => {
          const rating = parseInt(star.getAttribute('data-rating'), 10);
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-rating'), 10);
            if (sVal <= rating) {
              s.style.color = 'var(--accent)';
            } else {
              s.style.color = 'var(--muted-light)';
            }
          });
        });
      });

      const starContainer = (typeof document.querySelector === 'function') ? document.querySelector('#review-rating-modal .star-rating-selector') : null;
      if (starContainer) {
        starContainer.addEventListener('mouseleave', () => {
          const currentRating = parseInt(ratingInput.value, 10) || 5;
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-rating'), 10);
            if (sVal <= currentRating) {
              s.style.color = 'var(--accent)';
            } else {
              s.style.color = 'var(--muted-light)';
            }
          });
        });
      }
    }

    // Submit review click handler setup (global)
    const btnSubmitReview = document.getElementById('btn-submit-review-modal');
    if (btnSubmitReview && !btnSubmitReview._dataBound) {
      btnSubmitReview._dataBound = true;
      if (typeof btnSubmitReview.addEventListener === 'function') {
        btnSubmitReview.addEventListener('click', () => {
          const ratingVal = parseInt(ratingInput.value, 10) || 5;
          const commentVal = document.getElementById('review-comment-text').value.trim();

          if (commentVal === '') {
            window.showToast('Silakan tulis ulasan terlebih dahulu.', 'warning');
            return;
          }

          const allSvcs = JSON.parse(localStorage.getItem('kuleather_services')) || [];
          const idx = allSvcs.findIndex(s => s.id === order.serviceId);
          if (idx !== -1) {
            const oldRating = allSvcs[idx].rating || 5.0;
            const newRating = ((oldRating * 4) + ratingVal) / 5;
            allSvcs[idx].rating = parseFloat(newRating.toFixed(1));
            localStorage.setItem('kuleather_services', JSON.stringify(allSvcs));
          }

          const allOrders = JSON.parse(localStorage.getItem('kuleather_service_orders')) || [];
          const orderIdx = allOrders.findIndex(o => o.id === ordId);
          if (orderIdx !== -1) {
            allOrders[orderIdx].review = {
              rating: ratingVal,
              comment: commentVal,
              date: new Date().toLocaleDateString('id-ID')
            };
            allOrders[orderIdx].negotiation.push({
              from: "buyer",
              message: `Memberikan rating bintang ${ratingVal} dengan ulasan: "${commentVal}"`,
              date: new Date().toLocaleDateString('id-ID'),
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem('kuleather_service_orders', JSON.stringify(allOrders));
          }

          const reviewModal = document.getElementById('review-rating-modal');
          if (reviewModal) {
            reviewModal.classList.add('hidden');
          }
          window.showToast('Terima kasih atas ulasan rating Anda!', 'success');
          setTimeout(() => {
            window.location.href = 'profile.html?tab=panel-custom-services';
          }, 1500);
        });
      }
    }

    const btnCancelReview = document.getElementById('btn-cancel-review');
    if (btnCancelReview && !btnCancelReview._dataBound) {
      btnCancelReview._dataBound = true;
      if (typeof btnCancelReview.addEventListener === 'function') {
        btnCancelReview.addEventListener('click', () => {
          const reviewModal = document.getElementById('review-rating-modal');
          if (reviewModal) reviewModal.classList.add('hidden');
        });
      }
    }

    const btnCloseReview = document.getElementById('btn-close-review-modal');
    if (btnCloseReview && !btnCloseReview._dataBound) {
      btnCloseReview._dataBound = true;
      if (typeof btnCloseReview.addEventListener === 'function') {
        btnCloseReview.addEventListener('click', () => {
          const reviewModal = document.getElementById('review-rating-modal');
          if (reviewModal) reviewModal.classList.add('hidden');
        });
      }
    }

    // Helper Notification function
    function createSystemNotification(message, type, color) {
      const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
      notifications.unshift({
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
  }

  // Translates status enum to Indonesian readable badge
  function translateStatus(st) {
    switch (st) {
      case 'REQUEST_SENT': return 'Request Diajukan';
      case 'PENAWARAN_DIKIRIM': return 'Menunggu Persetujuan Penawaran';
      case 'DEAL': return 'Persetujuan Deal (Belum Bayar)';
      case 'DIBAYAR_ESCROW': return 'Escrow Terbayar (Siap Dikerjakan)';
      case 'DIKERJAKAN': return 'Dalam Pengerjaan';
      case 'HASIL_DIKIRIM': return 'Hasil Selesai (Menunggu Review)';
      case 'SELESAI': return 'Selesai';
      case 'DIBATALKAN': return 'Dibatalkan';
      case 'DISPUTE': return 'Komplain Mediasi';
      default: return st;
    }
  }
});
