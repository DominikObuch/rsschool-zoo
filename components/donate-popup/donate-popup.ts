import styles from './donate-popup.scss?inline';
import '../amount-btn/amount-btn.ts';

// ─── <donate-popup> ───────────────────────────────────────────────────────────
// API:
//   donatePopup.open()  – show the popup, lock body scroll
//   donatePopup.close() – hide the popup, restore body scroll

const AMOUNTS: string[] = ['$20', '$30', '$50', '$80', '$100', 'other amount'];

const template = document.createElement('template');

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
  img.src = '../../images/donate.png';
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
  }

  open(): void {
    const popup = this.shadowRoot?.querySelector('.donate-popup');
    if (!popup) return;
    popup.classList.add('donate-popup--open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._onKeydown);
  }

  close(): void {
    this.shadowRoot?.querySelector('.donate-popup')?.classList.remove('donate-popup--open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKeydown);
  }
}

customElements.define('donate-popup', DonatePopup);
export default DonatePopup;
