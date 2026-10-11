
document.documentElement.classList.add("js");
document.body.classList.add("loading");

const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("done");
    document.body.classList.remove("loading");
  }, 1050);
});

// Mobile navigation
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}));

// Scroll progress
const scrollProgress = document.getElementById("scrollProgress");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = pct + "%";
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Animated counters using factual, non-invented site values.
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const pad = Number(el.dataset.pad || 0);
    const duration = 900;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = String(value).padStart(pad, "0");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

// Cursor glow + subtle magnetic buttons
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(pointer:fine)").matches) {
  document.addEventListener("mousemove", e => {
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      glow.style.opacity = "1";
    }
  });
  document.addEventListener("mouseleave", () => {
    if (glow) glow.style.opacity = "0";
  });

  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
    });
    el.addEventListener("mouseleave", () => el.style.transform = "");
  });

  // Lightweight 3D tilt on feature cards.
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - .5) * 4;
      const rx = (.5 - py) * 4;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}

// Subtle hero parallax
const stage = document.querySelector("[data-parallax]");
window.addEventListener("scroll", () => {
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const y = Math.min(window.scrollY * .06, 35);
  stage.style.transform = `translateY(${y}px)`;
}, { passive: true });

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
