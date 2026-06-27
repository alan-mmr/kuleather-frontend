document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Apply custom inline delay if data-delay exists
          const delay = element.getAttribute('data-delay');
          if (delay) {
            element.style.transitionDelay = `${delay}ms`;
          }
          
          element.classList.add('revealed');
          observer.unobserve(element); // Trigger once
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it comes into view fully
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ==========================================================================
  // 2. STATS COUNTER ANIMATION
  // ==========================================================================
  const counterElements = document.querySelectorAll('.counter');
  
  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds animation duration
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function: Ease-Out Quad
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);
      
      // Format with Indonesian Locale (dot separator for thousands, e.g., 2.500)
      const formatter = new Intl.NumberFormat('id-ID');
      counter.textContent = formatter.format(currentVal) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = formatter.format(target) + suffix;
      }
    }
    
    requestAnimationFrame(updateCount);
  }

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Run once
        }
      });
    }, {
      threshold: 0.5
    });
    
    counterElements.forEach(counter => {
      counterObserver.observe(counter);
    });
  } else {
    // Fallback: immediately write final value
    counterElements.forEach(counter => {
      const target = counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const formatter = new Intl.NumberFormat('id-ID');
      counter.textContent = formatter.format(parseInt(target, 10)) + suffix;
    });
  }

  // ==========================================================================
  // 3. PARTNERS LOGO MARQUEE DUPLICATION
  // ==========================================================================
  const partnersTrack = document.querySelector('.partners-track');
  if (partnersTrack) {
    // Duplicate the logos inside the track to make a seamless loop
    const trackItems = Array.from(partnersTrack.children);
    trackItems.forEach(item => {
      const clone = item.cloneNode(true);
      partnersTrack.appendChild(clone);
    });
  }

  // ==========================================================================
  // 4. HERO CONTENT STAGGER ENTRANCE (ON LOAD)
  // ==========================================================================
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const heroElements = Array.from(heroContent.children);
    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.transitionDelay = `${(index + 1) * 150}ms`;
      
      // Trigger animation on next paint loop
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }
});
