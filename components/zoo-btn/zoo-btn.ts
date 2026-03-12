import styles from './zoo-btn.scss?inline';
import { BtnVariant } from '../../src/types.ts';

// ─── <zoo-btn> ────────────────────────────────────────────────────────────────
// Attributes:
//   variant  – turquoise | orange | navy | outline | text | arrow | nav
//   label    – visible text
//   href     – when set, renders an <a>; otherwise renders a <button>
//   disabled – boolean
//   active   – boolean; adds --active modifier (used by nav variant)
// Events:
//   zoo-click – composed CustomEvent that bubbles out of the shadow root

export class ZooBtn extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'label', 'href', 'disabled', 'active'];
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._buildEl();
  }

  attributeChangedCallback(_name: string, _old: string | null, _new: string | null): void {
    if (_old === _new) return;
    if (this.shadowRoot) {
      const existing = this.shadowRoot.querySelector('.btn');
      if (existing) existing.remove();
      this._buildEl();
    }
  }

  private _buildEl(): void {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    const href = this.getAttribute('href');
    const variant = (this.getAttribute('variant') as BtnVariant) || BtnVariant.Turquoise;
    const label = this.getAttribute('label') ?? '';
    const disabled = this.hasAttribute('disabled');
    const active = this.hasAttribute('active');

    const el = document.createElement(href ? 'a' : 'button') as HTMLAnchorElement | HTMLButtonElement;
    el.className = `btn btn--${variant}${active ? ` btn--${variant}--active` : ''}`;

    if (href && el instanceof HTMLAnchorElement) {
      el.href = href;
    } else if (el instanceof HTMLButtonElement) {
      el.type = 'button';
    }

    if (disabled) {
      if (href && el instanceof HTMLAnchorElement) {
        el.setAttribute('aria-disabled', 'true');
        el.setAttribute('tabindex', '-1');
      } else if (el instanceof HTMLButtonElement) {
        el.disabled = true;
      }
    }

    if (label) {
      const span = document.createElement('span');
      span.textContent = label;
      el.appendChild(span);
    }

    el.addEventListener('click', (e: Event) => {
      if (disabled) { e.preventDefault(); return; }
      this.dispatchEvent(new CustomEvent('zoo-click', {
        bubbles: true,
        composed: true,
        detail: { variant, label, href },
      }));
    });

    shadow.appendChild(el);
  }
}

customElements.define('zoo-btn', ZooBtn);
export default ZooBtn;
