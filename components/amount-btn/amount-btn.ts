import styles from './amount-btn.scss?inline';

const template = document.createElement('template');

function buildTemplate(): void {
  const button = document.createElement('button');
  button.className = 'amount-btn amount-btn--inactive';
  button.type = 'button';
  template.content.appendChild(button);
}

buildTemplate();

export class ZooAmountBtn extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['label', 'active'];
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    for (const attr of ZooAmountBtn.observedAttributes) {
      if (this.hasAttribute(attr)) {
        this._applyAttr(attr, this.getAttribute(attr));
      }
    }

    const btn = shadow.querySelector('.amount-btn');
    btn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('amount-select', {
        bubbles: true,
        composed: true,
        detail: { label: this.getAttribute('label') ?? '' },
      }));
    });
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (!this.shadowRoot) return;
    this._applyAttr(name, newVal);
  }

  private _applyAttr(name: string, value: string | null): void {
    const btn = this.shadowRoot?.querySelector('.amount-btn');
    if (!btn) return;

    switch (name) {
      case 'label':
        btn.textContent = value ?? '';
        break;
      case 'active': {
        const isActive = value !== null;
        btn.classList.toggle('amount-btn--active', isActive);
        btn.classList.toggle('amount-btn--inactive', !isActive);
        break;
      }
    }
  }
}

customElements.define('zoo-amount-btn', ZooAmountBtn);
export default ZooAmountBtn;
