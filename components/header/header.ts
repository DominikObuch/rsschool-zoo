import styles from './header.scss?inline';
import type { NavItem, SocialItem } from '../../src/types.ts';

const NAV_ITEMS: NavItem[] = [
  { label: 'About',      page: 'landing', href: '../../pages/landing/' },
  { label: 'Map',        page: 'map',     href: '../../pages/map/' },
  { label: 'Zoos',       page: 'zoo',     href: '../../pages/zoo/' },
  { label: 'Contact Us', page: 'contact', href: '../../pages/contact/' },
  { label: 'Design',     page: 'design',  href: 'https://www.figma.com/', target: '_blank' },
];

const SOCIAL_ITEMS: SocialItem[] = [
  { label: 'YouTube',   icon: '../../icons/YouTube.svg',   href: 'https://www.youtube.com/' },
  { label: 'Instagram', icon: '../../icons/Instagram.svg', href: 'https://www.instagram.com/' },
  { label: 'Facebook',  icon: '../../icons/Facebook.svg',  href: 'https://www.facebook.com/' },
];

const template = document.createElement('template');

function buildTemplate(): void {
  const header = document.createElement('header');
  header.className = 'header';

  const inner = document.createElement('div');
  inner.className = 'header__inner';

  const logoLink = document.createElement('a');
  logoLink.className = 'header__logo-link';
  logoLink.href = '../../pages/landing/index.html';
  logoLink.setAttribute('aria-label', 'Online Zoo — home');

  const logoImg = document.createElement('img');
  logoImg.className = 'header__logo';
  logoImg.src = '../../icons/Logo.svg';
  logoImg.alt = 'Online Zoo';
  logoImg.width = 96;
  logoImg.height = 50;

  logoLink.appendChild(logoImg);

  const nav = document.createElement('nav');
  nav.className = 'header__nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const navList = document.createElement('ul');
  navList.className = 'header__nav-list';

  NAV_ITEMS.forEach(({ label, page, href, target }: NavItem) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'header__nav-link';
    a.dataset.page = page;
    a.href = href;
    a.textContent = label;
    if (target) a.target = target;
    li.appendChild(a);
    navList.appendChild(li);
  });

  nav.appendChild(navList);

  const socials = document.createElement('div');
  socials.className = 'header__socials';

  SOCIAL_ITEMS.forEach(({ label, icon, href }: SocialItem) => {
    const a = document.createElement('a');
    a.className = 'header__social-link';
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

  const burger = document.createElement('button');
  burger.className = 'header__burger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'header-nav');

  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    burger.appendChild(span);
  }

  nav.id = 'header-nav';

  inner.append(logoLink, nav, socials, burger);
  header.appendChild(inner);
  template.content.appendChild(header);
}

buildTemplate();

export class ZooHeader extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['active'];
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    this._highlightActive(this.getAttribute('active'));
    this._initBurger();
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (name === 'active') this._highlightActive(newVal);
  }

  private _highlightActive(page: string | null): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.querySelectorAll<HTMLAnchorElement>('.header__nav-link').forEach((link) => {
      link.classList.toggle('header__nav-link--active', link.dataset.page === page);
    });
  }

  private _initBurger(): void {
    const root = this.shadowRoot;
    if (!root) return;

    const burger = root.querySelector<HTMLButtonElement>('.header__burger');
    const nav = root.querySelector<HTMLElement>('.header__nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('header__nav--open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.header__nav-link')) {
        nav.classList.remove('header__nav--open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      }
    });
  }
}

customElements.define('zoo-header', ZooHeader);
export default ZooHeader;
