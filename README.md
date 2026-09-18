# Jei & Lyka wedding invitation

Static one-page site built from `Jei_Lyka_Design_01.psd`. Open `index.html` locally or upload the folder to GoDaddy.

## 1. Host on GoDaddy

You asked for the full buy-and-upload path. This is for **Web Hosting** (cPanel + File Manager), which is the usual way to put a static HTML site online at GoDaddy.

### A. Buy a domain

1. Go to [godaddy.com](https://www.godaddy.com) and sign in (or create an account).
2. Search a domain such as `jeiandlyka.com` or `jeiandlykawedding.com`.
3. Complete checkout. Privacy protection is worth turning on if it is offered.

### B. Buy hosting

1. In your GoDaddy account, open **Web Hosting** and choose a starter Linux / cPanel plan (Economy is enough for this site).
2. During setup, **attach the domain you just bought** as the primary domain.
3. Wait until the account status is **Active**. DNS can take from a few minutes up to 24–48 hours.

If you already own the domain and only add hosting later: Web Hosting → manage → change primary domain, or point the domain’s **A record** at the hosting IP shown in the hosting dashboard.

### C. Turn on HTTPS

1. Open the hosting **cPanel**.
2. Find **SSL/TLS Status** (or GoDaddy’s **SSL** panel).
3. Install the free certificate for your domain. After that, guests should be able to use `https://yourdomain.com`.

### D. Upload this website

Upload the **contents** of this project, not a nested extra folder, into `public_html`.

Files that must be on the server:

- `index.html`
- `favicon.svg`
- `css/styles.css`
- `js/config.js`
- `js/main.js`
- `assets/images/` (all of the PNGs and `og-share.jpg`)

You do **not** need to upload `assets-src/`, `extract_assets.py`, this README, or the original PSD.

**File Manager method**

1. GoDaddy → **Web Hosting** → **Manage** → **cPanel** → **File Manager**.
2. Open `public_html`.
3. Delete the default `index.html` welcome page if GoDaddy created one.
4. Upload the files above, keeping the same folders (`css`, `js`, `assets/images`).
5. Visit `https://yourdomain.com` and hard-refresh (`Ctrl+F5`).

**FTP method (optional)**

1. In cPanel, create an FTP account or use the one GoDaddy emailed you.
2. Connect with FileZilla (host is often `ftp.yourdomain.com` or the IP, port 21).
3. Drag the site files into `public_html`.

### E. After upload

1. Paste your Google Form URL into `js/config.js` → `rsvpUrl`, then upload that file again.
2. Fill in GCash / bank fields in the same file.
3. Replace the polaroid images in `assets/images/` with real photos if you want (keep the filenames, or edit `index.html`).

---

## 2. How this site was built

1. Read the PSD artboard (829×1897, flattened to one layer).
2. Export a composite PNG and crop illustrations (arch, dogs, house, icons, polaroids).
3. Recreate all **text** in HTML so it stays sharp on phones and desktops.
4. Style one long scrolling page to match the cream paper, rust script, and serif type.
5. Add a countdown, maps link, RSVP hook, gift modal, and photo lightbox with a little JavaScript.

To preview on your PC: double-click `index.html`, or from this folder run:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

---

## 3. How the code is structured

| File | Role |
| --- | --- |
| `index.html` | Page sections: hero, countdown, venue, timeline, attire, gift/RSVP, photos, FAQ, footer |
| `css/styles.css` | Layout, paper background, fonts, buttons, sticky header, mobile nav |
| `js/config.js` | **Edit this** — date, maps, RSVP form, gift details |
| `js/main.js` | Countdown, menu, modals, lightbox, RSVP button |
| `assets/images/` | Art cropped from the mockup |

There is no framework and no build step. What you upload is what guests see.

---

## 4. What you should customize

Open `js/config.js` and set:

- `rsvpUrl` — Google Form link
- `gift.gcashNumber` / bank fields
- `isoDate` if the ceremony time changes (currently 10:00 AM, Asia/Manila)

If times in the timeline change, edit the four blocks inside `#timeline` in `index.html`.
