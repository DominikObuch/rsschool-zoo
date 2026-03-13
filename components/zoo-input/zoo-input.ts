import styles from './zoo-input.scss?inline';

// Two template variants — selected at connectedCallback time based on [multiline]
const templateInput = document.createElement('template');
const templateTextarea = document.createElement('template');

function buildFieldTemplate(isTextarea: boolean): HTMLDivElement {
  const root = document.createElement('div');
  root.className = 'zoo-input';

  const label = document.createElement('label');
  label.className = 'zoo-input__label';

  const field = document.createElement(isTextarea ? 'textarea' : 'input') as HTMLInputElement | HTMLTextAreaElement;
  field.className = 'zoo-input__field';
  if (isTextarea && field instanceof HTMLTextAreaElement) {
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
  static get observedAttributes(): string[] {
    return ['label', 'placeholder', 'type', 'name', 'required', 'error', 'multiline'];
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const isTextarea = this.hasAttribute('multiline');
    const tpl = isTextarea ? templateTextarea : templateInput;
    shadow.appendChild(tpl.content.cloneNode(true));

    for (const attr of ZooInput.observedAttributes) {
      if (this.hasAttribute(attr)) {
        this._applyAttr(attr, this.getAttribute(attr));
      }
    }

    const field = shadow.querySelector<HTMLInputElement | HTMLTextAreaElement>('.zoo-input__field');
    (['input', 'change'] as const).forEach((type) => {
      field?.addEventListener(type, (e: Event) => {
        e.stopPropagation();
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        this.dispatchEvent(new CustomEvent(type, {
          bubbles: true,
          composed: true,
          detail: { value: target.value },
        }));
      });
    });

    (['focus', 'blur'] as const).forEach((type) => {
      field?.addEventListener(type, () => {
        this.dispatchEvent(new CustomEvent(type, {
          bubbles: true,
          composed: true,
        }));
      });
    });
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (!this.shadowRoot) return;
    this._applyAttr(name, newVal);
  }

  private _applyAttr(name: string, value: string | null): void {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    const field = shadow.querySelector<HTMLInputElement | HTMLTextAreaElement>('.zoo-input__field');
    const labelEl = shadow.querySelector('.zoo-input__label');
    const errorEl = shadow.querySelector('.zoo-input__error');

    switch (name) {
      case 'label':
        if (labelEl) labelEl.textContent = value ?? '';
        break;
      case 'placeholder':
        field?.setAttribute('placeholder', value ?? '');
        break;
      case 'type':
        if (field instanceof HTMLInputElement) field.setAttribute('type', value ?? 'text');
        break;
      case 'name':
        field?.setAttribute('name', value ?? '');
        break;
      case 'required':
        if (value !== null) {
          field?.setAttribute('required', '');
        } else {
          field?.removeAttribute('required');
        }
        break;
      case 'error': {
        const hasError = value !== null && value !== '';
        if (errorEl) errorEl.textContent = hasError ? value : '';
        errorEl?.classList.toggle('zoo-input__error--visible', hasError);
        field?.classList.toggle('zoo-input__field--error', hasError);
        break;
      }
    }
  }

  get value(): string {
    return this.shadowRoot?.querySelector<HTMLInputElement | HTMLTextAreaElement>('.zoo-input__field')?.value ?? '';
  }

  set value(v: string) {
    const field = this.shadowRoot?.querySelector<HTMLInputElement | HTMLTextAreaElement>('.zoo-input__field');
    if (field) field.value = v;
  }
}

customElements.define('zoo-input', ZooInput);
export default ZooInput;
