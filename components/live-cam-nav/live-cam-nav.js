import styles from './live-cam-nav.scss?inline';

const ANIMALS = [
  { slug: 'panda',   icon: '../../icons/Panda.svg',   label: "Watch live from China's Panda Center",       href: '../../pages/panda/index.html' },
  { slug: 'eagle',   icon: '../../icons/Eagle.svg',   label: 'The Bald Eagles Nest from West End cam',     href: '../../pages/eagle/index.html' },
  { slug: 'gorilla', icon: '../../icons/Gorilla.svg', label: 'Live from Gorilla Forest Corridor habitat cam', href: '../../pages/gorilla/index.html' },
  { slug: 'lemur',   icon: '../../icons/Lemur.svg',   label: 'Lemurs play in Madagascar, Lemuria …',       href: '../../pages/lemur/index.html' },
];

const template = document.createElement('template');

function buildTemplate() {
  const nav = document.createElement('nav');
  nav.className = 'live-cam-nav';

  // ── Header ──────────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'live-cam-nav__header';

  const badge = document.createElement('div');
  badge.className = 'live-cam-nav__live-badge';

  const badgeText = document.createElement('span');
  badgeText.className = 'live-cam-nav__live-text';
  badgeText.textContent = 'live';

  // Person SVG icon (inline, no external file needed)
  const svgNS = 'http://www.w3.org/2000/svg';
  const personSvg = document.createElementNS(svgNS, 'svg');
  personSvg.setAttribute('class', 'live-cam-nav__live-icon');
  personSvg.setAttribute('viewBox', '0 0 24 24');
  personSvg.setAttribute('fill', 'none');
  personSvg.setAttribute('stroke', 'currentColor');
  personSvg.setAttribute('stroke-width', '2');
  personSvg.setAttribute('stroke-linecap', 'round');
  personSvg.setAttribute('stroke-linejoin', 'round');
  personSvg.setAttribute('aria-hidden', 'true');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '7');
  circle.setAttribute('r', '4');

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8');

  personSvg.appendChild(circle);
  personSvg.appendChild(path);

  badge.appendChild(badgeText);
  badge.appendChild(personSvg);

  const toggle = document.createElement('button');
  toggle.className = 'live-cam-nav__toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Expand navigation');
  toggle.textContent = '»';

  header.appendChild(badge);
  header.appendChild(toggle);

  // ── Animal List ──────────────────────────────────────────────────────────────
  const list = document.createElement('ul');
  list.className = 'live-cam-nav__list';

  for (const animal of ANIMALS) {
    const item = document.createElement('li');
    item.className = 'live-cam-nav__item';
    item.dataset.slug = animal.slug;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'live-cam-nav__icon-wrap';

    const img = document.createElement('img');
    img.className = 'live-cam-nav__icon';
    img.src = animal.icon;
    img.alt = animal.slug;

    iconWrap.appendChild(img);

    const label = document.createElement('span');
    label.className = 'live-cam-nav__label';
    label.textContent = animal.label;

    item.appendChild(iconWrap);
    item.appendChild(label);
    item.dataset.href = animal.href;
    list.appendChild(item);
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const footer = document.createElement('div');
  footer.className = 'live-cam-nav__footer';

  const scrollDown = document.createElement('button');
  scrollDown.className = 'live-cam-nav__scroll-down';
  scrollDown.type = 'button';
  scrollDown.setAttribute('aria-label', 'Scroll down');
  scrollDown.textContent = '∨';

  footer.appendChild(scrollDown);

  nav.appendChild(header);
  nav.appendChild(list);
  nav.appendChild(footer);
  template.content.appendChild(nav);
}

buildTemplate();

export class LiveCamNav extends HTMLElement {
  static get observedAttributes() { return ['active']; }

  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    // Default: collapsed — matches the design (narrow icon-only panel)
    shadow.querySelector('.live-cam-nav').classList.add('live-cam-nav--collapsed');

    // Toggle expand / collapse
    shadow.querySelector('.live-cam-nav__toggle').addEventListener('click', () => {
      const nav = shadow.querySelector('.live-cam-nav');
      const isNowCollapsed = nav.classList.toggle('live-cam-nav--collapsed');
      const btn = shadow.querySelector('.live-cam-nav__toggle');
      btn.textContent = isNowCollapsed ? '»' : '«';
      btn.setAttribute('aria-label', isNowCollapsed ? 'Expand navigation' : 'Collapse navigation');
    });

    // Navigate on item click
    shadow.querySelectorAll('.live-cam-nav__item').forEach(item => {
      item.addEventListener('click', () => {
        const href = item.dataset.href;
        if (href) window.location.href = href;
      });
    });

    // Highlight the active animal
    this._highlightActive(this.getAttribute('active'));
  }

  attributeChangedCallback(name, _old, newVal) {
    if (name === 'active') this._highlightActive(newVal);
  }

  _highlightActive(slug) {
    if (!this.shadowRoot) return;
    this.shadowRoot.querySelectorAll('.live-cam-nav__item').forEach(item => {
      item.classList.toggle('live-cam-nav__item--active', item.dataset.slug === slug);
    });
  }
}

customElements.define('live-cam-nav', LiveCamNav);
export default LiveCamNav;
