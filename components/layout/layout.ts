import styles from './layout.scss?inline';
import '../header/header.ts';
import '../footer/footer.ts';

const template = document.createElement('template');

function buildTemplate(): void {
  const wrapper = document.createElement('div');
  wrapper.className = 'layout';

  const header = document.createElement('zoo-header');

  const main = document.createElement('main');
  main.className = 'layout__main';
  const slot = document.createElement('slot');
  main.appendChild(slot);

  const footer = document.createElement('zoo-footer');

  wrapper.append(header, main, footer);
  template.content.appendChild(wrapper);
}

buildTemplate();

export class ZooLayout extends HTMLElement {
  static get observedAttributes(): string[] { return ['active']; }

  connectedCallback(): void {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
    this._forwardActive(this.getAttribute('active'));
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (name === 'active') this._forwardActive(newVal);
  }

  private _forwardActive(page: string | null): void {
    const header = this.shadowRoot?.querySelector('zoo-header');
    if (header && page) header.setAttribute('active', page);
  }
}

customElements.define('zoo-layout', ZooLayout);
export default ZooLayout;
