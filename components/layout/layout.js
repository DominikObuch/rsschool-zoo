import styles from './layout.scss?inline';
import '../header/header.js';   // registers <zoo-header>
import '../footer/footer.js';   // registers <zoo-footer>

// ─── <zoo-layout> ─────────────────────────────────────────────────────────────
// Attributes:
//   active – forwarded to <zoo-header active="…"> to highlight the right nav item
//
// Usage:
//   <zoo-layout active="landing">
//     <section class="hero"> … </section>
//   </zoo-layout>

const template = document.createElement('template');

function buildTemplate() {
  const wrapper = document.createElement('div');
  wrapper.className = 'layout';

  const header = document.createElement('zoo-header');

  const main = document.createElement('main');
  main.className = 'layout__main';
  const slot = document.createElement('slot'); // slotted page content
  main.appendChild(slot);

  const footer = document.createElement('zoo-footer');

  wrapper.append(header, main, footer);
  template.content.appendChild(wrapper);
}

buildTemplate();

export class ZooLayout extends HTMLElement {
  static get observedAttributes() { return ['active']; }

  connectedCallback() {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
    this._forwardActive(this.getAttribute('active'));
  }

  attributeChangedCallback(name, _old, newVal) {
    if (name === 'active') this._forwardActive(newVal);
  }

  _forwardActive(page) {
    const header = this.shadowRoot?.querySelector('zoo-header');
    if (header && page) header.setAttribute('active', page);
  }
}

customElements.define('zoo-layout', ZooLayout);
export default ZooLayout;
