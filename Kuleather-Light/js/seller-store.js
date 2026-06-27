// ==========================================================================
// 🏪 Kuleather Light — Seller Store Settings Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.sellerUser) return;

  const sellerId = window.sellerUser.id;
  const shop = window.sellerUser.shop || {};

  // Form Fields
  const storeForm = document.getElementById('seller-store-form');
  const nameInput = document.getElementById('store-name');
  const cityInput = document.getElementById('store-city');
  const categorySelect = document.getElementById('store-category');
  const avatarSelect = document.getElementById('store-avatar');
  const bannerSelect = document.getElementById('store-banner');
  const ownerInput = document.getElementById('store-owner');
  const descriptionInput = document.getElementById('store-description');
  
  // Live Preview Elements
  const liveBannerName = document.getElementById('live-store-banner-name');
  const liveAvatar = document.getElementById('live-store-avatar');
  const liveTitleName = document.getElementById('live-store-title-name');
  const liveOwnerName = document.getElementById('live-store-owner-name');
  const liveLocation = document.getElementById('live-store-location');
  const liveCat = document.getElementById('live-store-cat');
  
  const btnVisitStore = document.getElementById('btn-visit-store');

  // 1. Populate current values
  if (nameInput) nameInput.value = shop.name || '';
  if (cityInput) cityInput.value = shop.city || '';
  if (categorySelect) categorySelect.value = shop.category || 'Finished Leather Goods';
  if (avatarSelect) avatarSelect.value = shop.avatar || '🏪';
  if (bannerSelect) bannerSelect.value = shop.banner || 'default';
  if (ownerInput) ownerInput.value = window.sellerUser.name || '';
  if (descriptionInput) descriptionInput.value = shop.description || '';

  if (btnVisitStore) {
    btnVisitStore.setAttribute('href', `../store.html?seller=${sellerId}`);
  }

  // 2. Initial live preview update
  updateLivePreview();

  // 3. Bind form events for reactive live preview
  const inputs = [nameInput, cityInput, categorySelect, avatarSelect, bannerSelect, ownerInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', updateLivePreview);
      input.addEventListener('change', updateLivePreview);
    }
  });

  function updateLivePreview() {
    const sName = nameInput ? nameInput.value.trim() || 'Nama Toko' : 'Nama Toko';
    const sCity = cityInput ? cityInput.value.trim() || 'Kota Asal' : 'Kota Asal';
    const sCat = categorySelect ? categorySelect.value : 'Finished Leather Goods';
    const sAvatar = avatarSelect ? avatarSelect.value : '🏪';
    const sBanner = bannerSelect ? bannerSelect.value : 'default';
    const sOwner = ownerInput ? ownerInput.value.trim() || 'Pemilik Toko' : 'Pemilik Toko';

    if (liveBannerName) liveBannerName.textContent = sName.toUpperCase();
    
    // Preview logo
    if (liveAvatar) {
      if (sAvatar.startsWith('http') || sAvatar.includes('/') || sAvatar.includes('.')) {
        liveAvatar.innerHTML = `<img src="${sAvatar}" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" />`;
      } else {
        liveAvatar.textContent = sAvatar;
      }
    }

    // Preview banner
    const liveBannerPreview = document.querySelector('.seller-shop-banner-preview');
    if (liveBannerPreview) {
      if (sBanner && sBanner !== 'default') {
        liveBannerPreview.style.backgroundImage = `url(${sBanner})`;
        liveBannerPreview.style.backgroundSize = 'cover';
        liveBannerPreview.style.backgroundPosition = 'center';
      } else {
        liveBannerPreview.style.backgroundImage = 'none';
      }
    }

    if (liveTitleName) liveTitleName.textContent = sName;
    if (liveOwnerName) liveOwnerName.textContent = `Pemilik: ${sOwner}`;
    if (liveLocation) liveLocation.textContent = sCity;
    if (liveCat) liveCat.textContent = sCat;
  }

  // 4. Submit changes
  if (storeForm) {
    storeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const city = cityInput.value.trim();
      const category = categorySelect.value;
      const avatar = avatarSelect.value;
      const banner = bannerSelect ? bannerSelect.value : 'default';
      const owner = ownerInput.value.trim();
      const description = descriptionInput.value.trim();

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
      const userIndex = users.findIndex(u => u.id === sellerId);

      if (userIndex !== -1) {
        // Update user fields
        users[userIndex].name = owner;
        
        if (!users[userIndex].shop) {
          users[userIndex].shop = {};
        }

        users[userIndex].shop.name = name;
        users[userIndex].shop.city = city;
        users[userIndex].shop.category = category;
        users[userIndex].shop.avatar = avatar;
        users[userIndex].shop.banner = banner;
        users[userIndex].shop.description = description;

        // Save back to localStorage
        localStorage.setItem('kuleather_users', JSON.stringify(users));

        // Update active user session
        localStorage.setItem('kuleather_active_user', JSON.stringify(users[userIndex]));
        
        // Refresh session object in memory for caller scripts
        window.sellerUser = users[userIndex];

        // Trigger header updates
        if (typeof window.populateSellerUI === 'function') {
          window.populateSellerUI();
        }

        window.showToast('Profil dan pengaturan toko berhasil disimpan!', 'success');
        updateLivePreview();
      }
    });
  }
});
