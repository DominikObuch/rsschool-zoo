import styles from './donate-popup.scss?inline';
import '../amount-btn/amount-btn.ts';
import { lockBodyScroll, unlockBodyScroll } from '../../src/utils/body-scroll-lock.ts';

// ─── <donate-popup> ───────────────────────────────────────────────────────────
// API:
//   donatePopup.open()  – show the popup, lock body scroll
//   donatePopup.close() – hide the popup, restore body scroll

const AMOUNTS: string[] = ['$20', '$30', '$50', '$80', '$100', 'other amount'];
const ASSET_BASE = import.meta.env.BASE_URL;

const template = document.createElement('template');

interface FeedPopupElement extends HTMLElement {
  open(step?: number): void;
  setAmount(value: string): void;
}

function buildTemplate(): void {
  const backdrop = document.createElement('div');
  backdrop.className = 'donate-popup__backdrop';

  const card = document.createElement('div');
  card.className = 'donate-popup__card';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'donate-popup__close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close popup');
  closeBtn.textContent = '×';

  const img = document.createElement('img');
  img.className = 'donate-popup__image';
  img.src = `${ASSET_BASE}images/donate.png`;
  img.alt = 'Hands touching a lion paw';

  const body = document.createElement('div');
  body.className = 'donate-popup__body';

  const title = document.createElement('h2');
  title.className = 'donate-popup__title';
  title.textContent = 'together we care, save and protect!';

  const text = document.createElement('p');
  text.className = 'donate-popup__text';
  text.textContent =
    "Your most generous gift not only cares for countless animals, but it also offers hope and a vital lifeline to the world's most endangered wildlife relying on us to survive.";

  const amounts = document.createElement('div');
  amounts.className = 'donate-popup__amounts';

  AMOUNTS.forEach((label: string) => {
    const btn = document.createElement('zoo-amount-btn');
    btn.setAttribute('label', label);
    amounts.appendChild(btn);
  });

  body.append(title, text, amounts);
  card.append(closeBtn, img, body);
  backdrop.appendChild(card);
  template.content.appendChild(backdrop);
}

buildTemplate();

export class DonatePopup extends HTMLElement {
  private _isOpen = false;

  private readonly _onKeydown: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const root = document.createElement('div');
    root.className = 'donate-popup';
    shadow.appendChild(root);

    root.appendChild(template.content.cloneNode(true));

    shadow.querySelector('.donate-popup__close')?.addEventListener('click', () => this.close());

    shadow.querySelector('.donate-popup__backdrop')?.addEventListener('click', (e: Event) => {
      if (e.target === shadow.querySelector('.donate-popup__backdrop')) this.close();
    });

    shadow.querySelector('.donate-popup__amounts')?.addEventListener('amount-select', (e: Event) => {
      const custom = e as CustomEvent<{ label?: string }>;
      const label = (custom.detail?.label ?? '').trim().toLowerCase();
      const digits = label.replace(/[^\d]/g, '');

      const feedPopup = document.getElementById('feed-popup') as FeedPopupElement | null;
      if (feedPopup) {
        if (digits) feedPopup.setAmount(digits);
        feedPopup.open(1);
      }

      this.dispatchEvent(new CustomEvent('donate-amount-select', {
        bubbles: true,
        composed: true,
        detail: { label },
      }));

      this.close();
    });
  }

  disconnectedCallback(): void {
    this.close();
  }

  open(): void {
    if (this._isOpen) return;
    const popup = this.shadowRoot?.querySelector('.donate-popup');
    if (!popup) return;

    this._isOpen = true;
    popup.classList.add('donate-popup--open');
    lockBodyScroll();
    document.addEventListener('keydown', this._onKeydown);
  }

  close(): void {
    if (!this._isOpen) return;
    this._isOpen = false;

    this.shadowRoot?.querySelector('.donate-popup')?.classList.remove('donate-popup--open');
    unlockBodyScroll();
    document.removeEventListener('keydown', this._onKeydown);
  }
}

customElements.define('donate-popup', DonatePopup);
export default DonatePopup;
