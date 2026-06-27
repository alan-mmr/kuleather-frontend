document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. LOGIN / REGISTER TAB TOGGLE
  // ==========================================================================
  const loginTabBtn = document.getElementById('tab-login-btn');
  const registerTabBtn = document.getElementById('tab-register-btn');
  const loginFormContainer = document.getElementById('login-form-container');
  const registerFormContainer = document.getElementById('register-form-container');

  if (loginTabBtn && registerTabBtn && loginFormContainer && registerFormContainer) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      loginFormContainer.classList.remove('hidden');
      registerFormContainer.classList.add('hidden');
    });

    registerTabBtn.addEventListener('click', () => {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      registerFormContainer.classList.remove('hidden');
      loginFormContainer.classList.add('hidden');
    });
  }

  // ==========================================================================
  // 2. ROLE SELECTOR (Pembeli / Penjual)
  // ==========================================================================
  const roleCards = document.querySelectorAll('.role-card');
  const roleInput = document.getElementById('register-role-input');
  const sellerFields = document.getElementById('seller-additional-fields');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => {
        c.style.borderColor = 'var(--muted-light)';
        c.style.backgroundColor = 'var(--surface)';
      });
      card.style.borderColor = 'var(--accent)';
      card.style.backgroundColor = 'rgba(193, 127, 59, 0.02)';
      
      const role = card.getAttribute('data-role');
      if (roleInput) {
        roleInput.value = role;
      }

      if (sellerFields) {
        if (role.toLowerCase() === 'seller') {
          sellerFields.classList.remove('hidden');
          document.getElementById('register-shop-name').setAttribute('required', '');
          document.getElementById('register-shop-city').setAttribute('required', '');
        } else {
          sellerFields.classList.add('hidden');
          document.getElementById('register-shop-name').removeAttribute('required');
          document.getElementById('register-shop-city').removeAttribute('required');
        }
      }
    });
  });

  // ==========================================================================
  // 3. PASSWORD STRENGTH METER
  // ==========================================================================
  const passwordInput = document.getElementById('register-password');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.getElementById('strength-text');

  if (passwordInput && strengthBars.length > 0) {
    passwordInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const len = val.length;
      
      // Reset
      strengthBars.forEach(bar => {
        bar.style.backgroundColor = 'var(--muted-light)';
      });

      if (len === 0) {
        if (strengthText) strengthText.textContent = '';
        return;
      }

      let strength = 0; // 0 to 4
      
      // Criteria 1: Length
      if (len >= 6) strength += 1;
      if (len >= 8) strength += 1;
      
      // Criteria 2: Mixed Case / Numbers
      const hasNumber = /[0-9]/.test(val);
      const hasUpper = /[A-Z]/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val);

      if (hasNumber || hasUpper) strength += 1;
      if (hasSpecial && len >= 8) strength += 1;

      // Ensure min strength 1 if any text typed
      if (strength === 0 && len > 0) strength = 1;

      // Color and labels based on score
      let color = 'var(--error)';
      let label = 'Lemah';

      if (strength === 2) {
        color = 'var(--warning)';
        label = 'Sedang';
      } else if (strength === 3) {
        color = 'var(--success)';
        label = 'Kuat';
      } else if (strength >= 4) {
        color = '#4E8A2F'; // Darker green
        label = 'Sangat Kuat';
      }

      if (strengthText) {
        strengthText.textContent = label;
        strengthText.style.color = color;
      }

      // Light up bars
      for (let i = 0; i < strength; i++) {
        if (strengthBars[i]) {
          strengthBars[i].style.backgroundColor = color;
        }
      }
    });
  }

  // ==========================================================================
  // 4. DATA SEEDING & FORM VALIDATION
  // ==========================================================================
  const DEFAULT_USERS = [
    { id: "u01", name: "Budi Santoso", email: "budi.santoso@email.com", phone: "081234567890", role: "pembeli", joined: "10 Mar 2026", status: "active", orders: 3, initials: "BS", address: "Jl. Sawo No. 12, Kel. Selosari, Kec. Magetan, Kabupaten Magetan, Jawa Timur, 63311", password: "user123", points: 750 },
    { id: "u02", name: "Slamet Widodo", email: "slamet@email.com", phone: "087712345678", role: "penjual", joined: "12 Apr 2026", status: "active", orders: 0, initials: "SW", address: "Jl. Selosari Gg. Kulit No. 4, Selosari, Magetan, Jawa Timur", password: "seller123", shop: { name: "Toko Pak Slamet", description: "Pengrajin kulit legendaris Magetan dengan pengalaman lebih dari 40 tahun.", city: "Magetan", category: "Kerajinan", avatar: "../../assets/ims/artisan_pak_slamet.jpg", banner: "../../assets/ims/workshop_warehouse_building.jpg", rating: 4.9, totalSales: 1540, memberSince: "Apr 2026", verified: true } },
    { id: "u03", name: "Admin Utama", email: "admin@kuleather.id", phone: "081122334455", role: "admin", joined: "01 Jan 2026", status: "active", orders: 0, initials: "AD", address: "Kantor Pusat Kuleather, Magetan, Jawa Timur", password: "admin123" }
  ];

  const storedUsers = localStorage.getItem('kuleather_users');
  if (storedUsers) {
    const list = JSON.parse(storedUsers);
    const u02 = list.find(u => u.id === 'u02');
    // Force reload if default seller u02 lacks shop profile or still uses old Unsplash/emoji avatar
    if (u02 && (!u02.shop || !u02.shop.banner || u02.shop.avatar === '👨‍🎨' || u02.name === 'Toko Pak Slamet' || (u02.shop.avatar && u02.shop.avatar.includes('unsplash.com')) || (u02.shop.banner && u02.shop.banner.includes('unsplash.com')))) {
      localStorage.removeItem('kuleather_users');
    }
  }
  if (!localStorage.getItem('kuleather_users')) {
    localStorage.setItem('kuleather_users', JSON.stringify(DEFAULT_USERS));
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Forgot Password Handler
  const forgotLink = document.getElementById('forgot-password-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt("Masukkan email Anda untuk memulihkan password:");
      if (email) {
        const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (user) {
          window.showToast(`Link pemulihan password dikirim ke ${email}!`, 'success');
          setTimeout(() => {
            alert(`[SIMULASI PEMULIHAN PASSWORD]\nPassword Anda adalah: ${user.password}`);
          }, 800);
        } else {
          window.showToast('Email tidak terdaftar.', 'error');
        }
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;

      if (email === '' || pass === '') {
        window.showToast('Semua kolom harus diisi.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        window.showToast('Format email tidak valid.', 'error');
        return;
      }

      const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        window.showToast('Email tidak terdaftar.', 'error');
        return;
      }

      if (user.password !== pass) {
        window.showToast('Password salah.', 'error');
        return;
      }

      if (user.status === 'suspended') {
        window.showToast('Akun Anda ditangguhkan oleh admin.', 'error');
        return;
      }

      // Check seller pending approval status
      if (user.role === 'penjual' && user.status === 'pending_verification') {
        window.showToast('Akun kemitraan Anda sedang menunggu verifikasi admin.', 'warning');
        return;
      }

      // Successful login
      localStorage.setItem('kuleather_active_user', JSON.stringify(user));
      window.showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      
      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = 'admin/dashboard.html';
        } else if (user.role === 'penjual') {
          window.location.href = 'seller/dashboard.html';
        } else {
          window.location.href = 'profile.html';
        }
      }, 1500);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const phone = document.getElementById('register-phone').value.trim();
      const pass = document.getElementById('register-password').value;
      const terms = document.getElementById('register-terms').checked;
      const roleRaw = document.getElementById('register-role-input')?.value || 'Buyer';
      const role = roleRaw.toLowerCase() === 'buyer' ? 'pembeli' : 'penjual';

      if (name === '' || email === '' || phone === '' || pass === '') {
        window.showToast('Semua kolom harus diisi.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        window.showToast('Format email tidak valid.', 'error');
        return;
      }

      if (pass.length < 6) {
        window.showToast('Password harus minimal 6 karakter.', 'error');
        return;
      }

      if (!terms) {
        window.showToast('Anda harus menyetujui syarat & ketentuan.', 'error');
        return;
      }

      // Get shop info if seller
      let shop = null;
      if (role === 'penjual') {
        const shopName = document.getElementById('register-shop-name').value.trim();
        const shopCity = document.getElementById('register-shop-city').value.trim();
        const shopCat = document.getElementById('register-shop-cat').value;
        const shopDesc = document.getElementById('register-shop-desc').value.trim();

        if (shopName === '' || shopCity === '') {
          window.showToast('Nama Toko dan Kota Asal wajib diisi untuk Penjual.', 'error');
          return;
        }

        shop = {
          name: shopName,
          description: shopDesc || 'Pengrajin kulit Magetan.',
          city: shopCity,
          category: shopCat,
          avatar: '🏪',
          rating: 5.0,
          totalSales: 0,
          memberSince: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }),
          verified: false
        };
      }

      const users = JSON.parse(localStorage.getItem('kuleather_users')) || [];
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        window.showToast('Email sudah terdaftar.', 'error');
        return;
      }

      // Generate initials
      const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      const status = role === 'penjual' ? 'pending_verification' : 'active';

      const newUser = {
        id: 'u' + (users.length + 1).toString().padStart(2, '0'),
        name: name,
        email: email,
        phone: phone,
        role: role,
        joined: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: status,
        orders: 0,
        initials: initials || 'US',
        address: role === 'penjual' ? `${shop.city}, Jawa Timur` : '',
        password: pass,
        points: 0,
        shop: shop
      };

      users.push(newUser);
      localStorage.setItem('kuleather_users', JSON.stringify(users));

      // Successful register
      if (role === 'penjual') {
        window.showToast('Pendaftaran mitra berhasil! Menunggu verifikasi admin.', 'success');
      } else {
        window.showToast('Registrasi berhasil! Silakan masuk.', 'success');
      }

      // Sync Admin notification
      const notifications = JSON.parse(localStorage.getItem('kuleather_notifications')) || [];
      const now = new Date();
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(Math.random() * 90000 + 10000),
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        text: `Registrasi pengguna baru: ${name} (Role: ${role}, Status: ${status})`,
        type: "user",
        color: "var(--info)",
        read: false
      });
      localStorage.setItem('kuleather_notifications', JSON.stringify(notifications));
      
      // Simulate switching tabs
      setTimeout(() => {
        if (loginTabBtn) loginTabBtn.click();
        
        // Populate register email to login email field
        const loginEmailField = document.getElementById('login-email');
        if (loginEmailField) {
          loginEmailField.value = email;
        }
      }, 1500);
    });
  }
});
