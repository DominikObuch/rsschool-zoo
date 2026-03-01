import styles from './footer.scss?inline';

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'About',      page: 'landing', href: '/pages/landing/' },
  { label: 'Map',        page: 'map',     href: '/pages/map/' },
  { label: 'Zoos',       page: 'zoo',     href: '/pages/zoo/' },
  { label: 'Contact Us', page: 'contact', href: '/pages/contact/' },
];

const SOCIAL_ITEMS = [
  { label: 'YouTube',   icon: '/icons/YouTube.svg',   href: 'https://www.youtube.com/' },
  { label: 'Instagram', icon: '/icons/Instagram.svg', href: 'https://www.instagram.com/' },
  { label: 'Facebook',  icon: '/icons/Facebook.svg',  href: 'https://www.facebook.com/' },
];

const CREDIT_ITEMS = ['© 2021 DinaK', '© Yem Digital', '© RSSchool'];

// ─── Template ─────────────────────────────────────────────────────────────────
const template = document.createElement('template');

function buildTemplate() {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const inner = document.createElement('div');
  inner.className = 'footer__inner';

  // ── Upper band ──────────────────────────────────────────────────────────────
  const upper = document.createElement('div');
  upper.className = 'footer__upper';

  // Logos group
  const logos = document.createElement('div');
  logos.className = 'footer__logos';

  const logoData = [
    { src: '/icons/Logo.svg',              alt: 'Online Zoo',  cls: 'footer__logo footer__logo--main' },
    { src: '/icons/logo2.png',             alt: 'Partner logo', cls: 'footer__logo footer__logo--circle' },
    { src: '/icons/rs_school_js_logo.svg', alt: 'RS School',   cls: 'footer__logo footer__logo--rs' },
  ];

  logoData.forEach(({ src, alt, cls }) => {
    const img = document.createElement('img');
    img.className = cls;
    img.src = src;
    img.alt = alt;
    logos.appendChild(img);
  });

  // Nav
  const nav = document.createElement('nav');
  nav.className = 'footer__nav';
  nav.setAttribute('aria-label', 'Footer navigation');

  const navList = document.createElement('ul');
  navList.className = 'footer__nav-list';

  NAV_ITEMS.forEach(({ label, page, href }) => {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.className = 'footer__nav-link';
    a.dataset.page = page;
    a.href = href;
    a.textContent = label; // text-transform: uppercase in SCSS

    li.appendChild(a);
    navList.appendChild(li);
  });

  nav.appendChild(navList);

  // Donate button
  const donate = document.createElement('a');
  donate.className = 'footer__donate';
  donate.href = '#';
  donate.setAttribute('aria-label', 'Donate for volunteers');

  const donateText = document.createElement('span');
  donateText.className = 'footer__donate-text';
  donateText.textContent = 'Donate for volunteers';

  const donateArrow = document.createElement('span');
  donateArrow.className = 'footer__donate-arrow';
  donateArrow.setAttribute('aria-hidden', 'true');
  donateArrow.textContent = '→';

  donate.append(donateText, donateArrow);

  upper.append(logos, nav, donate);

  // ── Divider ─────────────────────────────────────────────────────────────────
  const divider = document.createElement('hr');
  divider.className = 'footer__divider';

  // ── Lower band ──────────────────────────────────────────────────────────────
  const lower = document.createElement('div');
  lower.className = 'footer__lower';

  // Credits
  const credits = document.createElement('div');
  credits.className = 'footer__credits';

  CREDIT_ITEMS.forEach(text => {
    const span = document.createElement('span');
    span.className = 'footer__credit';
    span.textContent = text;
    credits.appendChild(span);
  });

  // Social icons
  const socials = document.createElement('div');
  socials.className = 'footer__socials';

  SOCIAL_ITEMS.forEach(({ label, icon, href }) => {
    const a = document.createElement('a');
    a.className = 'footer__social-link';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);

    const img = document.createElement('img');
    img.src = icon;
    img.alt = label;
    img.width = 40;
    img.height = 40;

    a.appendChild(img);
    socials.appendChild(a);
  });

  lower.append(credits, socials);

  // ── Assemble ────────────────────────────────────────────────────────────────
  inner.append(upper, divider, lower);
  footer.appendChild(inner);
  template.content.appendChild(footer);
}

buildTemplate();

// ─── Custom Element ───────────────────────────────────────────────────────────
export class ZooFooter extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('zoo-footer', ZooFooter);
export default ZooFooter;
