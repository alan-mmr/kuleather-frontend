document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. PRELOADER
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 800); // Small delay for premium feeling
    });
    
    // Fallback if load event doesn't fire
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
      }
    }, 2000);
  } else {
    document.body.classList.add('loaded');
  }

  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');
  const navDrawerClose = document.getElementById('nav-drawer-close');

  function openDrawer() {
    if (navDrawer && navOverlay) {
      navDrawer.classList.add('open');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (navDrawer && navOverlay) {
      navDrawer.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (navOverlay) navOverlay.addEventListener('click', closeDrawer);
  if (navDrawerClose) navDrawerClose.addEventListener('click', closeDrawer);

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll('.nav-drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 3. STICKY NAVBAR
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    if (navbar) {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Initial check
  updateNavbar();

  // ==========================================================================
  // 4. SMOOTH SCROLL FOR ANCHORS
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 64;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 5. ACTIVE NAV LINK BY SCROLL POSITION
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Triggers when section occupies middle part
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}` || (link.getAttribute('href') === 'index.html' && id === 'hero')) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // ==========================================================================
  // 6. BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 7. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Inline Lucide Icon equivalents for toast
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-error"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        ${iconSvg}
        <span class="toast-message">${message}</span>
      </div>
      <span class="toast-close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
    `;

    container.appendChild(toast);

    // Close on click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      dismissToast(toast);
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      dismissToast(toast);
    }, 3000);
  };

  function dismissToast(toast) {
    if (toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }

  // ==========================================================================
  // 8. GLOBAL NEWSLETTER FORM VALIDATION
  // ==========================================================================
  const newsletterForms = document.querySelectorAll('.newsletter-form, .form-inline');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
          window.showToast('Silakan masukkan alamat email Anda.', 'error');
        } else if (!emailRegex.test(email)) {
          window.showToast('Format email tidak valid.', 'error');
        } else {
          window.showToast('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
          input.value = '';
        }
      }
    });
  });

  // ==========================================================================
  // 9. CART BADGE GLOBAL SYNCRONIZATION & USER STATE
  // ==========================================================================
  window.updateCartBadgeGlobal = function() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      try {
        let count = 0;
        const user = JSON.parse(localStorage.getItem('kuleather_active_user'));
        if (user) {
          const cartData = JSON.parse(localStorage.getItem('kuleather_cart')) || [];
          const userCart = cartData.filter(item => item.userId === user.id);
          count = userCart.reduce((total, item) => total + item.qty, 0);
        }
        badge.textContent = count;
        if (count > 0) {
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      } catch (e) {
        badge.style.display = 'none';
      }
    }
  };

  // Helper to sync navbar active user state
  window.updateNavbarUserGlobal = function() {
    try {
      const user = JSON.parse(localStorage.getItem('kuleather_active_user'));
      const navActions = document.querySelector('.nav-actions');
      
      if (user) {
        // Logged in state
        // 1. Hide desktop login button if exists
        const loginBtn = document.querySelector('.nav-actions a[href="auth.html"]');
        if (loginBtn) loginBtn.style.display = 'none';

        // 2. Create/update profile avatar circle
        let avatar = document.querySelector('.profile-avatar-circle');
        if (!avatar && navActions) {
          avatar = document.createElement('a');
          avatar.className = 'profile-avatar-circle';
          avatar.href = 'profile.html';
          avatar.style.width = '32px';
          avatar.style.height = '32px';
          avatar.style.fontSize = '12px';
          avatar.style.display = 'flex';
          avatar.style.alignItems = 'center';
          avatar.style.justifyContent = 'center';
          avatar.style.borderRadius = '50%';
          avatar.style.backgroundColor = 'var(--accent)';
          avatar.style.color = 'white';
          avatar.style.textDecoration = 'none';
          avatar.style.fontWeight = 'bold';
          avatar.style.marginLeft = '12px';
          navActions.appendChild(avatar);
        }
        if (avatar) {
          avatar.textContent = user.initials || 'US';
          avatar.style.display = 'flex';
          if (user.role === 'penjual') {
            avatar.href = 'seller/dashboard.html';
          } else if (user.role === 'admin') {
            avatar.href = 'admin/dashboard.html';
          } else {
            avatar.href = 'profile.html';
          }
        }

        // 3. Update mobile drawer link
        const mobileAuthLink = document.querySelector('.nav-drawer-links a[href="auth.html"]');
        if (mobileAuthLink) {
          if (user.role === 'penjual') {
            mobileAuthLink.href = 'seller/dashboard.html';
            mobileAuthLink.textContent = `Seller Panel (${user.name})`;
          } else if (user.role === 'admin') {
            mobileAuthLink.href = 'admin/dashboard.html';
            mobileAuthLink.textContent = `Admin Panel (${user.name})`;
          } else {
            mobileAuthLink.href = 'profile.html';
            mobileAuthLink.textContent = `Profil (${user.name})`;
          }
        }
      } else {
        // Logged out state
        const loginBtn = document.querySelector('.nav-actions a[href="auth.html"]');
        if (loginBtn) loginBtn.style.display = 'inline-block';

        const avatar = document.querySelector('.profile-avatar-circle');
        if (avatar) avatar.style.display = 'none';

        const mobileAuthLink = document.querySelector('.nav-drawer-links a[href*="profile.html"], .nav-drawer-links a[href*="dashboard.html"]');
        if (mobileAuthLink) {
          mobileAuthLink.href = 'auth.html';
          mobileAuthLink.textContent = 'Masuk / Daftar';
        }
      }
    } catch (e) {
      console.error('Error syncing navbar user:', e);
    }
  };

  // ==========================================================================
  // 12. THEME SWITCHER (LIGHT ↔ DARK)
  // ==========================================================================
  const initThemeSwitcher = () => {
    const navActions = document.querySelector('.nav-actions');
    const drawerLinks = document.querySelector('.nav-drawer-links');
    if (!navActions) return;

    // Detect current theme based on path
    const path = window.location.pathname.toLowerCase();
    const isDark = path.includes('kuleather-dark');
    
    // Switch function
    const toggleTheme = (e) => {
      e.preventDefault();
      const currentHref = window.location.href;
      let newHref = currentHref;
      
      if (isDark) {
        // Switch to Light
        newHref = currentHref.replace(/kuleather-dark/i, 'Kuleather-Light');
      } else {
        // Switch to Dark
        newHref = currentHref.replace(/kuleather-light/i, 'Kuleather-Dark');
      }
      
      // Fallback folder mapping if case-insensitive string replace is insufficient
      if (newHref === currentHref) {
        if (isDark) {
          newHref = currentHref.replace('/Kuleather-Dark/', '/Kuleather-Light/');
        } else {
          newHref = currentHref.replace('/Kuleather-Light/', '/Kuleather-Dark/');
        }
      }
      
      window.location.href = newHref;
    };

    // 1. Desktop Toggle
    const themeBtn = document.createElement('a');
    themeBtn.className = 'nav-theme-toggle btn-icon';
    themeBtn.href = '#';
    themeBtn.title = isDark ? 'Ganti ke Mode Terang (Linen Ivory)' : 'Ganti ke Mode Gelap (Savana Heritage)';
    themeBtn.style.marginRight = '8px';
    themeBtn.style.display = 'inline-flex';
    themeBtn.style.alignItems = 'center';
    themeBtn.style.justifyContent = 'center';
    themeBtn.style.color = 'var(--text-secondary)';

    if (isDark) {
      // Sun icon for Dark Theme (to switch to Light)
      themeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      // Moon icon for Light Theme (to switch to Dark)
      themeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }

    themeBtn.addEventListener('click', toggleTheme);
    
    // Insert desktop toggle before the first action item
    navActions.insertBefore(themeBtn, navActions.firstChild);

    // 2. Mobile Toggle inside drawer
    if (drawerLinks) {
      const mobileThemeLink = document.createElement('a');
      mobileThemeLink.className = 'nav-drawer-link';
      mobileThemeLink.href = '#';
      mobileThemeLink.style.marginTop = '10px';
      mobileThemeLink.style.display = 'flex';
      mobileThemeLink.style.alignItems = 'center';
      mobileThemeLink.style.gap = '10px';
      
      if (isDark) {
        mobileThemeLink.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> <span>Mode Terang (Ivory)</span>`;
      } else {
        mobileThemeLink.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> <span>Mode Gelap (Heritage)</span>`;
      }
      
      mobileThemeLink.addEventListener('click', toggleTheme);
      drawerLinks.appendChild(mobileThemeLink);
    }
  };

  // Initialize theme switcher
  initThemeSwitcher();

  // Sync badge and user on load
  window.updateCartBadgeGlobal();
  window.updateNavbarUserGlobal();
});
