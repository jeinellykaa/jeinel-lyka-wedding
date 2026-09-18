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
    const map = { days, hours, minutes, seconds };
    Object.keys(map).forEach(function (key) {
      const el = document.querySelector("[data-count='" + key + "']");
      if (el) el.textContent = key === "days" ? String(days) : pad(map[key]);
    });
  }

  tick();
  setInterval(tick, 1000);

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("open");
  }

  function closeModal(el) {
    el.classList.remove("open");
  }

  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = btn.getAttribute("data-open");
      if (id === "rsvp") {
        if (cfg.rsvpUrl) {
          window.open(cfg.rsvpUrl, "_blank", "noopener");
          return;
        }
        openModal("rsvp-modal");
        return;
      }
      openModal(id);
    });
  });

  document.querySelectorAll(".modal, .lightbox").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.hasAttribute("data-close")) closeModal(el);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open, .lightbox.open").forEach(closeModal);
    }
  });

  const gift = cfg.gift || {};
  const giftBody = document.getElementById("gift-body");
  if (giftBody) {
    giftBody.innerHTML =
      "<p>" +
      (gift.note || "") +
      "</p>" +
      "<p class='gift-line'><strong>GCash:</strong> " +
      (gift.gcashName || "") +
      " · " +
      (gift.gcashNumber || "") +
      "</p>" +
      "<p class='gift-line'><strong>Bank:</strong> " +
      (gift.bankName || "") +
      "<br>" +
      (gift.bankAccountName || "") +
      "<br>" +
      (gift.bankAccountNumber || "") +
      "</p>";
  }

  const mapLink = document.querySelector("[data-maps]");
  if (mapLink && cfg.mapsUrl) mapLink.href = cfg.mapsUrl;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector("#lightbox img");
  document.querySelectorAll("[data-full]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lightboxImg.src = btn.getAttribute("data-full");
      lightbox.classList.add("open");
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav a");
  function onScroll() {
    let current = "home";
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
