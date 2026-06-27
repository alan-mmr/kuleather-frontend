// ==========================================================================
// 🌿 Kuleather Light — Admin Notifications Module
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check auth first
  if (typeof isAuthorized !== 'undefined' && !isAuthorized) return;

  initNotificationsPage();
});

let notificationsList = [];
let currentFilter = 'all';

function initNotificationsPage() {
  notificationsList = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
  
  // Render initially
  renderNotificationsFeed();

  // Setup tab filter listeners
  const tabs = document.querySelectorAll('#notif-filter-tabs .admin-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active class
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Set filter and render
      currentFilter = tab.getAttribute('data-filter');
      renderNotificationsFeed();
    });
  });
}

function renderNotificationsFeed() {
  const container = document.getElementById('notif-timeline-container');
  if (!container) return;

  // Filter list
  const filtered = notificationsList.filter(n => {
    if (currentFilter === 'all') return true;
    return n.type === currentFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-xl text-muted" style="font-family: var(--font-mono); font-size: 0.75rem; border: 1px dashed var(--muted-light); border-radius: var(--radius-md); padding: 40px;">TIDAK ADA NOTIFIKASI KATEGORI INI</div>`;
    return;
  }

  container.innerHTML = filtered.map(notif => {
    const unreadClass = notif.read ? '' : 'unread';
    const dotColor = notif.color || 'var(--muted)';
    
    return `
      <div class="admin-timeline-item ${unreadClass}" id="notif-item-${notif.id}" style="cursor: pointer;" onclick="markSingleAsRead('${notif.id}')">
        <div class="admin-timeline-dot" style="background-color: ${dotColor};"></div>
        <div class="admin-timeline-content">
          <span class="admin-timeline-text" style="${notif.read ? '' : 'font-weight: 500;'}">${notif.text}</span>
          <span class="admin-timeline-time">${notif.date} pukul ${notif.time}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.markSingleAsRead = function(id) {
  const idx = notificationsList.findIndex(n => n.id === id);
  if (idx === -1) return;

  if (!notificationsList[idx].read) {
    notificationsList[idx].read = true;
    localStorage.setItem('kuleather_notifications', JSON.stringify(notificationsList));
    
    // Update local UI
    const item = document.getElementById(`notif-item-${id}`);
    if (item) {
      item.classList.remove('unread');
      const text = item.querySelector('.admin-timeline-text');
      if (text) text.style.fontWeight = '';
    }

    // Refresh core badges
    if (typeof updateNotificationBadges === 'function') {
      updateNotificationBadges();
    }
  }
};

window.markAllNotificationsAsRead = function() {
  let changed = false;
  notificationsList.forEach(n => {
    if (!n.read) {
      n.read = true;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem('kuleather_notifications', JSON.stringify(notificationsList));
    renderNotificationsFeed();
    if (typeof updateNotificationBadges === 'function') {
      updateNotificationBadges();
    }
    showToast('Semua notifikasi ditandai telah dibaca', 'success');
  } else {
    showToast('Semua notifikasi sudah dibaca', 'info');
  }
};

window.clearAllNotifications = function() {
  if (!confirm('Apakah Anda yakin ingin menghapus semua riwayat notifikasi?')) return;

  notificationsList = [];
  localStorage.setItem('kuleather_notifications', JSON.stringify(notificationsList));
  renderNotificationsFeed();
  
  if (typeof updateNotificationBadges === 'function') {
    updateNotificationBadges();
  }
  showToast('Semua log notifikasi berhasil dibersihkan', 'success');
};
