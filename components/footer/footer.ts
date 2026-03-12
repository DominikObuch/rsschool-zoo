import styles from './footer.scss?inline';
import type { NavItem, SocialItem, LogoData } from '../../src/types.ts';

const NAV_ITEMS: NavItem[] = [
  { label: 'About',      page: 'landing', href: '../../pages/landing/' },
  { label: 'Map',        page: 'map',     href: '../../pages/map/' },
  { label: 'Zoos',       page: 'zoo',     href: '../../pages/zoo/' },
  { label: 'Contact Us', page: 'contact', href: '../../pages/contact/' },
];

const SOCIAL_ITEMS: SocialItem[] = [
  { label: 'YouTube',   icon: '../../icons/YouTube.svg',   href: 'https://www.youtube.com/' },
  { label: 'Instagram', icon: '../../icons/Instagram.svg', href: 'https://www.instagram.com/' },
  { label: 'Facebook',  icon: '../../icons/Facebook.svg',  href: 'https://www.facebook.com/' },
];

const CREDIT_ITEMS: string[] = ['© 2021 DinaK', '© Yem Digital', '© RSSchool'];

const LOGO_DATA: LogoData[] = [
  { src: '../../icons/LogoFooter.svg',              alt: 'Online Zoo',  cls: 'footer__logo footer__logo--main' },
  { src: '../../icons/logo2.svg',             alt: 'Partner logo', cls: 'footer__logo footer__logo--circle' },
  { src: '../../icons/rs_school_js_logo.svg', alt: 'RS School',   cls: 'footer__logo footer__logo--rs' },
];

const template = document.createElement('template');

function buildTemplate(): void {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const inner = document.createElement('div');
  inner.className = 'footer__inner';

  const upper = document.createElement('div');
  upper.className = 'footer__upper';

  const logos = document.createElement('div');
  logos.className = 'footer__logos';

  LOGO_DATA.forEach(({ src, alt, cls }: LogoData) => {
    const img = document.createElement('img');
    img.className = cls;
    img.src = src;
    img.alt = alt;
    logos.appendChild(img);
  });

  const nav = document.createElement('nav');
  nav.className = 'footer__nav';
  nav.setAttribute('aria-label', 'Footer navigation');

  const navList = document.createElement('ul');
  navList.className = 'footer__nav-list';

  NAV_ITEMS.forEach(({ label, page, href }: NavItem) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'footer__nav-link';
    a.dataset.page = page;
    a.href = href;
    a.textContent = label;
    li.appendChild(a);
    navList.appendChild(li);
  });

  nav.appendChild(navList);

  const donate = document.createElement('button');
  donate.className = 'footer__donate';
  donate.type = 'button';
  donate.setAttribute('aria-label', 'Donate for volunteers');
  donate.addEventListener('click', () => {
    donate.dispatchEvent(new CustomEvent('donate-click', { bubbles: true, composed: true }));
  });

  const donateText = document.createElement('span');
  donateText.className = 'footer__donate-text';
  donateText.textContent = 'Donate for volunteers';

  const donateArrow = document.createElement('span');
  donateArrow.className = 'footer__donate-arrow';
  donateArrow.setAttribute('aria-hidden', 'true');
  donateArrow.textContent = '';

  donate.append(donateText, donateArrow);

  upper.append(logos, nav, donate);

  const divider = document.createElement('hr');
  divider.className = 'footer__divider';

  const lower = document.createElement('div');
  lower.className = 'footer__lower';

  const credits = document.createElement('div');
  credits.className = 'footer__credits';

  CREDIT_ITEMS.forEach((text: string) => {
    const span = document.createElement('span');
    span.className = 'footer__credit';
    span.textContent = text;
    credits.appendChild(span);
  });

  const socials = document.createElement('div');
  socials.className = 'footer__socials';

  SOCIAL_ITEMS.forEach(({ label, icon, href }: SocialItem) => {
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

  inner.append(upper, divider, lower);
  footer.appendChild(inner);
  template.content.appendChild(footer);
}

buildTemplate();

export class ZooFooter extends HTMLElement {
  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('zoo-footer', ZooFooter);
export default ZooFooter;
