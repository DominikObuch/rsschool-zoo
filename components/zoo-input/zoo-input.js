import styles from './zoo-input.scss?inline';

// Two template variants — selected at connectedCallback time based on [multiline]
const templateInput    = document.createElement('template');
const templateTextarea = document.createElement('template');

function buildFieldTemplate(isTextarea) {
  const root = document.createElement('div');
  root.className = 'zoo-input';

  const label = document.createElement('label');
  label.className = 'zoo-input__label';

  const field = document.createElement(isTextarea ? 'textarea' : 'input');
  field.className = 'zoo-input__field';
  if (isTextarea) {
    field.rows = 4;
  }

  const errorMsg = document.createElement('span');
  errorMsg.className = 'zoo-input__error';

  root.appendChild(label);
  root.appendChild(field);
  root.appendChild(errorMsg);
  return root;
}

templateInput.content.appendChild(buildFieldTemplate(false));
templateTextarea.content.appendChild(buildFieldTemplate(true));

export class ZooInput extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'placeholder', 'type', 'name', 'required', 'error', 'multiline'];
  }

  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const isTextarea = this.hasAttribute('multiline');
    const tpl = isTextarea ? templateTextarea : templateInput;
    shadow.appendChild(tpl.content.cloneNode(true));

    // Apply all attributes present at connect time
    for (const attr of ZooInput.observedAttributes) {
      if (this.hasAttribute(attr)) {
        this._applyAttr(attr, this.getAttribute(attr));
      }
    }

    // Re-dispatch input/change so they cross the shadow boundary
    const field = shadow.querySelector('.zoo-input__field');
    ['input', 'change'].forEach(type => {
      field.addEventListener(type, (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent(type, {
          bubbles:    true,
          composed:   true,
          detail:     { value: field.value },
        }));
      });
    });
  }

  attributeChangedCallback(name, _old, newVal) {
    if (!this.shadowRoot) return;
    this._applyAttr(name, newVal);
  }

  _applyAttr(name, value) {
    const shadow    = this.shadowRoot;
    const field     = shadow.querySelector('.zoo-input__field');
    const labelEl   = shadow.querySelector('.zoo-input__label');
    const errorEl   = shadow.querySelector('.zoo-input__error');

    switch (name) {
      case 'label':
        labelEl.textContent = value ?? '';
        break;
      case 'placeholder':
        field.setAttribute('placeholder', value ?? '');
        break;
      case 'type':
        if (field.tagName === 'INPUT') field.setAttribute('type', value ?? 'text');
        break;
      case 'name':
        field.setAttribute('name', value ?? '');
        break;
      case 'required':
        value !== null
          ? field.setAttribute('required', '')
          : field.removeAttribute('required');
        break;
      case 'error': {
        const hasError = value !== null && value !== '';
        errorEl.textContent = hasError ? value : '';
        errorEl.classList.toggle('zoo-input__error--visible', hasError);
        field.classList.toggle('zoo-input__field--error', hasError);
        break;
      }
    }
  }

  // Convenience getter / setter for value
  get value() {
    return this.shadowRoot?.querySelector('.zoo-input__field')?.value ?? '';
  }
  set value(v) {
    const field = this.shadowRoot?.querySelector('.zoo-input__field');
    if (field) field.value = v;
  }
}

customElements.define('zoo-input', ZooInput);
export default ZooInput;
