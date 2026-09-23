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
  function scrollToTarget(target) {
    const start = window.scrollY;
    const destination = target.getBoundingClientRect().top + start;
    const distance = destination - start;
    const duration = 750;
    const startedAt = performance.now();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    function step(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        root.style.scrollBehavior = previousScrollBehavior;
      }
    }

    window.requestAnimationFrame(step);
  }

  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        scrollToTarget(target);
        navLinks.forEach(function (l) {
          l.classList.remove("active");
        });
        a.classList.add("active");
      }
    });
  });

  document.querySelectorAll("[data-scroll-rsvp]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        scrollToTarget(target);
      }
    });
  });

  const rsvpModal = document.getElementById("rsvp-modal");
  const rsvpLookup = document.getElementById("rsvp-lookup");
  const rsvpCode = document.getElementById("rsvp-code");
  const rsvpStatus = document.getElementById("rsvp-status");

  function openRsvpLookup() {
    if (!rsvpModal) return;
    rsvpModal.classList.add("open");
    if (rsvpStatus) {
      rsvpStatus.textContent = "";
      rsvpStatus.classList.remove("error");
    }
    window.setTimeout(function () {
      if (rsvpCode) rsvpCode.focus();
    }, 0);
  }

  document.querySelectorAll("[data-lookup-rsvp]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute("href"));
      if (target) scrollToTarget(target);
      window.setTimeout(openRsvpLookup, 750);
    });
  });

  if (rsvpLookup) {
    rsvpLookup.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = rsvpCode ? rsvpCode.value.trim() : "";
      if (!name || !rsvpStatus) return;

      if (!cfg.googleScriptUrl || !cfg.googleFormEntryId || cfg.googleFormEntryId === "XXXXXX") {
        rsvpStatus.textContent = "The RSVP lookup is not configured yet.";
        rsvpStatus.classList.add("error");
        return;
      }

      rsvpStatus.textContent = "Checking guest list...";
      rsvpStatus.classList.remove("error");

      try {
        const url = cfg.googleScriptUrl + "?name=" + encodeURIComponent(name);
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) throw new Error("Lookup request failed");
        const data = await response.json();
        if (!data.redirectUrl) throw new Error(data.error || "Code not found");

        const separator = data.redirectUrl.includes("?") ? "&" : "?";
        const redirectUrl =
          data.redirectUrl +
          separator +
          "entry." +
          encodeURIComponent(cfg.googleFormEntryId) +
          "=" +
          encodeURIComponent(name);
        window.location.assign(redirectUrl);
      } catch (error) {
        rsvpStatus.textContent =
          error.message === "Code not found"
            ? "We couldn't find that code. Please check it and try again."
            : "We couldn't check the guest list. Please try again.";
        rsvpStatus.classList.add("error");
      }
    });
  }

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
