import styles from './zoo-btn.scss?inline';

// ─── <zoo-btn> ────────────────────────────────────────────────────────────────
// Attributes:
//   variant  – turquoise | orange | navy | outline | text | arrow | nav
//   label    – visible text (also used as aria-label when no label text)
//   href     – when set, renders an <a>; otherwise renders a <button>
//   disabled – boolean; disables interaction
//   active   – boolean; adds --active modifier (used by nav variant)
// Events:
//   zoo-click – composed CustomEvent that bubbles out of the shadow root

const template = document.createElement('template');

function buildTemplate() {
  // Placeholder — real element is built per-instance because href decides tag.
  // We still pre-build a <style> node; the element clone is done in connectedCallback.
}

buildTemplate();

export class ZooBtn extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'label', 'href', 'disabled', 'active'];
  }

  connectedCallback() {
    if (this.shadowRoot) return; // already initialised

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._buildEl();
  }

  attributeChangedCallback(_name, _old, _new) {
    if (_old === _new) return;
    if (this.shadowRoot) {
      // Re-render the inner element when any attribute changes.
      const existing = this.shadowRoot.querySelector('.btn');
      if (existing) existing.remove();
      this._buildEl();
    }
  }

  _buildEl() {
    const shadow = this.shadowRoot;
    const href     = this.getAttribute('href');
    const variant  = this.getAttribute('variant') || 'turquoise';
    const label    = this.getAttribute('label')   || '';
    const disabled = this.hasAttribute('disabled');
    const active   = this.hasAttribute('active');

    const el = document.createElement(href ? 'a' : 'button');
    el.className = `btn btn--${variant}${active ? ` btn--${variant}--active` : ''}`;

    if (href) {
      el.setAttribute('href', href);
    } else {
      el.type = 'button';
    }

    if (disabled) {
      if (href) {
        el.setAttribute('aria-disabled', 'true');
        el.setAttribute('tabindex', '-1');
      } else {
        el.disabled = true;
      }
    }

    if (label) {
      const span = document.createElement('span');
      span.textContent = label;
      el.appendChild(span);
    }

    el.addEventListener('click', (e) => {
      if (disabled) { e.preventDefault(); return; }
      this.dispatchEvent(new CustomEvent('zoo-click', {
        bubbles:  true,
        composed: true,
        detail:   { variant, label, href },
      }));
    });

    shadow.appendChild(el);
  }
}

customElements.define('zoo-btn', ZooBtn);
export default ZooBtn;
