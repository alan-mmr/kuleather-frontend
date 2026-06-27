// ==========================================================================
// 🏪 Kuleather Light — Seller Finance Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;

  // 1. DOM Elements
  const availableBalEl = document.getElementById('finance-available-balance');
  const escrowBalEl = document.getElementById('finance-escrow-balance');
  const withdrawnTotalEl = document.getElementById('finance-withdrawn-total');
  const historyTbody = document.getElementById('finance-history-tbody');
  
  const withdrawModalAvailableBal = document.getElementById('withdraw-modal-available-balance');
  const withdrawForm = document.getElementById('withdraw-form');
  const withdrawAmountInput = document.getElementById('withdraw-amount');

  let availableBalance = 0;
  let escrowBalance = 0;
  let totalWithdrawn = 0;
  let transactions = [];

  // 2. Load Finance Data
  function loadFinanceData() {
    const products = JSON.parse(localStorage.getItem('kuleather_products')) || [];
    const orders = JSON.parse(localStorage.getItem('kuleather_profile_orders')) || [];
    const withdrawals = JSON.parse(localStorage.getItem(`kuleather_seller_withdrawals_${sellerId}`)) || [];

    const sellerProducts = products.filter(p => p.sellerId === sellerId);

    // Calculate Credits (Completed Orders) & Escrow (Pending Completion Orders)
    let totalCredits = 0;
    escrowBalance = 0;
    transactions = [];

    // Filter orders with seller items
    const sellerOrders = orders.filter(o => o.items.some(item => sellerProducts.some(p => p.id === item.id)));

    sellerOrders.forEach(o => {
      // Calculate item value for this seller in this order
      let sellerOrderValue = 0;
      o.items.forEach(item => {
        const isSellerItem = sellerProducts.some(p => p.id === item.id);
        if (isSellerItem) {
          sellerOrderValue += item.price * item.qty;
        }
      });

      const netEarnings = sellerOrderValue * 0.95; // 95% after 5% platform fee

      if (o.status === 'Selesai') {
        totalCredits += netEarnings;

        // Add to credit transactions list
        transactions.push({
          id: `CR-${o.id.split('-').pop() || Math.floor(Math.random() * 10000)}`,
          date: o.date,
          type: 'kredit',
          description: `Pendapatan bersih pesanan ${o.id} (potong komisi 5%)`,
          amount: netEarnings,
          status: 'Selesai'
        });
      } else if (['Dibayar', 'Diproses', 'Dikirim'].includes(o.status)) {
        escrowBalance += netEarnings;
      }
    });

    // Calculate Debits (Withdrawals)
    totalWithdrawn = 0;
    withdrawals.forEach(w => {
      totalWithdrawn += w.amount;
      // Add to debit transactions list
      transactions.push({
        id: w.id,
        date: w.date,
        type: 'debit',
        description: `Pencairan dana ke Rekening ${w.bank} (${w.accountNumber})`,
        amount: w.amount,
        status: w.status
      });
    });

    // Net Available Balance
    availableBalance = Math.max(0, totalCredits - totalWithdrawn);

    // Render Stats
    if (availableBalEl) availableBalEl.textContent = window.idr(availableBalance);
    if (escrowBalEl) escrowBalEl.textContent = window.idr(escrowBalance);
    if (withdrawnTotalEl) withdrawnTotalEl.textContent = window.idr(totalWithdrawn);

    if (withdrawModalAvailableBal) withdrawModalAvailableBal.textContent = window.idr(availableBalance);

    renderHistory();
  }

  // 3. Render Transaction History Table
  function renderHistory() {
    if (!historyTbody) return;

    // Sort transactions by date descending (we'll sort by date string or timestamp if available, here we just reverse since credits are pushed first, then withdrawals)
    const sortedTx = [...transactions].reverse();

    if (sortedTx.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;" class="text-muted">Belum ada mutasi keuangan</td></tr>`;
      return;
    }

    let html = '';
    sortedTx.forEach(tx => {
      const typeClass = tx.type === 'kredit' ? 'text-success' : 'text-error';
      const typeSign = tx.type === 'kredit' ? '+' : '-';
      const badgeClass = tx.status === 'Selesai' ? 'status-active' : 'status-pending';
      const badgeText = tx.status === 'Selesai' ? 'Berhasil' : 'Diproses';

      html += `
        <tr>
          <td class="mono accent">${tx.id}</td>
          <td class="mono text-muted">${tx.date}</td>
          <td>
            <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase;">${tx.type}</span>
          </td>
          <td>${tx.description}</td>
          <td class="mono font-weight-bold ${typeClass}">${typeSign} ${window.idr(tx.amount)}</td>
          <td>
            <span class="status-pill ${badgeClass}">
              <span class="dot"></span>
              ${badgeText}
            </span>
          </td>
        </tr>
      `;
    });

    historyTbody.innerHTML = html;
  }

  // 4. Modal operations
  window.openWithdrawModal = function() {
    if (withdrawForm) withdrawForm.reset();
    if (withdrawAmountInput) {
      withdrawAmountInput.max = availableBalance;
      withdrawAmountInput.value = '';
    }
    if (withdrawModalAvailableBal) {
      withdrawModalAvailableBal.textContent = window.idr(availableBalance);
    }
    window.openModal('withdraw-modal-overlay');
  };

  // 5. Submit Withdrawal Form
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const amount = parseInt(withdrawAmountInput.value, 10);
      const bank = document.getElementById('withdraw-bank').value;
      const accountNumber = document.getElementById('withdraw-account-number').value.trim();
      const accountName = document.getElementById('withdraw-account-name').value.trim();

      if (amount < 50000) {
        window.showToast('Minimal penarikan adalah Rp 50.000', 'error');
        return;
      }

      if (amount > availableBalance) {
        window.showToast('Saldo tersedia tidak mencukupi untuk melakukan penarikan.', 'error');
        return;
      }

      // Add to withdrawals history in localStorage
      const withdrawals = JSON.parse(localStorage.getItem(`kuleather_seller_withdrawals_${sellerId}`)) || [];
      const newWithdrawal = {
        id: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        bank: bank,
        accountNumber: accountNumber,
        accountName: accountName,
        amount: amount,
        status: 'Selesai' // Simulated auto success for prototype, or 'Diproses' if admin approval was required
      };

      withdrawals.push(newWithdrawal);
      localStorage.setItem(`kuleather_seller_withdrawals_${sellerId}`, JSON.stringify(withdrawals));

      // Create log notification for admin approval or notice
      createAdminNotification(`Mitra Penjual (${window.sellerUser.shop.name}) menarik dana sebesar ${window.idr(amount)} ke rekening ${bank}`, 'finance');

      window.showToast('Pencairan dana berhasil diajukan dan diproses!', 'success');
      window.closeModal('withdraw-modal-overlay');
      loadFinanceData();
    });
  }

  // Helper to create notifications for admin
  function createAdminNotification(message, type) {
    const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
    notifications.push({
      id: 'notif-' + Date.now(),
      message: message,
      type: type,
      read: false,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));
  }

  loadFinanceData();
});
