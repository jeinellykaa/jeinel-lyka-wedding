// Snaps slideshow + full-size lightbox
// The slideshow is driven by a stored index (not by scroll position),
// so opening/closing the lightbox can never knock it out of place.
(function () {
  const viewport = document.querySelector('.snaps-viewport');
  if (!viewport) return;

  const track = viewport.querySelector('.snaps-track');
  const slides = Array.from(track.querySelectorAll('.snaps-slide'));
  const imgs = slides.map((s) => s.querySelector('img'));
  const openBtns = slides.map((s) => s.querySelector('.snaps-open'));
  const total = slides.length;
  const dotsWrap = document.querySelector('.snaps-controls');
  const prevBtn = viewport.querySelector('.snaps-arrow.prev');
  const nextBtn = viewport.querySelector('.snaps-arrow.next');

  let current = 0;

  function mod(i) { return (i + total) % total; }

  /* ---------- Slideshow ---------- */
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'snaps-dot';
    d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    return d;
  });

  function render() {
    track.style.transform = 'translateX(' + -current * 100 + '%)';
    slides.forEach((s, i) => {
      // off-screen slides can't be tabbed to (focus would scroll the clipped area)
      if (i === current) s.removeAttribute('inert'); else s.setAttribute('inert', '');
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
  }

  function goTo(i) {
    current = mod(i);
    render();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  viewport.addEventListener('keydown', (e) => {
    if (e.target !== viewport) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // Safety net: if anything ever scrolls the clipped viewport, snap it back.
  viewport.addEventListener('scroll', () => { viewport.scrollLeft = 0; });

  /* ---------- Swipe (touch / mouse drag) ---------- */
  let startX = null, startY = 0, dx = 0, dragged = false;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.snaps-arrow')) return;
    startX = e.clientX; startY = e.clientY; dx = 0; dragged = false;
  });
  viewport.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - startY)) {
      dragged = true;
      track.classList.add('dragging');
    }
    if (dragged) {
      track.style.transform =
        'translateX(calc(' + -current * 100 + '% + ' + dx + 'px))';
    }
  });
  function endDrag() {
    if (startX === null) return;
    track.classList.remove('dragging');
    const moved = dragged, delta = dx;
    startX = null; dx = 0;
    if (moved) {
      if (Math.abs(delta) > 50) goTo(current + (delta < 0 ? 1 : -1));
      else render();
      // swallow the click that follows a drag so it doesn't open the lightbox
      setTimeout(() => { dragged = false; }, 0);
    }
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('dragstart', (e) => e.preventDefault());

  render();

  /* ---------- Lightbox ---------- */
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('.lightbox-img');
  const boxCount = box.querySelector('.lightbox-count');
  let boxIndex = 0;

  function showInBox(i) {
    boxIndex = mod(i);
    const src = imgs[boxIndex];
    boxImg.src = src.currentSrc || src.src;
    boxImg.alt = src.alt;
    boxCount.textContent = boxIndex + 1 + ' / ' + total;
  }

  function openBox(i) {
    showInBox(i);
    box.showModal();
  }

  function closeBox() {
    if (box.open) box.close();
  }

  box.addEventListener('close', () => {
    // land the slideshow on whichever photo was last viewed
    goTo(boxIndex);
    openBtns[current].focus({ preventScroll: true });
    viewport.scrollLeft = 0;
  });

  openBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      if (dragged) { e.preventDefault(); return; }
      openBox(i);
    });
  });

  box.querySelector('.lightbox-close').addEventListener('click', closeBox);
  box.querySelector('.lightbox-arrow.prev').addEventListener('click', () => showInBox(boxIndex - 1));
  box.querySelector('.lightbox-arrow.next').addEventListener('click', () => showInBox(boxIndex + 1));

  // Click the backdrop or the photo itself to close
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  boxImg.addEventListener('click', closeBox);

  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showInBox(boxIndex - 1);
    if (e.key === 'ArrowRight') showInBox(boxIndex + 1);
  });

  // Swipe left/right inside the lightbox on touch devices
  let touchX = null;
  box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const d = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(d) > 50) showInBox(boxIndex + (d < 0 ? 1 : -1));
  });
})();
