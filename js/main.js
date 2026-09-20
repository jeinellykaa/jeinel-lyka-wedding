(function () {
  const cfg = window.INVITE || {};

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const target = new Date(cfg.isoDate).getTime();
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    const map = { days: days, hours: hours, minutes: minutes, seconds: seconds };
    Object.keys(map).forEach(function (key) {
      const el = document.querySelector("[data-count='" + key + "']");
      if (el) {
        el.textContent = key === "days" ? String(map[key]) : pad(map[key]);
      }
    });
  }

  tick();
  setInterval(tick, 1000);

  /* Smooth nav + active underline */
  const navLinks = document.querySelectorAll(".nav a[href^='#']");
  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navLinks.forEach(function (l) {
          l.classList.remove("active");
        });
        a.classList.add("active");
        document.querySelector(".nav")?.classList.remove("open");
      }
    });
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        nav.classList.contains("open") ? "true" : "false"
      );
    });
  }

  /* RSVP buttons — open form if configured, otherwise modal */
  function handleRsvp(e) {
    e.preventDefault();
    if (cfg.rsvpUrl) {
      window.open(cfg.rsvpUrl, "_blank", "noopener");
      return;
    }
    const modal = document.getElementById("rsvp-modal");
    if (modal) modal.classList.add("open");
  }

  document.querySelectorAll("[data-rsvp]").forEach(function (btn) {
    btn.addEventListener("click", handleRsvp);
  });

  /* Maps links already use href; ensure they open in new tab */
  document.querySelectorAll("[data-maps]").forEach(function (a) {
    if (cfg.mapsUrl) a.setAttribute("href", cfg.mapsUrl);
  });

  /* Modals */
  function closeModal(el) {
    el.classList.remove("open");
  }

  document.querySelectorAll(".modal").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.hasAttribute("data-close")) {
        closeModal(el);
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(closeModal);
    }
  });

  /* Photo carousel / snaps */
  const track = document.querySelector(".snaps-track");
  const slides = document.querySelectorAll(".snaps-slide");
  let snapIndex = 0;

  function goSnap(i) {
    if (!track || !slides.length) return;
    snapIndex = (i + slides.length) % slides.length;
    track.style.transform = "translateX(-" + snapIndex * 100 + "%)";
    document.querySelectorAll(".snaps-dot").forEach(function (d, idx) {
      d.classList.toggle("active", idx === snapIndex);
    });
  }

  document.querySelectorAll("[data-snap-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goSnap(snapIndex - 1);
    });
  });
  document.querySelectorAll("[data-snap-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goSnap(snapIndex + 1);
    });
  });
  document.querySelectorAll(".snaps-dot").forEach(function (dot, idx) {
    dot.addEventListener("click", function () {
      goSnap(idx);
    });
  });

  /* Auto-advance snaps gently */
  if (slides.length > 1) {
    setInterval(function () {
      goSnap(snapIndex + 1);
    }, 5000);
  }

  /* Scroll reveal animations */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Sticky nav shadow on scroll */
  const header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
