const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".site-nav a");
const revealElements = document.querySelectorAll(".reveal");
const toggle = document.querySelector(".theme-toggle");
const counters = document.querySelectorAll(".counter");
let countersAnimated = false;

// ── Dark mode ──────────────────────────────

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("portfolio-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// ── Active nav sections ────────────────────

const sections = [];
navLinks.forEach((link) => {
  const id = link.getAttribute("href").slice(1);
  const el = document.getElementById(id);
  if (el) sections.push({ id, el });
});

// ── Counter animation ──────────────────────

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  counters.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (el.dataset.prefix) {
        el.textContent = el.dataset.prefix + current + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// ── Scroll handler ─────────────────────────

function onScroll() {
  const scrollY = window.scrollY;
  const viewHeight = window.innerHeight;

  // Header scrolled state
  header.classList.toggle("scrolled", scrollY > 60);

  // Active nav link
  let activeId = sections[0]?.id || "";
  for (const { id, el } of sections) {
    if (el.getBoundingClientRect().top <= viewHeight * 0.4) {
      activeId = id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href").slice(1) === activeId);
  });

  // Scroll reveal
  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top <= viewHeight * 0.88) {
      el.classList.add("visible");
    }
  });

  // Counter trigger when stats section enters viewport
  if (!countersAnimated) {
    const statsEl = document.getElementById("stats");
    if (statsEl && statsEl.getBoundingClientRect().top <= viewHeight * 0.85) {
      animateCounters();
    }
  }
}

window.addEventListener("scroll", onScroll, { passive: true });

// ── Initial state on load ──────────────────

window.addEventListener("load", () => {
  onScroll();

  // Force reveal elements already in view
  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.88) {
      el.classList.add("visible");
    }
  });

  // Trigger counters immediately if stats already visible
  const statsEl = document.getElementById("stats");
  if (statsEl && statsEl.getBoundingClientRect().top <= window.innerHeight * 0.85) {
    animateCounters();
  }
});

// ── Smooth scroll ──────────────────────────

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
