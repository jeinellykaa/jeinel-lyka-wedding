# Jeinel & Lyka — Wedding Invitation Site

Static site built from Figma frames **Desktop - 4** and **Android Compact - 1** (file `jei-lyka-wedding`).

## Folder structure (drop-in replacement)

```
jeinel-lyka-wedding/
├── index.html          # Full page
├── favicon.svg
├── README.md
├── css/
│   └── styles.css      # Layout, typography, responsive, animations
├── js/
│   ├── config.js       # Editable: date, maps, RSVP URL, gift copy
│   └── main.js         # Countdown, nav, RSVP modal, snaps carousel, reveals
└── assets/
    └── images/
        ├── hero-couple.jpg
        ├── letter-bg.jpg
        ├── stamp.jpg
        ├── venue.jpg
        ├── timeline.jpg
        ├── attire.jpg
        ├── palette.jpg
        ├── divider.jpg
        ├── gifts-bg.jpg
        ├── cake.jpg
        ├── florals.jpg
        ├── photo-1.jpg … photo-7.jpg
        └── ellipse.svg
```

## How to deploy

1. Replace the contents of your local project folder with this folder (or copy these files over your existing ones).
2. Optional: set `rsvpUrl` in `js/config.js` when the form is ready.
3. Commit and push to GitHub — Netlify will rebuild automatically.

## What’s included

- Responsive layout matching Desktop - 4 (desktop) and Android Compact - 1 (mobile)
- Fonts from Google: Dawning of a New Day, Delius Swash Caps, Delius Unicase
- Live countdown to `isoDate` in `config.js`
- Maps links → Google Maps for Craft 1945
- RSVP buttons → open form if `rsvpUrl` is set, otherwise a “coming soon” modal
- Scroll-in reveal animations (respects `prefers-reduced-motion`)
- Auto-advancing photo carousel under “Some snaps!”
- Sticky nav with smooth section anchors

## Design fidelity notes

- Timeline event labels and times are HTML overlays positioned to match **Desktop - 4** (illustration is decorative only).
- Decorative dividers, letter paper, cake/florals, and gift frame come from the Figma exports.
- Fonts: Dawning of a New Day (script), Delius Swash Caps, Delius Unicase — same as Figma.
- Colors, spacing, and illustration styles are unchanged from the design.
- No Figma prototype motion tracks were present; site uses scroll-reveal + carousel transitions instead.
