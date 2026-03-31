/* ==========================================================================
   PORTFOLIO JS — Pradyumna Kumar
   Vanilla JavaScript — no dependencies.

   Modules:
   1. Sticky nav background on scroll
   2. Smooth scroll for nav links
   3. Active nav link tracking (Intersection Observer)
   4. Mobile hamburger menu
   5. Scroll-reveal animations (Intersection Observer)
   6. Back-to-top button
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     DOM References
     ------------------------------------------------------------------ */
  const header     = document.getElementById('site-header');
  const navToggle  = document.getElementById('nav-toggle');
  const navMenu    = document.getElementById('nav-menu');
  const navLinks   = document.querySelectorAll('.nav__link');
  const backToTop  = document.getElementById('back-to-top');
  const sections   = document.querySelectorAll('section[id]');
  const reveals    = document.querySelectorAll('.reveal');

  /* ------------------------------------------------------------------
     1. STICKY NAV — Add dark bg when scrolled past hero
     ------------------------------------------------------------------ */
  function handleHeaderScroll() {
    if (window.scrollY > 80) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  /* ------------------------------------------------------------------
     2. SMOOTH SCROLL — Navigate to section on link click
     ------------------------------------------------------------------ */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth' });

      // Close mobile menu if open
      closeMenu();
    });
  });

  // Logo click scrolls to top
  var logo = document.querySelector('.nav__logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     3. ACTIVE NAV LINK — Highlight based on scroll position
     ------------------------------------------------------------------ */
  var activeLinkObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -75% 0px',
    }
  );

  sections.forEach(function (section) {
    activeLinkObserver.observe(section);
  });

  /* ------------------------------------------------------------------
     4. MOBILE HAMBURGER MENU
     ------------------------------------------------------------------ */
  // Create overlay element for mobile menu backdrop
  var overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navMenu.classList.add('nav__menu--open');
    navToggle.classList.add('nav__hamburger--open');
    navToggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('nav__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__hamburger--open');
    navToggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('nav__overlay--visible');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.contains('nav__menu--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ------------------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS — Fade in elements on scroll
     ------------------------------------------------------------------ */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Skip animation — show everything immediately
    reveals.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* ------------------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     ------------------------------------------------------------------ */
  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     SCROLL EVENT — Throttled with requestAnimationFrame
     ------------------------------------------------------------------ */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleHeaderScroll();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on load
  handleHeaderScroll();
  handleBackToTop();
})();
