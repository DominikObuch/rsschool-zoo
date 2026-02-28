# GitHub Copilot Instructions — Online Zoo

## Project Overview

Multi-page responsive Vanilla JS website built with Vite + SCSS. Source design: Figma by Dinky. Evaluated via RS School cross-check (max 435 points, 2-week window). No frameworks, no TypeScript, no jQuery, no Bootstrap, no Swiper, no pre-built UI libraries. SCSS is used for all styles.

---

## Colour Palette

| Token | Hex | Name |
|---|---|---|
| Black | `#000000` | black |
| Navy | `#20113D` | navy |
| White | `#FFFFFF` | white |
| Orange | `#F58021` | orange |
| Turquoise | `#00A092` | turquoise |

Use these values (and their SCSS variables if defined) for all colours throughout the project. Do not introduce colours outside this palette unless the Figma design explicitly requires it.

---

## Folder Structure

```
online-zoo/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── pages/
│   ├── landing/
│   │   ├── index.html
│   │   ├── landing.scss       ← page-level styles (BEM blocks specific to this page)
│   │   └── script.js
│   ├── map/
│   │   ├── index.html
│   │   ├── map.scss
│   │   └── script.js
│   ├── zoo/
│   │   ├── index.html
│   │   ├── zoo.scss
│   │   └── script.js
│   └── contact/
│       ├── index.html
│       ├── contact.scss
│       └── script.js
└── components/
    ├── layout/
    │   ├── layout.js          ← wraps <zoo-header> + <slot> + <zoo-footer>
    │   └── layout.scss
    ├── header/
    │   ├── header.js
    │   └── header.scss
    ├── footer/
    │   ├── footer.js
    │   └── footer.scss
    ├── animal-card/
    │   ├── animal-card.js
    │   └── animal-card.scss
    ├── slider/
    │   ├── slider.js
    │   └── slider.scss
    ├── live-cam-nav/
    │   ├── live-cam-nav.js
    │   └── live-cam-nav.scss
    ├── live-cam-carousel/
    │   ├── live-cam-carousel.js
    │   └── live-cam-carousel.scss
    ├── donate-popup/
    │   ├── donate-popup.js
    │   └── donate-popup.scss
    └── feed-popup/
        ├── feed-popup.js
        └── feed-popup.scss
```

---

## Design Folder Workflow

A `design/` folder at the repo root contains raw HTML files exported from Figma — one file per page. These are flat, unstyled (or inline-styled) HTML snapshots that represent the visual intent of the designer. They are **reference material only** and must never be served as-is.

```
design/
├── landing.html
├── map.html
├── zoo.html
└── contact.html
```

When a file from `design/` is provided, the task is to transform it into the proper project structure:

1. **Identify sections** — split the flat HTML into the named BEM blocks (`.hero`, `.how-it-works`, `.donation`, `.pets`, `.pay-feed`, `.reviews`, `.care`, `.live-cams`, `.did-you-know`, `.get-in-touch`).
2. **Extract components** — any repeated or self-contained element (header, footer, card, slider, popup, nav panel) becomes a Shadow DOM web component under `components/`.
3. **Apply BEM** — rename all classes to follow `block__element--modifier` convention; strip inline styles.
4. **Move styles to SCSS** — all visual rules go into the companion `.scss` file of the component or page; nothing stays inline.
5. **Wire interactivity** — replace static placeholders with the correct custom elements (`<zoo-slider>`, `<animal-card>`, `<donate-popup>`, etc.) and add JS event logic in the component file.
6. **Preserve design intent** — layout, spacing, typography and colour must match the Figma design within the ≤10 px tolerance; pixel-perfect is not required.

Never copy markup verbatim from the design file into production HTML. Always refactor through the steps above.

---

## Shadow DOM Component Pattern

Every component is an **ES module export** — no `innerHTML`, no inline styles. DOM is built
programmatically with `document.createElement`. Styles are loaded from the companion `.scss`
file via Vite's `?inline` import (SCSS → CSS string at build time, injected into each
shadow root as a `<style>` element).

```js
// components/header/header.js
import styles from './header.scss?inline';

const template = document.createElement('template');

// Build DOM tree with createElement — never set innerHTML
function buildTemplate() {
  const header = document.createElement('header');
  header.className = 'header';

  const nav = document.createElement('nav');
  nav.className = 'header__nav';

  // ...build full DOM tree, setAttribute, textContent, appendChild...

  template.content.appendChild(header);
}

buildTemplate();

export class ZooHeader extends HTMLElement {
  static get observedAttributes() { return ['active']; }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    // Inject compiled SCSS as a scoped <style> element
    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
    this._highlightActive(this.getAttribute('active'));
  }

  attributeChangedCallback(name, _old, newVal) {
    if (name === 'active') this._highlightActive(newVal);
  }

  _highlightActive(page) {
    if (!this.shadowRoot) return;
    this.shadowRoot.querySelectorAll('.header__nav-link').forEach(link => {
      link.classList.toggle('header__nav-link--active', link.dataset.page === page);
    });
  }
}

customElements.define('zoo-header', ZooHeader);
export default ZooHeader;
```

### Key Rules

- **No `innerHTML`** — use `createElement`, `setAttribute`, `appendChild`, `textContent`.
- **No inline style strings in JS** — all styles live in the companion `.scss` file.
- **`?inline` import** turns SCSS into a CSS string injected once per shadow root instance.
- Always `cloneNode(true)` on `template.content` to avoid the consumed-DocumentFragment bug.
- `mode: 'open'` so page scripts can reach the shadow root when needed.
- Every component class is a **named export** and the **default export**.
- `customElements.define(...)` is called inside the component file (side-effect of import).

---

## SCSS / BEM Conventions

All styles follow **BEM** (Block Element Modifier):

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

- Block name = component name in kebab-case (`.header`, `.animal-card`, `.live-cam-nav`).
- Elements: `__` separator — `.header__logo`, `.animal-card__title`.
- Modifiers: `--` separator — `.header__nav-link--active`, `.animal-card--featured`.
- SCSS nesting allowed but only one level deep for `&__element` / `&--modifier`.
- No global utility classes, no ID selectors for styling.
- When a design HTML snippet is provided, apply BEM class names to it and move all styles to the corresponding `.scss` file (strip inline styles from the HTML).

```scss
// components/header/header.scss
.header {
  display: flex;
  align-items: center;

  &__logo { ... }

  &__nav {
    display: flex;
    gap: 1rem;
  }

  &__nav-link {
    text-transform: uppercase;
    cursor: pointer;

    &--active { font-weight: 700; }

    &:hover { text-decoration: underline; }
  }
}
```

---

## Layout Component

`<zoo-layout>` wraps the shared chrome (header + footer) around page content via `<slot>`.
Every page imports and uses this component instead of importing header and footer separately.

```js
// components/layout/layout.js
import styles from './layout.scss?inline';
import '../header/header.js';   // registers <zoo-header>
import '../footer/footer.js';   // registers <zoo-footer>

const template = document.createElement('template');

function buildTemplate() {
  const wrapper = document.createElement('div');
  wrapper.className = 'layout';

  const header = document.createElement('zoo-header');

  const main = document.createElement('main');
  main.className = 'layout__main';
  const slot = document.createElement('slot'); // page content injected here
  main.appendChild(slot);

  const footer = document.createElement('zoo-footer');

  wrapper.append(header, main, footer);
  template.content.appendChild(wrapper);
}

buildTemplate();

export class ZooLayout extends HTMLElement {
  static get observedAttributes() { return ['active']; }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));
    this._forwardActive(this.getAttribute('active'));
  }

  attributeChangedCallback(name, _old, newVal) {
    if (name === 'active') this._forwardActive(newVal);
  }

  _forwardActive(page) {
    const header = this.shadowRoot?.querySelector('zoo-header');
    if (header && page) header.setAttribute('active', page);
  }
}

customElements.define('zoo-layout', ZooLayout);
export default ZooLayout;
```

Usage in a page HTML:

```html
<script type="module" src="../../components/layout/layout.js"></script>

<zoo-layout active="landing">
  <!-- slotted into <main class="layout__main"> -->
  <section class="hero"> ... </section>
  <section class="how-it-works"> ... </section>
</zoo-layout>
```

---

## Component Catalogue

| Custom element | File | Used on |
|---|---|---|
| `<zoo-layout>` | `components/layout/layout.js` | All 4 pages |
| `<zoo-header>` | `components/header/header.js` | Via layout |
| `<zoo-footer>` | `components/footer/footer.js` | Via layout |
| `<animal-card>` | `components/animal-card/animal-card.js` | Landing, Zoo pages |
| `<zoo-slider>` | `components/slider/slider.js` | Landing (pets + reviews) |
| `<donate-popup>` | `components/donate-popup/donate-popup.js` | Landing, Zoo |
| `<feed-popup>` | `components/feed-popup/feed-popup.js` | Landing (3-step modal) |
| `<live-cam-nav>` | `components/live-cam-nav/live-cam-nav.js` | Zoo page |
| `<live-cam-carousel>` | `components/live-cam-carousel/live-cam-carousel.js` | Zoo page |

---

## Active Nav-Item via Attribute

- `<zoo-layout active="map">` forwards the value to `<zoo-header active="map">` via `_forwardActive`.
- `<zoo-header>` uses `attributeChangedCallback` to toggle `header__nav-link--active` on the matching link.
- Nav links carry a `data-page` attribute matching the `active` value (e.g. `data-page="map"`).
- `<zoo-footer>` never highlights any item (no `active` attribute).

---

## Applying BEM to Design HTML

When a static HTML design snippet is provided:

1. Identify the top-level semantic block (section name / component role).
2. Use these block names: `.hero`, `.how-it-works`, `.donation`, `.pets`, `.pay-feed`, `.reviews`, `.care`, `.live-cams`, `.did-you-know`, `.get-in-touch`.
3. Name every child with `block__element`.
4. Add modifiers for states: `--active`, `--open`, `--collapsed`, `--featured`.
5. Move all styles to the component or page `.scss` file; strip inline styles from the HTML.
6. Never use IDs for styling.

---

## Responsive Design

Required breakpoints: **1920 / 1200 / 640 / 320 px**.

- Each component `.scss` file contains its own `@media` queries scoped to its block.
- No horizontal scrollbar at any supported width.
- No overlapping or cropped content at any breakpoint.
- Smooth progressive adaptation during viewport resizing.

---

## Page-by-Page Requirements

### Landing Page (104 pts)

- `<zoo-layout active="landing">` — ABOUT nav item highlighted.
- Header: logo left, interactive nav, interactive social icons, one `<h1>`, non-sticky.
- `.hero` (WATCH YOUR FAVORITE ANIMAL ONLINE): `VIEW LIVE CAM` interactive, background set via CSS `background-image`.
- `.how-it-works` (WELCOME / HOW WE WORK): images correctly positioned relative to text.
- `.donation` (YOUR DONATION MAKES A DIFFERENCE): `$ DONATION AMOUNT` interactive, all elements present.
- `.pets` (MEET SOME OF OUR PETS): `<zoo-slider>` with functional `<` / `>` buttons; `<animal-card>` interactive (pointer + navigate to zoo page); `VIEW LIVE CAM` inside card interactive; `CHOOSE YOUR FAVORITE` interactive.
- `.pay-feed` (PAY AND FEED): `DONATE NOW` opens `<donate-popup>`; all elements present.
- `.reviews` (WHAT OUR USERS THINK): `<zoo-slider>` `<` / `>` functional; `LEAVE FEEDBACK` interactive; all elements present.
- `.care` (CARE FOR THE ANIMALS YOU LOVE): plain images not interactive; `<animal-card>` interactive (pointer + navigate to zoo page); `CHOOSE YOUR FAVORITE` interactive.
- Footer: nav interactive (no default highlight), `DONATE FOR VOLUNTEERS` interactive, social icons interactive.

### Map Page (56 pts)

- `<zoo-layout active="map">` — MAP highlighted.
- `.map` section: animal icons correctly positioned on the map image; map non-scalable (no interactive zoom).
- Standard interactive footer.

### Zoo / Animal Page (133 pts — base 103 + up to +30)

- `<zoo-layout active="zoo">` — ZOOS highlighted.
- `.live-cams` section:
  - `<live-cam-nav>` with expanded (icon + text) and collapsed (icon-only) states toggled by a control.
  - Selected animal highlighted in both states; clicking item updates highlight and changes the active animal on the page.
  - `position: sticky` on the nav panel when scrolling.
  - `DONATE NOW` opens `<donate-popup>`.
  - Main video: YouTube `<iframe>` preview or click-to-YouTube link.
  - `<live-cam-carousel>` below main video with YouTube previews; `<` / `>` interactive; selected preview has `.live-cam-carousel__thumb--active`.
- `.pay-feed` section: `$ DONATION AMOUNT` interactive, all elements present.
- `.did-you-know` section: `box-shadow` for card shadow; `VIEW MAP` interactive; all elements present.
- Each additional animal page: +10 pts (max +30 for 3 extra animals).

### Contact Us Page (62 pts)

- `<zoo-layout active="contact">` — CONTACT US highlighted.
- `.get-in-touch` section: form with `Your Name`, `Your Email Address`, `Subject`, `Message`; required fields marked `*`; placeholders on all fields; `SEND MESSAGE` interactive.

### Popup — TOGETHER WE CARE, SAVE AND PROTECT! (20 pts)

- `<donate-popup>`: centred overlay, `overflow: hidden` on `<body>` while open, backdrop dimmed.
- Responsive at all 4 widths.
- Layout matches design (image, title, text, buttons); `×` close button positioned per design.
- Donation amount buttons: `:hover` + `cursor: pointer`.
- `×` closes the popup (removes `--open` modifier).

### Popup — MAKE YOUR DONATION (40 pts, 3 steps)

- `<feed-popup>` manages three internal steps.
- **Step 1** (22 pts): centred overlay, scroll disabled, dimmed backdrop, responsive, layout matches design, buttons interactive, `FOR SPECIAL PET` dropdown opens/closes with selected item highlighted, step indicator updates on progress.
- **Step 2** (9 pts): overlay/scroll/backdrop unchanged, responsive, required fields `*`, buttons interactive.
- **Step 3** (9 pts): same requirements as step 2.

---

## Vite Config Notes

- `vite.config.js` uses `build.rollupOptions.input` with entries for all four page `index.html` files.
- SCSS processed natively by Vite once `sass` is installed (`npm i -D sass`).
- `?inline` suffix on SCSS imports yields a CSS string for injection into shadow roots.
- Replace placeholder `vite.svg` favicon with the real Zoo favicon on all pages.

---

## General Code Quality Rules

- Semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>` on every page.
- One `<h1>` per page (can be visually hidden "Online Zoo" if the design does not show one).
- Favicon in `<head>` on all pages.
- `text-transform: uppercase` in SCSS for all-caps headings/nav — never hardcode uppercase text in HTML.
- All interactive states via `:hover` in SCSS — no JS needed for hover effects.
- No `reset.css`; `normalize.css` allowed.
- No layout via screenshots or image inserts.
- Code readable without minification.
- W3C validator: target zero errors across all four pages.
- Pixel-perfect not required; ≤10 px deviation acceptable.

---

## Penalties to Avoid

- Using layout images instead of HTML/CSS: **−90 pts**
- Using any forbidden framework, library, or technology: **−90 pts**
