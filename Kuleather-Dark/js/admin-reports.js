// ==========================================================================
// 🌿 Kuleather Light — Admin Reports Module
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check auth first
  if (typeof isAuthorized !== 'undefined' && !isAuthorized) return;

  initReports();
});

let allOrders = [];
let allProducts = [];

function initReports() {
  allOrders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
  allProducts = JSON.parse(localStorage.getItem('kuleather_products')) || [];

  // Initialize Filter Event Listener
  const periodSelect = document.getElementById('report-period-select');
  if (periodSelect) {
    periodSelect.addEventListener('change', () => {
      generateReportData(periodSelect.value);
    });
  }

  // Generate initial report (all time)
  generateReportData('all');
}

// Helpers for date parsing
function parseOrderDate(dateStr) {
  if (!dateStr) return new Date();
  const months = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
    "Jul": 6, "Agt": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11
  };
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]] !== undefined ? months[parts[1]] : 5;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return new Date(dateStr); // fallback
}

function generateReportData(period) {
  const now = new Date();

  // Filter only completed orders ("Selesai")
  const completedOrders = allOrders.filter(order => order.status === 'Selesai');

  // Filter by period
  const filteredOrders = completedOrders.filter(order => {
    if (period === 'all') return true;

    const orderDate = parseOrderDate(order.date);
    
    if (period === 'this-month') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    } else if (period === 'last-3-months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return orderDate >= threeMonthsAgo;
    } else if (period === 'this-year') {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // 1. Calculate Aggregates
  let totalRevenue = 0;
  let totalQty = 0;
  let totalOrdersCount = filteredOrders.length;

  filteredOrders.forEach(o => {
    totalRevenue += o.total;
    o.items.forEach(item => {
      totalQty += (item.qty || 1);
    });
  });

  const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Render stats
  document.getElementById('rep-revenue').textContent = idr(totalRevenue);
  document.getElementById('rep-aov').textContent = idr(aov);
  document.getElementById('rep-orders').textContent = totalOrdersCount.toLocaleString('id-ID');
  document.getElementById('rep-qty').textContent = totalQty.toLocaleString('id-ID');

  // 2. Monthly Performance
  generateMonthlyReport(filteredOrders, totalRevenue);

  // 3. Seller Performance
  generateSellerReport(filteredOrders);

  // 4. Top Products Performance
  generateProductsReport(filteredOrders, totalRevenue);
}

function generateMonthlyReport(orders, totalRevenue) {
  const tbody = document.getElementById('monthly-report-tbody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">TIDAK ADA DATA</td></tr>`;
    return;
  }

  const monthsMap = {
    0: "Januari", 1: "Februari", 2: "Maret", 3: "April", 4: "Mei", 5: "Juni",
    6: "Juli", 7: "Agustus", 8: "September", 9: "Oktober", 10: "November", 11: "Desember"
  };

  const monthlyData = {};

  orders.forEach(order => {
    const orderDate = parseOrderDate(order.date);
    const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth()).padStart(2, '0')}`;
    if (!monthlyData[key]) {
      monthlyData[key] = {
        monthName: `${monthsMap[orderDate.getMonth()]} ${orderDate.getFullYear()}`,
        ordersCount: 0,
        revenue: 0
      };
    }
    monthlyData[key].ordersCount++;
    monthlyData[key].revenue += order.total;
  });

  // Sort months chronologically
  const sortedKeys = Object.keys(monthlyData).sort();

  tbody.innerHTML = sortedKeys.map(key => {
    const data = monthlyData[key];
    const percentage = totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : 0;

    return `
      <tr>
        <td style="font-weight: 500;">${data.monthName}</td>
        <td style="text-align: center; font-family: var(--font-mono);">${data.ordersCount}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: bold; color: var(--accent);">${idr(data.revenue)}</td>
        <td style="text-align: right; font-family: var(--font-mono);">${percentage}%</td>
      </tr>
    `;
  }).join('');
}

function generateSellerReport(orders) {
  const tbody = document.getElementById('seller-report-tbody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">TIDAK ADA DATA</td></tr>`;
    return;
  }

  const sellerData = {};

  orders.forEach(order => {
    const seller = order.seller || 'Kuleather Shop';
    if (!sellerData[seller]) {
      sellerData[seller] = {
        name: seller,
        qtySold: 0,
        revenue: 0
      };
    }
    sellerData[seller].revenue += order.total;
    order.items.forEach(item => {
      sellerData[seller].qtySold += (item.qty || 1);
    });
  });

  // Sort by revenue desc
  const sortedSellers = Object.values(sellerData).sort((a, b) => b.revenue - a.revenue);

  tbody.innerHTML = sortedSellers.map(seller => `
    <tr>
      <td style="font-weight: 500;">${seller.name}</td>
      <td style="text-align: center; font-family: var(--font-mono);">${seller.qtySold}</td>
      <td style="text-align: right; font-family: var(--font-mono); font-weight: bold; color: var(--accent);">${idr(seller.revenue)}</td>
    </tr>
  `).join('');
}

function generateProductsReport(orders, totalRevenue) {
  const tbody = document.getElementById('products-report-tbody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-md text-muted" style="font-family: var(--font-mono); font-size: 0.75rem;">TIDAK ADA DATA</td></tr>`;
    return;
  }

  const productData = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      // Find category
      const mainProd = allProducts.find(p => p.name === item.name || p.id === item.id);
      const category = mainProd ? mainProd.cat : 'Lainnya';
      const key = item.name;

      if (!productData[key]) {
        productData[key] = {
          name: item.name,
          category: category,
          qtySold: 0,
          revenue: 0
        };
      }
      productData[key].qtySold += (item.qty || 1);
      productData[key].revenue += (item.price * (item.qty || 1));
    });
  });

  // Sort by qtySold desc
  const sortedProducts = Object.values(productData).sort((a, b) => b.qtySold - a.qtySold);

  tbody.innerHTML = sortedProducts.map((prod, index) => {
    const percentage = totalRevenue > 0 ? ((prod.revenue / totalRevenue) * 100).toFixed(1) : 0;
    return `
      <tr>
        <td style="text-align: center; font-family: var(--font-mono); font-weight: bold;">${index + 1}</td>
        <td style="font-weight: 500;">${prod.name}</td>
        <td><span class="status-pill status-pill-info" style="font-family: var(--font-mono);">${prod.category}</span></td>
        <td style="text-align: center; font-family: var(--font-mono);">${prod.qtySold}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: bold; color: var(--accent);">${idr(prod.revenue)}</td>
        <td style="text-align: right; font-family: var(--font-mono);">${percentage}%</td>
      </tr>
    `;
  }).join('');
}

window.exportFullReportCsv = function() {
  if (allOrders.length === 0) {
    showToast('Tidak ada data transaksi untuk diexport', 'warning');
    return;
  }

  const headers = ['ID Pesanan', 'Tanggal', 'Nama Pembeli', 'Email', 'Metode Pembayaran', 'Kurir', 'Ongkir', 'Total Transaksi', 'Status'];
  const rows = allOrders.map(order => [
    order.id,
    order.date,
    order.buyer,
    order.buyerEmail,
    order.paymentMethod,
    order.shippingCourier,
    order.shippingCost,
    order.total,
    order.status
  ]);

  const csvContent = "data:text/csv;charset=utf-8,"
    + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `transaksi_kuleather_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  
  showToast('File CSV Transaksi berhasil diexport', 'success');
};
