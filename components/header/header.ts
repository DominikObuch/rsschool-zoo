import styles from './header.scss?inline';
import type { NavItem, SocialItem } from '../../src/types.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';
import { authProfileStorage } from '../../src/utils/auth-profile.ts';
import type { ApiErrorResponseDto } from '../../src/api/models/common.dto.ts';

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

  const auth = document.createElement('div');
  auth.className = 'header__auth';

  const authToggle = document.createElement('button');
  authToggle.className = 'header__auth-toggle';
  authToggle.type = 'button';
  authToggle.setAttribute('aria-label', 'Open account menu');
  authToggle.setAttribute('aria-expanded', 'false');

  const authIcon = document.createElement('span');
  authIcon.className = 'header__auth-icon';

  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.setAttribute('viewBox', '0 0 24 24');
  iconSvg.setAttribute('width', '20');
  iconSvg.setAttribute('height', '20');
  iconSvg.setAttribute('aria-hidden', 'true');

  const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  head.setAttribute('cx', '12');
  head.setAttribute('cy', '8');
  head.setAttribute('r', '3.4');

  const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  body.setAttribute('d', 'M5.5 19.5c0-3.4 2.9-5.8 6.5-5.8s6.5 2.4 6.5 5.8');

  iconSvg.append(head, body);
  authIcon.appendChild(iconSvg);

  const authName = document.createElement('span');
  authName.className = 'header__auth-name';

  authToggle.append(authIcon, authName);

  const authMenu = document.createElement('div');
  authMenu.className = 'header__auth-menu';
  authMenu.hidden = true;

  const profile = document.createElement('div');
  profile.className = 'header__auth-profile';
  profile.hidden = true;

  const profileName = document.createElement('p');
  profileName.className = 'header__auth-profile-name';

  const profileEmail = document.createElement('p');
  profileEmail.className = 'header__auth-profile-email';

  profile.append(profileName, profileEmail);

  const signInLink = document.createElement('a');
  signInLink.className = 'header__auth-link header__auth-link--signin';
  signInLink.href = '../../pages/login/index.html';
  signInLink.textContent = 'Sign In';

  const registerLink = document.createElement('a');
  registerLink.className = 'header__auth-link header__auth-link--register';
  registerLink.href = '../../pages/register/index.html';
  registerLink.textContent = 'Registration';

  const signOutButton = document.createElement('button');
  signOutButton.className = 'header__auth-signout';
  signOutButton.type = 'button';
  signOutButton.textContent = 'Sign Out';

  authMenu.append(profile, signInLink, registerLink, signOutButton);
  auth.append(authToggle, authMenu);

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

  inner.append(logoLink, nav, socials, auth, burger);
  header.appendChild(inner);
  template.content.appendChild(header);
}

buildTemplate();

export class ZooHeader extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['active'];
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    this._highlightActive(this.getAttribute('active'));
    this._initBurger();
    this._initAuthMenu();
    void this._hydrateAuthState();
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

  private _initAuthMenu(): void {
    const root = this.shadowRoot;
    if (!root) return;

    const auth = root.querySelector<HTMLElement>('.header__auth');
    const toggle = root.querySelector<HTMLButtonElement>('.header__auth-toggle');
    const menu = root.querySelector<HTMLElement>('.header__auth-menu');
    const signOutButton = root.querySelector<HTMLButtonElement>('.header__auth-signout');

    if (!auth || !toggle || !menu || !signOutButton) return;

    toggle.addEventListener('click', () => {
      const nextOpen = menu.hidden;
      menu.hidden = !nextOpen;
      toggle.setAttribute('aria-expanded', String(nextOpen));
      toggle.setAttribute('aria-label', nextOpen ? 'Close account menu' : 'Open account menu');
    });

    signOutButton.addEventListener('click', () => {
      authTokenStorage.clear();
      authProfileStorage.clear();
      this._renderGuestState();
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open account menu');
    });

    document.addEventListener('click', (event: MouseEvent) => {
      if (menu.hidden) return;
      const path = event.composedPath();
      if (!path.includes(auth)) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open account menu');
      }
    });
  }

  private async _hydrateAuthState(): Promise<void> {
    const token = authTokenStorage.get();
    if (!token) {
      authProfileStorage.clear();
      this._renderGuestState();
      return;
    }

    const cached = authProfileStorage.get();
    if (cached) {
      this._renderUserState(cached.name, cached.email);
    }

    try {
      const response = await authService.getProfile();

      const rawProfile = response.data as Partial<{ name: string; email: string; login: string }>;
      const name = (rawProfile.name ?? rawProfile.login ?? '').trim();
      const email = (rawProfile.email ?? '').trim();

      if (!name) {
        this._renderGuestState();
        return;
      }

      const normalizedEmail = email || cached?.email || '';
      this._renderUserState(name, normalizedEmail);
      authProfileStorage.set({
        name,
        email: normalizedEmail,
        login: rawProfile.login,
      });
    } catch (error: unknown) {
      const statusCode = (error as ApiErrorResponseDto | null)?.statusCode;
      if (statusCode === 401 || statusCode === 403) {
        authTokenStorage.clear();
        authProfileStorage.clear();
        this._renderGuestState();
        return;
      }

      if (!cached) this._renderGuestState();
    }
  }

  private _renderGuestState(): void {
    const root = this.shadowRoot;
    if (!root) return;

    const auth = root.querySelector<HTMLElement>('.header__auth');
    const name = root.querySelector<HTMLElement>('.header__auth-name');
    const profile = root.querySelector<HTMLElement>('.header__auth-profile');
    const profileName = root.querySelector<HTMLElement>('.header__auth-profile-name');
    const profileEmail = root.querySelector<HTMLElement>('.header__auth-profile-email');
    const signIn = root.querySelector<HTMLElement>('.header__auth-link--signin');
    const register = root.querySelector<HTMLElement>('.header__auth-link--register');
    const signOut = root.querySelector<HTMLElement>('.header__auth-signout');

    auth?.classList.remove('header__auth--user');
    if (name) name.textContent = '';
    if (profile) profile.hidden = true;
    if (profileName) profileName.textContent = '';
    if (profileEmail) profileEmail.textContent = '';
    if (signIn) signIn.hidden = false;
    if (register) register.hidden = false;
    if (signOut) signOut.hidden = true;
  }

  private _renderUserState(displayName: string, email: string): void {
    const root = this.shadowRoot;
    if (!root) return;

    const auth = root.querySelector<HTMLElement>('.header__auth');
    const name = root.querySelector<HTMLElement>('.header__auth-name');
    const profile = root.querySelector<HTMLElement>('.header__auth-profile');
    const profileName = root.querySelector<HTMLElement>('.header__auth-profile-name');
    const profileEmail = root.querySelector<HTMLElement>('.header__auth-profile-email');
    const signIn = root.querySelector<HTMLElement>('.header__auth-link--signin');
    const register = root.querySelector<HTMLElement>('.header__auth-link--register');
    const signOut = root.querySelector<HTMLElement>('.header__auth-signout');

    const normalizedName = displayName.trim();

    auth?.classList.add('header__auth--user');
    if (name) name.textContent = normalizedName;
    if (profile) profile.hidden = false;
    if (profileName) profileName.textContent = normalizedName;
    if (profileEmail) profileEmail.textContent = email.trim();
    if (signIn) signIn.hidden = true;
    if (register) register.hidden = true;
    if (signOut) signOut.hidden = false;
  }
}

customElements.define('zoo-header', ZooHeader);
export default ZooHeader;
