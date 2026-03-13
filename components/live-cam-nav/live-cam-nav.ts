import styles from './live-cam-nav.scss?inline';
import type { AnimalNavItem } from '../../src/types.ts';

interface CameraNavItem extends AnimalNavItem {
  petId: number;
}

const DEFAULT_ITEMS: CameraNavItem[] = [
  { slug: 'panda', icon: '../../icons/Panda.svg', label: "Watch live from China's Panda Center", href: '#', petId: 1 },
  { slug: 'eagle', icon: '../../icons/Eagle.svg', label: 'The Bald Eagles Nest from West End cam', href: '#', petId: 2 },
  { slug: 'gorilla', icon: '../../icons/Gorilla.svg', label: 'Live from Gorilla Forest Corridor habitat cam', href: '#', petId: 3 },
  { slug: 'lemur', icon: '../../icons/Lemur.svg', label: 'Lemurs play in Madagascar, Lemuria ...', href: '#', petId: 4 },
];

const template = document.createElement('template');

function buildTemplate(): void {
  const nav = document.createElement('nav');
  nav.className = 'live-cam-nav';

  const header = document.createElement('div');
  header.className = 'live-cam-nav__header';

  const badge = document.createElement('div');
  badge.className = 'live-cam-nav__live-badge';

  const badgeText = document.createElement('span');
  badgeText.className = 'live-cam-nav__live-text';
  badgeText.textContent = 'live';

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

  const list = document.createElement('ul');
  list.className = 'live-cam-nav__list';

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
  static get observedAttributes(): string[] { return ['active-pet-id', 'items']; }

  private _items: CameraNavItem[] = DEFAULT_ITEMS;

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    shadow.querySelector('.live-cam-nav')?.classList.add('live-cam-nav--collapsed');

    shadow.querySelector('.live-cam-nav__toggle')?.addEventListener('click', () => {
      const nav = shadow.querySelector('.live-cam-nav');
      const btn = shadow.querySelector<HTMLButtonElement>('.live-cam-nav__toggle');
      if (!nav || !btn) return;
      const isNowCollapsed = nav.classList.toggle('live-cam-nav--collapsed');
      btn.textContent = isNowCollapsed ? '»' : '«';
      btn.setAttribute('aria-label', isNowCollapsed ? 'Expand navigation' : 'Collapse navigation');
    });

    this._parseItems();
    this._renderItems();
    this._highlightActive(this.getAttribute('active-pet-id'));
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (name === 'items') {
      this._parseItems();
      this._renderItems();
      this._highlightActive(this.getAttribute('active-pet-id'));
      return;
    }
    if (name === 'active-pet-id') this._highlightActive(newVal);
  }

  private _parseItems(): void {
    const raw = this.getAttribute('items');
    if (!raw) {
      this._items = DEFAULT_ITEMS;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CameraNavItem[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this._items = DEFAULT_ITEMS;
        return;
      }
      this._items = parsed.filter((item) => typeof item.petId === 'number' && Boolean(item.label));
      if (this._items.length === 0) this._items = DEFAULT_ITEMS;
    } catch {
      this._items = DEFAULT_ITEMS;
    }
  }

  private _renderItems(): void {
    if (!this.shadowRoot) return;
    const list = this.shadowRoot.querySelector<HTMLElement>('.live-cam-nav__list');
    if (!list) return;

    list.replaceChildren();
    for (const itemData of this._items) {
      const item = document.createElement('li');
      item.className = 'live-cam-nav__item';
      item.dataset.slug = itemData.slug;
      item.dataset.petId = String(itemData.petId);

      const iconWrap = document.createElement('div');
      iconWrap.className = 'live-cam-nav__icon-wrap';

      const img = document.createElement('img');
      img.className = 'live-cam-nav__icon';
      img.src = itemData.icon;
      img.alt = itemData.slug;

      const label = document.createElement('span');
      label.className = 'live-cam-nav__label';
      label.textContent = itemData.label;

      iconWrap.appendChild(img);
      item.append(iconWrap, label);
      item.addEventListener('click', () => {
        const petId = Number(item.dataset.petId);
        if (!Number.isFinite(petId)) return;
        this.dispatchEvent(new CustomEvent('camera-select', {
          bubbles: true,
          composed: true,
          detail: { petId },
        }));
      });

      list.appendChild(item);
    }
  }

  private _highlightActive(activePetId: string | null): void {
    if (!this.shadowRoot) return;
    const selected = Number(activePetId);
    this.shadowRoot.querySelectorAll<HTMLElement>('.live-cam-nav__item').forEach((item) => {
      item.classList.toggle('live-cam-nav__item--active', Number(item.dataset.petId) === selected);
    });
  }
}

customElements.define('live-cam-nav', LiveCamNav);
export default LiveCamNav;
