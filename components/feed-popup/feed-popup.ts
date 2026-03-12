import styles from './feed-popup.scss?inline';
import '../amount-btn/amount-btn.ts';

// ─── <feed-popup> ─────────────────────────────────────────────────────────────
// 3-step donation modal.
// API:  feedPopup.open(step?)  feedPopup.close()  feedPopup.setAmount(v)

const AMOUNTS_STEP1: string[] = ['$10', '$20', '$30', '$50', '$80', '$100'];

const ANIMALS: string[] = [
  'Lukas the Panda',
  'Andy the Lemur',
  'Glen the Gorilla',
  'Mike the Alligator',
  'Sam & Lora the eagles family',
  'Liz the Koala',
  'Shake the Lion',
  'Senja the Tiger',
];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function buildDots(activeStep: number): HTMLDivElement {
  const wrap = el('div', 'feed-popup__dots');
  for (let i = 1; i <= 3; i++) {
    const dot = el('span', 'feed-popup__dot');
    if (i < activeStep) dot.classList.add('feed-popup__dot--done');
    else if (i === activeStep) dot.classList.add('feed-popup__dot--active');
    wrap.appendChild(dot);
  }
  return wrap;
}

function buildStep1(): HTMLDivElement {
  const step = el('div', 'feed-popup__step');
  step.dataset.step = '1';

  const body = el('div', 'feed-popup__body');

  const sectionTitle = el('p', 'feed-popup__section-title');
  sectionTitle.textContent = 'Donation Information:';

  const amountLabel = el('p', 'feed-popup__field-label feed-popup__field-label--required');
  amountLabel.textContent = 'Choose your donation amount:';

  const amounts = el('div', 'feed-popup__amounts');
  AMOUNTS_STEP1.forEach((label: string, i: number) => {
    const btn = document.createElement('zoo-amount-btn');
    btn.setAttribute('label', label);
    if (i === 0) btn.setAttribute('active', '');
    amounts.appendChild(btn);
  });

  const otherRow = el('div', 'feed-popup__other');
  const otherBtn = document.createElement('zoo-amount-btn');
  otherBtn.setAttribute('label', 'other amount');
  const otherInput = el('input');
  otherInput.type = 'text';
  otherInput.setAttribute('aria-label', 'Custom donation amount');
  otherRow.append(otherBtn, otherInput);

  const specialWrap = el('div', 'feed-popup__special-pet-wrap');
  const specialBtn = el('button', 'feed-popup__special-pet-btn');
  specialBtn.type = 'button';
  specialBtn.textContent = 'for special pet';

  const dropdown = el('div', 'feed-popup__dropdown');
  const dropHeader = el('div', 'feed-popup__dropdown-header');
  const headerSpan = el('span');
  headerSpan.textContent = 'Choose your favourite';

  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('width', '12');
  chevron.setAttribute('height', '8');
  chevron.setAttribute('viewBox', '0 0 12 8');
  const chevPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  chevPath.setAttribute('d', 'M11 7L6 2 1 7');
  chevPath.setAttribute('stroke', '#00A092');
  chevPath.setAttribute('stroke-width', '2');
  chevPath.setAttribute('fill', 'none');
  chevPath.setAttribute('stroke-linecap', 'round');
  chevron.appendChild(chevPath);
  dropHeader.append(headerSpan, chevron);

  const dropInner = el('div', 'feed-popup__dropdown-inner');
  ANIMALS.forEach((name: string) => {
    const item = el('div', 'feed-popup__dropdown-item');
    item.textContent = name;
    item.setAttribute('role', 'option');
    dropInner.appendChild(item);
  });

  dropdown.append(dropHeader, dropInner);
  specialWrap.append(specialBtn, dropdown);

  const checkRow = el('div', 'feed-popup__checkbox-row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'feed-monthly-gift';
  const checkLabel = el('label');
  checkLabel.setAttribute('for', 'feed-monthly-gift');
  checkLabel.textContent = 'Make this a monthly recurring gift';
  checkRow.append(checkbox, checkLabel);

  const actions = el('div', 'feed-popup__actions');
  const nextBtn = el('button', 'feed-popup__next-btn');
  nextBtn.type = 'button';
  nextBtn.dataset.action = 'next';
  const nextSpan = el('span');
  nextSpan.textContent = 'next';
  const arrow = el('span', 'arrow');
  nextBtn.append(nextSpan, arrow);
  actions.append(buildDots(1), nextBtn);

  body.append(sectionTitle, amountLabel, amounts, otherRow, specialWrap, checkRow, actions);
  step.appendChild(body);
  return step;
}

function buildStep2(): HTMLDivElement {
  const step = el('div', 'feed-popup__step');
  step.dataset.step = '2';

  const body = el('div', 'feed-popup__body');

  const sectionTitle = el('p', 'feed-popup__section-title');
  sectionTitle.textContent = 'Billing Information:';

  const nameInput = document.createElement('zoo-input');
  nameInput.setAttribute('label', '* Your Name');
  nameInput.setAttribute('placeholder', 'First and last name');
  nameInput.setAttribute('name', 'billing-name');
  nameInput.setAttribute('required', '');

  const emailInput = document.createElement('zoo-input');
  emailInput.setAttribute('label', '* Your Email Address');
  emailInput.setAttribute('placeholder', 'Enter your email');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'billing-email');
  emailInput.setAttribute('required', '');

  const infoText = el('p', 'feed-popup__info-text');
  infoText.textContent =
    'You will receive emails from the Online Zoo, including updates and news on the latest discoveries and translations. You can unsubscribe at any time.';

  const actions = el('div', 'feed-popup__actions');
  const rightGroup = el('div', 'feed-popup__actions-right');

  const nextBtn = el('button', 'feed-popup__next-btn');
  nextBtn.type = 'button';
  nextBtn.dataset.action = 'next';
  const nextSpan = el('span');
  nextSpan.textContent = 'next';
  const arrowNext = el('span', 'arrow');
  nextBtn.append(nextSpan, arrowNext);

  const backBtn = el('button', 'feed-popup__back-btn');
  backBtn.type = 'button';
  backBtn.dataset.action = 'back';
  backBtn.textContent = 'Back';

  rightGroup.append(nextBtn, backBtn);
  actions.append(buildDots(2), rightGroup);

  body.append(sectionTitle, nameInput, emailInput, infoText, actions);
  step.appendChild(body);
  return step;
}

function buildStep3(): HTMLDivElement {
  const step = el('div', 'feed-popup__step');
  step.dataset.step = '3';

  const body = el('div', 'feed-popup__body');

  const sectionTitle = el('p', 'feed-popup__section-title');
  sectionTitle.textContent = 'Payment Information:';

  const cardInput = document.createElement('zoo-input');
  cardInput.setAttribute('label', '* Credit Card Number');
  cardInput.setAttribute('placeholder', '');
  cardInput.setAttribute('name', 'card-number');
  cardInput.setAttribute('required', '');

  const cvvInput = document.createElement('zoo-input');
  cvvInput.setAttribute('label', '* CVV Number');
  cvvInput.setAttribute('placeholder', '');
  cvvInput.setAttribute('name', 'cvv');
  cvvInput.setAttribute('required', '');

  const cardRow = el('div', 'feed-popup__card-row');
  cardRow.append(cardInput, cvvInput);

  const expiryRow = el('div', 'feed-popup__expiry-row');
  const expiryLabel = el('span', 'feed-popup__expiry-label');
  expiryLabel.textContent = '* Expiration Date';

  const expirySelects = el('div', 'feed-popup__expiry-selects');
  const monthSelect = el('select', 'feed-popup__select');
  monthSelect.setAttribute('name', 'exp-month');
  monthSelect.setAttribute('aria-label', 'Expiration month');

  const mPh = el('option');
  mPh.value = '';
  mPh.textContent = 'Month';
  mPh.disabled = true;
  mPh.selected = true;
  monthSelect.appendChild(mPh);

  ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December']
    .forEach((m: string, i: number) => {
      const opt = el('option');
      opt.value = String(i + 1).padStart(2, '0');
      opt.textContent = m;
      monthSelect.appendChild(opt);
    });

  const yearSelect = el('select', 'feed-popup__select');
  yearSelect.setAttribute('name', 'exp-year');
  yearSelect.setAttribute('aria-label', 'Expiration year');

  const yPh = el('option');
  yPh.value = '';
  yPh.textContent = 'Year';
  yPh.disabled = true;
  yPh.selected = true;
  yearSelect.appendChild(yPh);

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y <= currentYear + 10; y++) {
    const opt = el('option');
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }

  expirySelects.append(monthSelect, yearSelect);
  expiryRow.append(expiryLabel, expirySelects);

  const actions = el('div', 'feed-popup__actions');
  const rightGroup = el('div', 'feed-popup__actions-right');

  const completeBtn = el('button', 'feed-popup__complete-btn');
  completeBtn.type = 'button';
  completeBtn.dataset.action = 'complete';
  const completeSpan = el('span');
  completeSpan.textContent = 'complete donation';
  const arrowComplete = el('span', 'arrow');
  completeBtn.append(completeSpan, arrowComplete);

  const backBtn = el('button', 'feed-popup__back-btn');
  backBtn.type = 'button';
  backBtn.dataset.action = 'back';
  backBtn.textContent = 'Back';

  rightGroup.append(completeBtn, backBtn);
  actions.append(buildDots(3), rightGroup);

  body.append(sectionTitle, cardRow, expiryRow, actions);
  step.appendChild(body);
  return step;
}

const template = document.createElement('template');

function buildTemplate(): void {
  const backdrop = el('div', 'feed-popup__backdrop');
  const card = el('div', 'feed-popup__card');

  const header = el('div', 'feed-popup__header');
  const headerTitle = el('h2');
  headerTitle.textContent = 'make your donation';
  header.appendChild(headerTitle);

  card.append(header, buildStep1(), buildStep2(), buildStep3());
  backdrop.appendChild(card);
  template.content.appendChild(backdrop);
}

buildTemplate();

export class FeedPopup extends HTMLElement {
  private _root: HTMLDivElement | null = null;
  private _step: number = 1;
  private readonly _onKeydown: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  connectedCallback(): void {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });
    const style = el('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const root = el('div', 'feed-popup');
    shadow.appendChild(root);

    root.appendChild(template.content.cloneNode(true));

    const step1 = root.querySelector<HTMLElement>('[data-step="1"]');
    if (step1) {
      const amountBtns = Array.from(step1.querySelectorAll<HTMLElement>('.feed-popup__amounts zoo-amount-btn'));
      const otherAmountBtn = step1.querySelector<HTMLElement>('.feed-popup__other zoo-amount-btn');

      const clearActive = (): void => {
        amountBtns.forEach((b) => b.removeAttribute('active'));
        otherAmountBtn?.removeAttribute('active');
      };

      amountBtns.forEach((btn) => {
        btn.addEventListener('amount-select', () => {
          clearActive();
          btn.setAttribute('active', '');
        });
      });

      otherAmountBtn?.addEventListener('amount-select', () => {
        clearActive();
        otherAmountBtn.setAttribute('active', '');
        step1.querySelector<HTMLInputElement>('.feed-popup__other input')?.focus();
      });

      const specialBtn = step1.querySelector<HTMLElement>('.feed-popup__special-pet-btn');
      const dropdown = step1.querySelector<HTMLElement>('.feed-popup__dropdown');
      const headerSpan = dropdown?.querySelector<HTMLElement>('.feed-popup__dropdown-header span');

      specialBtn?.addEventListener('click', () => {
        dropdown?.classList.toggle('feed-popup__dropdown--open');
      });

      dropdown?.querySelectorAll<HTMLElement>('.feed-popup__dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          dropdown.querySelectorAll('.feed-popup__dropdown-item')
            .forEach((i) => i.classList.remove('feed-popup__dropdown-item--selected'));
          item.classList.add('feed-popup__dropdown-item--selected');
          if (headerSpan) headerSpan.textContent = item.textContent;
          if (headerSpan) headerSpan.style.opacity = '1';
          dropdown.classList.remove('feed-popup__dropdown--open');
        });
      });

      root.addEventListener('click', (e: Event) => {
        const target = e.target as Node | null;
        if (
          specialBtn && dropdown &&
          !specialBtn.contains(target) &&
          !dropdown.contains(target)
        ) {
          dropdown.classList.remove('feed-popup__dropdown--open');
        }
      });
    }

    root.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement | null;
      const actionEl = target?.closest<HTMLElement>('[data-action]');
      const action = actionEl?.dataset.action;
      if (!action) return;
      if (action === 'next' && this._step < 3) this._goTo(this._step + 1);
      else if (action === 'back' && this._step > 1) this._goTo(this._step - 1);
      else if (action === 'complete') this.close();
    });

    root.querySelector('.feed-popup__backdrop')?.addEventListener('click', (e: Event) => {
      if (e.target === root.querySelector('.feed-popup__backdrop')) this.close();
    });

    this._root = root;
    this._step = 1;
  }

  private _goTo(n: number): void {
    if (!this._root) return;
    this._root.querySelectorAll('.feed-popup__step')
      .forEach((s) => s.classList.remove('feed-popup__step--active'));
    const target = this._root.querySelector<HTMLElement>(`[data-step="${n}"]`);
    if (target) target.classList.add('feed-popup__step--active');
    this._step = n;
  }

  open(step: number = 1): void {
    if (!this.shadowRoot || !this._root) return;
    this._goTo(step);
    this._root.classList.add('feed-popup--open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._onKeydown);
  }

  close(): void {
    if (!this._root) return;
    this._root.classList.remove('feed-popup--open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKeydown);
  }

  setAmount(value: string): void {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('.feed-popup__other input');
    if (input) input.value = value;
  }
}

customElements.define('feed-popup', FeedPopup);
export default FeedPopup;
