// ==========================================================================
// 🏪 Kuleather Light — Seller Dashboard Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;

  // 1. Fetch data from localStorage
  const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
  const orders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];

  // Filter products by seller
  const sellerProducts = products.filter(p => p.sellerId === sellerId);

  // Filter orders by seller
  const sellerOrders = orders.filter(o => o.items.some(item => {
    return sellerProducts.some(p => p.id === item.id);
  }));

  // 2. Welcome Title
  const welcomeTitle = document.getElementById('seller-welcome-title');
  if (welcomeTitle) {
    welcomeTitle.textContent = `Selamat Datang, ${window.sellerUser.name}!`;
  }

  // 3. Stats Calculations
  // Total Products
  const productsCountEl = document.getElementById('seller-products');
  if (productsCountEl) {
    productsCountEl.textContent = sellerProducts.length;
  }

  // Average Rating
  const ratingEl = document.getElementById('seller-rating');
  if (ratingEl) {
    const totalRating = sellerProducts.reduce((sum, p) => sum + (p.rating || 5.0), 0);
    const avgRating = sellerProducts.length > 0 ? (totalRating / sellerProducts.length).toFixed(1) : '5.0';
    ratingEl.textContent = avgRating;
  }

  // Active orders count (status: 'Menunggu Pembayaran', 'Dibayar', 'Diproses', 'Dikirim')
  const activeOrders = sellerOrders.filter(o => ['Menunggu Pembayaran', 'Dibayar', 'Diproses', 'Dikirim'].includes(o.status));
  const ordersCountEl = document.getElementById('seller-orders');
  if (ordersCountEl) {
    ordersCountEl.textContent = activeOrders.length;
  }
  const ordersStatusLbl = document.getElementById('seller-orders-status-lbl');
  if (ordersStatusLbl) {
    ordersStatusLbl.textContent = `${sellerOrders.filter(o => o.status === 'Diproses').length} PERLU DIPROSES`;
  }

  // Earnings calculation (from Selesai orders only, 95% of item value)
  let totalEarnings = 0;
  const completedOrders = sellerOrders.filter(o => o.status === 'Selesai');
  completedOrders.forEach(o => {
    o.items.forEach(item => {
      const isSellerProduct = sellerProducts.some(p => p.id === item.id);
      if (isSellerProduct) {
        totalEarnings += (item.price * item.qty) * 0.95;
      }
    });
  });

  const revenueEl = document.getElementById('seller-revenue');
  if (revenueEl) {
    revenueEl.textContent = window.idr(totalEarnings);
  }

  // 4. Shop Profile Preview Card
  const shop = window.sellerUser.shop || {};
  const previewName = document.getElementById('preview-shop-banner-name');
  const previewAvatar = document.getElementById('preview-shop-avatar');
  const previewCity = document.getElementById('preview-shop-city');
  const previewCategory = document.getElementById('preview-shop-category');
  const previewJoined = document.getElementById('preview-shop-joined');
  const previewDesc = document.getElementById('preview-shop-desc');
  const previewLink = document.getElementById('preview-shop-link');

  if (previewName) previewName.textContent = (shop.name || 'Toko Saya').toUpperCase();
  
  if (previewAvatar) {
    const avatarVal = shop.avatar || '🏪';
    if (avatarVal.startsWith('http') || avatarVal.includes('/') || avatarVal.includes('.')) {
      previewAvatar.innerHTML = `<img src="${avatarVal}" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" />`;
    } else {
      previewAvatar.textContent = avatarVal;
      previewAvatar.innerHTML = avatarVal;
    }
  }

  const bannerPreview = document.querySelector('.seller-shop-banner-preview');
  if (bannerPreview) {
    const bannerVal = shop.banner || 'default';
    if (bannerVal && bannerVal !== 'default') {
      bannerPreview.style.backgroundImage = `url(${bannerVal})`;
      bannerPreview.style.backgroundSize = 'cover';
      bannerPreview.style.backgroundPosition = 'center';
    } else {
      bannerPreview.style.backgroundImage = 'none';
    }
  }

  if (previewCity) previewCity.textContent = shop.city || '-';
  if (previewCategory) previewCategory.textContent = shop.category || '-';
  if (previewJoined) previewJoined.textContent = shop.memberSince || '-';
  if (previewDesc) previewDesc.textContent = shop.description || 'Belum ada deskripsi.';
  if (previewLink) {
    previewLink.setAttribute('href', `../store.html?seller=${sellerId}`);
  }

  // 5. Render Recent 5 Orders
  const recentOrdersTbody = document.getElementById('seller-recent-orders-tbody');
  if (recentOrdersTbody) {
    const recent5 = [...sellerOrders].reverse().slice(0, 5);
    
    if (recent5.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;" class="text-muted">Tidak ada pesanan masuk</td></tr>`;
    } else {
      let html = '';
      recent5.forEach(o => {
        // Calculate total items and total revenue for seller items in this order
        let totalItems = 0;
        let sellerOrderSubtotal = 0;
        let sellerItemDetails = [];

        o.items.forEach(item => {
          const prod = sellerProducts.find(p => p.id === item.id);
          if (prod) {
            totalItems += item.qty;
            sellerOrderSubtotal += (item.price * item.qty) * 0.95;
            sellerItemDetails.push(`${item.name} (${item.qty}x)`);
          }
        });

        let pillClass = 'status-menunggu';
        if (o.status === 'Diproses') pillClass = 'status-diproses';
        if (o.status === 'Dikirim') pillClass = 'status-dikirim';
        if (o.status === 'Selesai') pillClass = 'status-selesai';
        if (o.status === 'Dibatalkan') pillClass = 'status-dibatalkan';
        if (o.status === 'Refund') pillClass = 'status-refund';

        html += `
          <tr>
            <td class="mono accent"><a href="orders.html?id=${o.id}">${o.id}</a></td>
            <td style="font-size:0.75rem;">${sellerItemDetails.join(', ')}</td>
            <td class="mono">${totalItems}</td>
            <td class="mono font-weight-bold">${window.idr(sellerOrderSubtotal)}</td>
            <td>
              <span class="status-pill ${pillClass}">
                <span class="dot"></span>
                ${o.status}
              </span>
            </td>
            <td class="mono text-muted">${o.date}</td>
          </tr>
        `;
      });
      recentOrdersTbody.innerHTML = html;
    }
  }

  // 6. Render Top Products Progress Bars (top 3 by sold counts)
  const topProductsContainer = document.getElementById('seller-top-products-container');
  if (topProductsContainer) {
    const top3 = [...sellerProducts].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 3);
    const maxSold = top3[0] ? top3[0].sold || 1 : 1;

    let html = '';
    top3.forEach(p => {
      const pct = Math.round(((p.sold || 0) / maxSold) * 100);
      html += `
        <div style="margin-bottom:var(--space-md);">
          <div class="flex-between mb-xs">
            <span class="body-sm" style="font-weight:500; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; max-width:160px;">${p.name}</span>
            <span class="caption text-accent" style="font-family:var(--font-mono)">${p.sold || 0} terjual</span>
          </div>
          <div class="admin-progress-bar-wrapper">
            <div class="admin-progress-bar" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });

    if (top3.length === 0) {
      html = `<div class="text-center text-muted" style="padding:var(--space-lg) 0;">Belum ada produk terjual</div>`;
    }
    topProductsContainer.innerHTML = html;
  }

  // 7. Render Chart.js
  renderSellerRevenueChart(completedOrders, sellerProducts);
});

// Render Revenue Chart for Seller
function renderSellerRevenueChart(completedOrders, sellerProducts) {
  const canvas = document.getElementById('sellerRevenueChart');
  if (!canvas) return;

  // Monthly revenue calculations
  const monthlyData = {
    'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'Mei': 0, 'Jun': 0,
    'Jul': 0, 'Ags': 0, 'Sep': 0, 'Okt': 0, 'Nov': 0, 'Des': 0
  };

  completedOrders.forEach(o => {
    // Parse month from date e.g., "11 Jun 2026"
    const parts = o.date.split(' ');
    if (parts.length >= 2) {
      const m = parts[1]; // "Jun"
      if (monthlyData[m] !== undefined) {
        o.items.forEach(item => {
          const isSellerProd = sellerProducts.some(p => p.id === item.id);
          if (isSellerProd) {
            monthlyData[m] += (item.price * item.qty) * 0.95;
          }
        });
      }
    }
  });

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Pendapatan Bersih (Rp)',
        data: Object.values(monthlyData),
        borderColor: '#C17F3B',
        backgroundColor: 'rgba(193, 127, 59, 0.05)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Rp ' + value.toLocaleString('id-ID');
            },
            font: {
              family: 'DM Mono',
              size: 9
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              family: 'DM Mono',
              size: 9
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}
