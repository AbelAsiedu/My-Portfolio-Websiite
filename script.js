// script.js — REPLACE your current script.js with this file
(function () {
  'use strict';

  /* ===== DOM READY ===== */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ===== THEME TOGGLE ===== */
    const toggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.body.classList.add('light');
    toggleBtn?.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });

    /* ===== HEADER SHADOW ON SCROLL ===== */
    const headerEl = document.getElementById('siteHeader');
    const onScrollHeader = () => headerEl.classList.toggle('scrolled', window.scrollY > 2);
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    /* ===== NAV ACTIVE STATE (scrollspy) ===== */
    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('header nav a.nav-link')];
    if (sections.length && 'IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`header nav a[href="#${e.target.id}"]`);
            active?.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 1] });
      sections.forEach(s => spy.observe(s));
    } else {
      // fallback: mark first nav link active
      navLinks[0]?.classList.add('active');
    }

    /* ===== COUNTERS ===== */
    const counters = document.querySelectorAll('.count');
    if (counters.length) {
      const cObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.target || 0;
            let cur = 0;
            const step = Math.max(1, Math.ceil(target / 60));
            const t = setInterval(() => {
              cur += step;
              if (cur >= target) { cur = target; clearInterval(t); }
              el.textContent = cur;
            }, 16);
            cObs.unobserve(el);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(c => cObs.observe(c));
    }

    /* ===== PROJECT FILTERS ===== */
    const filterButtons = document.querySelectorAll('.filter');
    const grid = document.getElementById('projectGrid');
    if (filterButtons.length && grid) {
      filterButtons.forEach(btn => btn.addEventListener('click', () => {
        filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        const cat = (btn.dataset.filter || '').toLowerCase();
        [...grid.children].forEach(card => {
          const byCategory = (card.dataset.category || '').toLowerCase() === cat;
          const tags = (card.dataset.tags || '').toLowerCase().split(',').map(s => s.trim());
          const byTag = tags.includes(cat);
          const show = cat === 'all' || byCategory || byTag;
          card.style.display = show ? 'flex' : 'none';
        });
      }));
    }

    /* ===== CONTACT FORM (demo) ===== */
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        statusEl.textContent = 'Sending…';
        setTimeout(() => {
          statusEl.textContent = 'Thanks! I will reply within 24 hours.';
          form.reset();
        }, 800);
      });
    }

    /* ===== FOOTER YEAR ===== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ===== TYPED INTRO (safe init) ===== */
    try {
      if (window.Typed) {
        new Typed("#typed-name", {
          strings: ["Hi, I'm Abel Asiedu"],
          typeSpeed: 70, backSpeed: 50, backDelay: 1200, startDelay: 300,
          loop: false, showCursor: true, cursorChar: "|"
        });
        new Typed("#typed-role", {
          strings: ["Frontend Engineer", "Web Designer", "Freelancer", "Problem Solver"],
          typeSpeed: 70, backSpeed: 50, backDelay: 1400, startDelay: 2000,
          loop: true, showCursor: false
        });
      }
    } catch (err) {
      // typed.js failed — non-fatal
      console.warn('Typed.js init failed', err);
    }

    /* ===== PARTICLES (safe init) ===== */
    try {
      if (window.particlesJS) {
        particlesJS("particles-js", {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 3 },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 4, direction: "none", out_mode: "out" }
          },
          interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
          },
          retina_detect: true
        });
      }
    } catch (err) {
      console.warn('particlesJS init failed', err);
    }

    /* ===== REVEAL ANIMATIONS (fade/slide) ===== */
    const revealEls = document.querySelectorAll('.fade-section');

    if (revealEls.length) {
      // if IntersectionObserver unsupported, just show all
      if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('show'));
      } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // add a small stagger if many children (makes large pages feel nicer)
              entry.target.classList.add('show');
              observer.unobserve(entry.target);
            }
          });
        }, { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

        revealEls.forEach(el => revealObserver.observe(el));
      }
    }
  }); // DOM ready
})(); // IIFE
