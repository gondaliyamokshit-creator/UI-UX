/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
   Handles: navigation, typewriter, particles, scroll
   animations, skill bar fills, counter animations,
   and contact form UX.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── DOM References ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const canvas = document.getElementById('particleCanvas');


  /* ═══════════════════════════════════════════
     1. STICKY NAVBAR + ACTIVE LINK HIGHLIGHT
     ═══════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', scrollY > 600);

    // Active nav link based on scroll position
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial call


  /* ═══════════════════════════════════════════
     2. MOBILE HAMBURGER MENU
     ═══════════════════════════════════════════ */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ═══════════════════════════════════════════
     3. BACK TO TOP
     ═══════════════════════════════════════════ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ═══════════════════════════════════════════
     4. TYPEWRITER EFFECT
     ═══════════════════════════════════════════ */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'scalable web apps.',
    'cloud-native solutions.',
    'beautiful interfaces.',
    'production-ready code.',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseDelay = 2000;

  function typewrite() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Pause at end of phrase
        isDeleting = true;
        setTimeout(typewrite, pauseDelay);
        return;
      }
    } else {
      // Deleting
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typewrite, isDeleting ? deleteSpeed : typeSpeed);
  }

  // Kick off the typewriter after a brief delay
  setTimeout(typewrite, 1500);


  /* ═══════════════════════════════════════════
     5. PARTICLE CANVAS (Hero Background)
     ═══════════════════════════════════════════ */
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles (fewer on mobile for performance)
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Draw connection lines between nearby particles
    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrameId = requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }


  /* ═══════════════════════════════════════════
     6. SCROLL-REVEAL ANIMATIONS
     ═══════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when they become visible
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animate');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════
     7. COUNTER ANIMATION (About Stats)
     ═══════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const speed = 60;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, speed);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  /* ═══════════════════════════════════════════
     8. CONTACT FORM HANDLER
     ═══════════════════════════════════════════ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;

      // Simulated success state
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }


  /* ═══════════════════════════════════════════
     9. SMOOTH SCROLL POLYFILL (for older Safari)
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = targetEl.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10);
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

});
/* ═══════════════════════════════════════════
   10. CERTIFICATE MODAL VIEW (PDF VERSION)
   ═══════════════════════════════════════════ */

const certModal = document.getElementById("certModal");
const certFrame = document.getElementById("certFrame");

// Open certificate (PDF)
window.openCert = function (fileSrc) {
  certModal.style.display = "flex";
  certFrame.src = fileSrc;
  document.body.style.overflow = "hidden"; // prevent scroll
};

// Close certificate
window.closeCert = function () {
  certModal.style.display = "none";
  certFrame.src = "";
  document.body.style.overflow = ""; // restore scroll
};

// Close on outside click
certModal.addEventListener("click", (e) => {
  if (e.target === certModal) {
    closeCert();
  }
});