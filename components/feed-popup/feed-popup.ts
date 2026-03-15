import styles from './feed-popup.scss?inline';
import '../amount-btn/amount-btn.ts';
import { petsService } from '../../src/api/services/pets.service.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { donationsService } from '../../src/api/services/donations.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';
import { lockBodyScroll, unlockBodyScroll } from '../../src/utils/body-scroll-lock.ts';
import type { PetDto } from '../../src/api/models/pets.dto.ts';

const AMOUNTS_STEP1: string[] = ['$10', '$20', '$30', '$50', '$80', '$100'];
const STORED_CARDS_KEY = 'zoo:saved-cards';

type Step = 1 | 2 | 3;

interface StoredCard {
  id: string;
  masked: string;
  cardNumber?: string;
  cvv?: string;
  expMonth: string;
  expYear: string;
}

interface StoredCardsByUser {
  [userId: string]: StoredCard[];
}

interface DonationFormState {
  amount: number | null;
  petId: number | null;
  monthly: boolean;
  name: string;
  email: string;
  cardNumber: string;
  cvv: string;
  expMonth: string;
  expYear: string;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

function buildDots(activeStep: Step): HTMLDivElement {
  const wrap = el('div', 'feed-popup__dots');
  for (let i = 1; i <= 3; i += 1) {
    const dot = el('span', 'feed-popup__dot');
    if (i < activeStep) dot.classList.add('feed-popup__dot--done');
    if (i === activeStep) dot.classList.add('feed-popup__dot--active');
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
  AMOUNTS_STEP1.forEach((label) => {
    const btn = document.createElement('zoo-amount-btn');
    btn.setAttribute('label', label);
    amounts.appendChild(btn);
  });

  const otherRow = el('div', 'feed-popup__other');
  const otherBtn = document.createElement('zoo-amount-btn');
  otherBtn.setAttribute('label', 'other amount');

  const otherInput = el('input');
  otherInput.type = 'text';
  otherInput.inputMode = 'numeric';
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

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M11 7L6 2 1 7');
  path.setAttribute('stroke', '#00A092');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');

  chevron.appendChild(path);
  dropHeader.append(headerSpan, chevron);

  const dropInner = el('div', 'feed-popup__dropdown-inner');
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

  const error = el('p', 'feed-popup__message feed-popup__message--error');
  error.setAttribute('data-step-error', '1');

  const actions = el('div', 'feed-popup__actions');
  const nextBtn = el('button', 'feed-popup__next-btn');
  nextBtn.type = 'button';
  nextBtn.dataset.action = 'next';

  const nextText = el('span');
  nextText.textContent = 'next';
  const arrow = el('span', 'arrow');

  nextBtn.append(nextText, arrow);
  actions.append(buildDots(1), nextBtn);

  body.append(sectionTitle, amountLabel, amounts, otherRow, specialWrap, checkRow, error, actions);
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
  infoText.textContent = 'You will receive emails from the Online Zoo. You can unsubscribe at any time.';

  const error = el('p', 'feed-popup__message feed-popup__message--error');
  error.setAttribute('data-step-error', '2');

  const actions = el('div', 'feed-popup__actions');
  const rightGroup = el('div', 'feed-popup__actions-right');

  const nextBtn = el('button', 'feed-popup__next-btn');
  nextBtn.type = 'button';
  nextBtn.dataset.action = 'next';

  const nextText = el('span');
  nextText.textContent = 'next';
  nextBtn.append(nextText, el('span', 'arrow'));

  const backBtn = el('button', 'feed-popup__back-btn');
  backBtn.type = 'button';
  backBtn.dataset.action = 'back';
  backBtn.textContent = 'Back';

  rightGroup.append(nextBtn, backBtn);
  actions.append(buildDots(2), rightGroup);

  body.append(sectionTitle, nameInput, emailInput, infoText, error, actions);
  step.appendChild(body);
  return step;
}

function buildStep3(): HTMLDivElement {
  const step = el('div', 'feed-popup__step');
  step.dataset.step = '3';

  const body = el('div', 'feed-popup__body');

  const sectionTitle = el('p', 'feed-popup__section-title');
  sectionTitle.textContent = 'Payment Information:';

  const savedCardsWrap = el('div', 'feed-popup__saved-cards');
  const savedLabel = el('label', 'feed-popup__saved-cards-label');
  savedLabel.textContent = 'Saved cards';

  const savedSelect = el('select', 'feed-popup__select feed-popup__saved-select') as HTMLSelectElement;
  savedSelect.setAttribute('name', 'saved-card');
  const savedDefault = el('option') as HTMLOptionElement;
  savedDefault.value = '';
  savedDefault.textContent = 'Choose saved card';
  savedDefault.selected = true;
  savedSelect.appendChild(savedDefault);

  savedCardsWrap.append(savedLabel, savedSelect);

  const cardInput = document.createElement('zoo-input');
  cardInput.setAttribute('label', '* Credit Card Number');
  cardInput.setAttribute('name', 'card-number');
  cardInput.setAttribute('required', '');

  const cvvInput = document.createElement('zoo-input');
  cvvInput.setAttribute('label', '* CVV Number');
  cvvInput.setAttribute('name', 'cvv');
  cvvInput.setAttribute('required', '');

  const cardRow = el('div', 'feed-popup__card-row');
  cardRow.append(cardInput, cvvInput);

  const expiryRow = el('div', 'feed-popup__expiry-row');
  const expiryLabel = el('span', 'feed-popup__expiry-label');
  expiryLabel.textContent = '* Expiration Date';

  const expirySelects = el('div', 'feed-popup__expiry-selects');
  const monthSelect = el('select', 'feed-popup__select') as HTMLSelectElement;
  monthSelect.setAttribute('name', 'exp-month');

  const monthPlaceholder = el('option') as HTMLOptionElement;
  monthPlaceholder.value = '';
  monthPlaceholder.textContent = 'Month';
  monthPlaceholder.selected = true;
  monthPlaceholder.disabled = true;
  monthSelect.appendChild(monthPlaceholder);

  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ].forEach((month, index) => {
    const option = el('option') as HTMLOptionElement;
    option.value = String(index + 1).padStart(2, '0');
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  const yearSelect = el('select', 'feed-popup__select') as HTMLSelectElement;
  yearSelect.setAttribute('name', 'exp-year');

  const yearPlaceholder = el('option') as HTMLOptionElement;
  yearPlaceholder.value = '';
  yearPlaceholder.textContent = 'Year';
  yearPlaceholder.selected = true;
  yearPlaceholder.disabled = true;
  yearSelect.appendChild(yearPlaceholder);

  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year <= currentYear + 10; year += 1) {
    const option = el('option') as HTMLOptionElement;
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  }

  expirySelects.append(monthSelect, yearSelect);
  expiryRow.append(expiryLabel, expirySelects);

  const saveCardRow = el('div', 'feed-popup__checkbox-row feed-popup__save-card-row');
  const saveCheckbox = el('input') as HTMLInputElement;
  saveCheckbox.type = 'checkbox';
  saveCheckbox.id = 'feed-save-card';

  const saveLabel2 = el('label');
  saveLabel2.setAttribute('for', 'feed-save-card');
  saveLabel2.textContent = 'Save card info for future donations';
  saveCardRow.append(saveCheckbox, saveLabel2);

  const error = el('p', 'feed-popup__message feed-popup__message--error');
  error.setAttribute('data-step-error', '3');

  const success = el('p', 'feed-popup__message feed-popup__message--success');
  success.setAttribute('data-step-success', '1');

  const actions = el('div', 'feed-popup__actions');
  const rightGroup = el('div', 'feed-popup__actions-right');

  const completeBtn = el('button', 'feed-popup__complete-btn');
  completeBtn.type = 'button';
  completeBtn.dataset.action = 'complete';
  const completeText = el('span');
  completeText.textContent = 'complete donation';
  completeBtn.append(completeText, el('span', 'arrow'));

  const backBtn = el('button', 'feed-popup__back-btn');
  backBtn.type = 'button';
  backBtn.dataset.action = 'back';
  backBtn.textContent = 'Back';

  rightGroup.append(completeBtn, backBtn);
  actions.append(buildDots(3), rightGroup);

  body.append(sectionTitle, savedCardsWrap, cardRow, expiryRow, saveCardRow, error, success, actions);
  step.appendChild(body);
  return step;
}

const template = document.createElement('template');

function buildTemplate(): void {
  const backdrop = el('div', 'feed-popup__backdrop');
  const card = el('div', 'feed-popup__card');

  const header = el('div', 'feed-popup__header');
  const title = el('h2');
  title.textContent = 'make your donation';
  header.appendChild(title);

  card.append(header, buildStep1(), buildStep2(), buildStep3());
  backdrop.appendChild(card);
  template.content.appendChild(backdrop);
}

buildTemplate();

export class FeedPopup extends HTMLElement {
  private _root: HTMLDivElement | null = null;
  private _isOpen = false;
  private _step: Step = 1;
  private _pets: PetDto[] = [];
  private _userId: string | null = null;
  private _isLoggedIn = false;
  private _savedCards: StoredCard[] = [];
  private _state: DonationFormState = this._initialState();

  private readonly _onKeydown = (e: KeyboardEvent): void => {
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

    this._root = root;
    this._wireStep1();
    this._wireCommonActions();
    this._wireFieldClearErrors();
    this._goTo(1);
  }

  disconnectedCallback(): void {
    if (this._isOpen) this.close();
  }

  private _initialState(): DonationFormState {
    return {
      amount: null,
      petId: null,
      monthly: false,
      name: '',
      email: '',
      cardNumber: '',
      cvv: '',
      expMonth: '',
      expYear: '',
    };
  }

  private _wireCommonActions(): void {
    if (!this._root) return;

    this._root.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement | null;
      const actionEl = target?.closest<HTMLElement>('[data-action]');
      const action = actionEl?.dataset.action;
      if (!action) return;

      if (action === 'next') {
        if (this._step === 1 && this._validateStep1()) this._goTo(2);
        else if (this._step === 2 && this._validateStep2()) this._goTo(3);
        return;
      }

      if (action === 'back') {
        if (this._step > 1) this._goTo((this._step - 1) as Step);
        return;
      }

      if (action === 'complete') {
        void this._completeDonation();
      }
    });

    this._root.querySelector('.feed-popup__backdrop')?.addEventListener('click', (e: Event) => {
      if (e.target === this._root?.querySelector('.feed-popup__backdrop')) this.close();
    });

    this._syncButtons();
  }

  private _wireFieldClearErrors(): void {
    if (!this._root) return;

    this._root.querySelectorAll('zoo-input').forEach((input) => {
      input.addEventListener('input', () => {
        input.removeAttribute('error');
        this._syncButtons();
      });

      input.addEventListener('change', () => {
        this._syncButtons();
      });
    });

    this._root.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      select.addEventListener('change', () => {
        select.classList.remove('feed-popup__select--error');
        this._syncButtons();
      });
    });

    const otherInput = this._root.querySelector<HTMLInputElement>('.feed-popup__other input');
    otherInput?.addEventListener('input', () => {
      otherInput.classList.remove('feed-popup__field--error');
      this._syncButtons();
    });
  }

  private _wireStep1(): void {
    if (!this._root) return;

    const step1 = this._root.querySelector<HTMLElement>('[data-step="1"]');
    if (!step1) return;

    const amountBtns = Array.from(step1.querySelectorAll<HTMLElement>('.feed-popup__amounts zoo-amount-btn'));
    const otherAmountBtn = step1.querySelector<HTMLElement>('.feed-popup__other zoo-amount-btn');
    const otherInput = step1.querySelector<HTMLInputElement>('.feed-popup__other input');

    const clearActive = (): void => {
      amountBtns.forEach((btn) => btn.removeAttribute('active'));
      otherAmountBtn?.removeAttribute('active');
    };

    amountBtns.forEach((btn) => {
      btn.addEventListener('amount-select', () => {
        clearActive();
        btn.setAttribute('active', '');
        const label = btn.getAttribute('label') ?? '$0';
        this._state.amount = Number(label.replace(/[^\d]/g, ''));
        this._syncButtons();
      });
    });

    otherAmountBtn?.addEventListener('amount-select', () => {
      clearActive();
      otherAmountBtn.setAttribute('active', '');
      otherInput?.focus();
      this._state.amount = null;
      this._syncButtons();
    });

    otherInput?.addEventListener('keydown', (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'e' || key === '+' || key === '-' || key === '.') e.preventDefault();
    });

    otherInput?.addEventListener('input', () => {
      const raw = otherInput.value;
      const digits = raw.replace(/[^\d]/g, '');
      if (raw !== digits) otherInput.value = digits;
      this._state.amount = digits ? Number(digits) : null;
      this._syncButtons();
    });

    const specialBtn = step1.querySelector<HTMLElement>('.feed-popup__special-pet-btn');
    const dropdown = step1.querySelector<HTMLElement>('.feed-popup__dropdown');
    const headerSpan = dropdown?.querySelector<HTMLElement>('.feed-popup__dropdown-header span');

    specialBtn?.addEventListener('click', () => {
      dropdown?.classList.toggle('feed-popup__dropdown--open');
    });

    this._root.addEventListener('click', (e: Event) => {
      const target = e.target as Node | null;
      if (specialBtn && dropdown && !specialBtn.contains(target) && !dropdown.contains(target)) {
        dropdown.classList.remove('feed-popup__dropdown--open');
      }
    });

    dropdown?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement | null;
      const item = target?.closest<HTMLElement>('.feed-popup__dropdown-item');
      if (!item) return;

      dropdown.querySelectorAll('.feed-popup__dropdown-item').forEach((elItem) => {
        elItem.classList.remove('feed-popup__dropdown-item--selected');
      });

      item.classList.add('feed-popup__dropdown-item--selected');
      this._state.petId = Number(item.dataset.petId);

      if (headerSpan) {
        headerSpan.textContent = item.textContent ?? 'Choose your favourite';
        headerSpan.style.opacity = '1';
      }

      dropdown.classList.remove('feed-popup__dropdown--open');
      this._syncButtons();
    });

    step1.querySelector<HTMLInputElement>('#feed-monthly-gift')?.addEventListener('change', (e: Event) => {
      this._state.monthly = (e.target as HTMLInputElement).checked;
    });

    this._syncButtons();
  }

  private _setButtonDisabled(selector: string, disabled: boolean): void {
    const btn = this._root?.querySelector<HTMLElement>(selector);
    if (!btn) return;
    if (disabled) btn.setAttribute('disabled', '');
    else btn.removeAttribute('disabled');
  }

  private _isStep1Ready(): boolean {
    const hasValidAmount = Number.isFinite(this._state.amount) && (this._state.amount ?? 0) > 0;
    const hasPet = Number.isFinite(this._state.petId) && (this._state.petId ?? 0) > 0;
    return hasValidAmount && hasPet;
  }

  private _isStep2Ready(): boolean {
    const nameInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-name"]') as (HTMLElement & { value: string }) | null;
    const emailInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-email"]') as (HTMLElement & { value: string }) | null;

    const name = nameInput?.value.trim() ?? '';
    const email = emailInput?.value.trim() ?? '';
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return nameRegex.test(name) && emailRegex.test(email);
  }

  private _isStep3Ready(): boolean {
    const cardInput = this._root?.querySelector<HTMLElement>('zoo-input[name="card-number"]') as (HTMLElement & { value: string }) | null;
    const cvvInput = this._root?.querySelector<HTMLElement>('zoo-input[name="cvv"]') as (HTMLElement & { value: string }) | null;
    const monthSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-month"]');
    const yearSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-year"]');

    const cardDigits = (cardInput?.value ?? '').replace(/\D/g, '');
    const cvv = (cvvInput?.value ?? '').trim();
    const expMonth = monthSelect?.value ?? '';
    const expYear = yearSelect?.value ?? '';

    if (!/^\d{16}$/.test(cardDigits)) return false;
    if (!/^\d{3}$/.test(cvv)) return false;
    if (!expMonth || !expYear) return false;

    const now = new Date();
    const selected = new Date(Number(expYear), Number(expMonth), 0);
    const current = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return selected > current;
  }

  private _syncButtons(): void {
    if (!this._root) return;
    const activeStep = this._root.querySelector<HTMLElement>(`[data-step="${this._step}"]`);
    const nextInStep = activeStep?.querySelector<HTMLElement>('.feed-popup__next-btn[data-action="next"]') ?? null;
    if (nextInStep) {
      if (this._step === 1 ? !this._isStep1Ready() : !this._isStep2Ready()) nextInStep.setAttribute('disabled', '');
      else nextInStep.removeAttribute('disabled');
    }

    this._root.querySelectorAll<HTMLElement>('.feed-popup__next-btn[data-action="next"]').forEach((btn) => {
      if (btn !== nextInStep) btn.setAttribute('disabled', '');
    });

    this._setButtonDisabled('.feed-popup__complete-btn', !this._isStep3Ready());
  }

  private _setStepError(step: Step, message: string): void {
    const node = this._root?.querySelector<HTMLElement>(`[data-step-error="${step}"]`);
    if (!node) return;
    node.textContent = message;
    node.classList.add('feed-popup__message--visible');
  }

  private _clearStepError(step: Step): void {
    const node = this._root?.querySelector<HTMLElement>(`[data-step-error="${step}"]`);
    if (!node) return;
    node.textContent = '';
    node.classList.remove('feed-popup__message--visible');
  }

  private _showSuccess(message: string): void {
    const node = this._root?.querySelector<HTMLElement>('[data-step-success="1"]');
    if (!node) return;
    node.textContent = message;
    node.classList.add('feed-popup__message--visible');
  }

  private _clearSuccess(): void {
    const node = this._root?.querySelector<HTMLElement>('[data-step-success="1"]');
    if (!node) return;
    node.textContent = '';
    node.classList.remove('feed-popup__message--visible');
  }

  private _renderPetOptions(): void {
    const inner = this._root?.querySelector<HTMLElement>('.feed-popup__dropdown-inner');
    if (!inner) return;

    inner.replaceChildren();
    this._pets.forEach((pet) => {
      const item = el('div', 'feed-popup__dropdown-item');
      item.textContent = pet.name;
      item.dataset.petId = String(pet.id);
      item.setAttribute('role', 'option');
      inner.appendChild(item);
    });
  }

  private async _loadPets(): Promise<void> {
    if (this._pets.length > 0) return;
    try {
      const response = await petsService.getPets();
      this._pets = response.data;
      this._renderPetOptions();
    } catch {
      this._setStepError(1, 'Failed to load pets list. Please refresh the page.');
    }
  }

  private _readProfileAndCards(): void {
    this._isLoggedIn = false;
    this._userId = null;
    this._savedCards = [];

    const token = authTokenStorage.get();
    if (!token) {
      this._toggleLoggedOnlyRows(false);
      return;
    }

    void authService.getProfile(token)
      .then((response) => {
        const profile = response.data;
        this._isLoggedIn = true;
        this._userId = String(profile.id ?? profile.login);
        this._state.name = this._state.name || profile.name;
        this._state.email = this._state.email || profile.email;
        this._applyStep2Values();

        this._savedCards = this._loadStoredCardsForUser(this._userId);
        this._renderStoredCards();
        this._toggleLoggedOnlyRows(true);
        this._syncButtons();
      })
      .catch(() => {
        this._toggleLoggedOnlyRows(false);
        this._syncButtons();
      });
  }

  private _toggleLoggedOnlyRows(visible: boolean): void {
    const saved = this._root?.querySelector<HTMLElement>('.feed-popup__saved-cards');
    const saveRow = this._root?.querySelector<HTMLElement>('.feed-popup__save-card-row');

    if (saved) saved.style.display = visible && this._savedCards.length > 0 ? '' : 'none';
    if (saveRow) saveRow.style.display = visible ? '' : 'none';
  }

  private _applyStep2Values(): void {
    const nameInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-name"]') as (HTMLElement & { value: string }) | null;
    const emailInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-email"]') as (HTMLElement & { value: string }) | null;

    if (nameInput) nameInput.value = this._state.name;
    if (emailInput) emailInput.value = this._state.email;
  }

  private _renderStoredCards(): void {
    const select = this._root?.querySelector<HTMLSelectElement>('.feed-popup__saved-select');
    if (!select) return;

    const options = [select.options[0]];
    select.replaceChildren(...options);

    this._savedCards.forEach((card) => {
      const option = el('option') as HTMLOptionElement;
      option.value = card.id;
      option.textContent = `${card.masked} (${card.expMonth}/${String(card.expYear).slice(-2)})`;
      select.appendChild(option);
    });

    select.onchange = () => {
      const selected = this._savedCards.find((item) => item.id === select.value);
      if (!selected) return;

      const cardInput = this._root?.querySelector<HTMLElement>('zoo-input[name="card-number"]') as (HTMLElement & { value: string }) | null;
      if (cardInput) cardInput.value = selected.cardNumber ?? selected.masked;

      const cvvInput = this._root?.querySelector<HTMLElement>('zoo-input[name="cvv"]') as (HTMLElement & { value: string }) | null;
      if (cvvInput) cvvInput.value = selected.cvv ?? '';

      const monthSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-month"]');
      const yearSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-year"]');
      if (monthSelect) monthSelect.value = selected.expMonth;
      if (yearSelect) yearSelect.value = selected.expYear;

      this._syncButtons();
    };

    this._toggleLoggedOnlyRows(this._isLoggedIn);
  }

  private _loadStoredCardsForUser(userId: string): StoredCard[] {
    try {
      const raw = localStorage.getItem(STORED_CARDS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StoredCardsByUser;
      const cards = parsed[userId];
      return Array.isArray(cards) ? cards : [];
    } catch {
      return [];
    }
  }

  private _saveStoredCardsForUser(userId: string, cards: StoredCard[]): void {
    let parsed: StoredCardsByUser = {};

    try {
      const raw = localStorage.getItem(STORED_CARDS_KEY);
      if (raw) parsed = JSON.parse(raw) as StoredCardsByUser;
    } catch {
      parsed = {};
    }

    parsed[userId] = cards;
    localStorage.setItem(STORED_CARDS_KEY, JSON.stringify(parsed));
  }

  private _validateStep1(): boolean {
    this._clearStepError(1);

    const otherBtn = this._root?.querySelector<HTMLElement>('.feed-popup__other zoo-amount-btn');
    const otherInput = this._root?.querySelector<HTMLInputElement>('.feed-popup__other input');

    if (otherBtn?.hasAttribute('active')) {
      const amount = Number(otherInput?.value ?? '');
      if (!Number.isFinite(amount) || amount <= 0) {
        this._setStepError(1, 'Please enter a valid amount greater than 0.');
        otherInput?.classList.add('feed-popup__field--error');
        return false;
      }
      this._state.amount = amount;
    }

    if (!this._state.amount || this._state.amount <= 0) {
      this._setStepError(1, 'Please choose donation amount.');
      return false;
    }

    if (!this._state.petId) {
      this._setStepError(1, 'Please choose a special pet before continuing.');
      return false;
    }

    return true;
  }

  private _validateStep2(): boolean {
    this._clearStepError(2);

    const nameInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-name"]') as (HTMLElement & { value: string }) | null;
    const emailInput = this._root?.querySelector<HTMLElement>('zoo-input[name="billing-email"]') as (HTMLElement & { value: string }) | null;

    const name = nameInput?.value.trim() ?? '';
    const email = emailInput?.value.trim() ?? '';

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;

    if (!nameRegex.test(name)) {
      nameInput?.setAttribute('error', 'Use letters only.');
      valid = false;
    }

    if (!emailRegex.test(email)) {
      emailInput?.setAttribute('error', 'Enter a valid email address.');
      valid = false;
    }

    if (!valid) {
      this._setStepError(2, 'Please fix the highlighted fields.');
      return false;
    }

    this._state.name = name;
    this._state.email = email;
    return true;
  }

  private _validateStep3(): boolean {
    this._clearStepError(3);

    const cardInput = this._root?.querySelector<HTMLElement>('zoo-input[name="card-number"]') as (HTMLElement & { value: string }) | null;
    const cvvInput = this._root?.querySelector<HTMLElement>('zoo-input[name="cvv"]') as (HTMLElement & { value: string }) | null;
    const monthSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-month"]');
    const yearSelect = this._root?.querySelector<HTMLSelectElement>('select[name="exp-year"]');

    const cardRaw = cardInput?.value.trim() ?? '';
    const cvv = cvvInput?.value.trim() ?? '';
    const expMonth = monthSelect?.value ?? '';
    const expYear = yearSelect?.value ?? '';

    const cardDigits = cardRaw.replace(/\D/g, '');

    let valid = true;

    if (!/^\d{16}$/.test(cardDigits)) {
      cardInput?.setAttribute('error', 'Card number must be 16 digits.');
      valid = false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      cvvInput?.setAttribute('error', 'CVV must be 3 digits.');
      valid = false;
    }

    if (!expMonth || !expYear) {
      monthSelect?.classList.add('feed-popup__select--error');
      yearSelect?.classList.add('feed-popup__select--error');
      valid = false;
    } else {
      const now = new Date();
      const selected = new Date(Number(expYear), Number(expMonth), 0);
      const current = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      if (selected <= current) {
        monthSelect?.classList.add('feed-popup__select--error');
        yearSelect?.classList.add('feed-popup__select--error');
        valid = false;
      }
    }

    if (!valid) {
      this._setStepError(3, 'Please provide valid card data and future expiration date.');
      return false;
    }

    this._state.cardNumber = cardDigits;
    this._state.cvv = cvv;
    this._state.expMonth = expMonth;
    this._state.expYear = expYear;
    return true;
  }

  private _maskCard(cardNumber: string): string {
    const digits = cardNumber.replace(/\D/g, '');
    const first4 = digits.slice(0, 4);
    const last4 = digits.slice(-4);
    return `${first4} **** **** ${last4}`;
  }

  private _saveCardIfNeeded(): void {
    if (!this._isLoggedIn || !this._userId) return;

    const saveChecked = this._root?.querySelector<HTMLInputElement>('#feed-save-card')?.checked ?? false;
    if (!saveChecked) return;

    const masked = this._maskCard(this._state.cardNumber);
    const card: StoredCard = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      masked,
      cardNumber: this._state.cardNumber.replace(/\D/g, ''),
      cvv: this._state.cvv,
      expMonth: this._state.expMonth,
      expYear: this._state.expYear,
    };

    const nextCards = [...this._savedCards, card];
    this._savedCards = nextCards;
    this._saveStoredCardsForUser(this._userId, nextCards);
    this._renderStoredCards();
    this._toggleLoggedOnlyRows(true);
  }

  private async _completeDonation(): Promise<void> {
    this._clearSuccess();

    if (!this._validateStep3()) return;
    if (!this._state.amount || !this._state.petId) {
      this._setStepError(3, 'Missing donation data. Please return to previous steps.');
      return;
    }

    const completeBtn = this._root?.querySelector<HTMLButtonElement>('.feed-popup__complete-btn');
    if (completeBtn) completeBtn.disabled = true;

    try {
      await donationsService.createDonation({
        amount: this._state.amount,
        petId: this._state.petId,
        name: this._state.name,
        email: this._state.email,
      });

      this._saveCardIfNeeded();
      const petName = this._pets.find((pet) => pet.id === this._state.petId)?.name ?? 'selected pet';
      this._showSuccess(`Thank you for your donation of ${this._state.amount} to ${petName}!`);

      window.setTimeout(() => {
        this.close();
      }, 800);
    } catch {
      this._setStepError(3, 'Something went wrong. Please, try again later.');
    } finally {
      if (completeBtn) completeBtn.disabled = false;
      this._syncButtons();
    }
  }

  private _goTo(step: Step): void {
    if (!this._root) return;

    this._root.querySelectorAll('.feed-popup__step').forEach((item) => {
      item.classList.remove('feed-popup__step--active');
    });

    this._root.querySelector<HTMLElement>(`[data-step="${step}"]`)?.classList.add('feed-popup__step--active');
    this._step = step;

    if (step === 2) this._applyStep2Values();
    if (step === 3) this._renderStoredCards();
    this._syncButtons();
  }

  private _resetUi(): void {
    if (!this._root) return;

    this._root.querySelectorAll<HTMLElement>('zoo-input').forEach((input) => {
      (input as HTMLElement & { value: string }).value = '';
      input.removeAttribute('error');
    });

    const otherInput = this._root.querySelector<HTMLInputElement>('.feed-popup__other input');
    if (otherInput) {
      otherInput.value = '';
      otherInput.classList.remove('feed-popup__field--error');
    }

    this._root.querySelectorAll<HTMLElement>('.feed-popup__amounts zoo-amount-btn').forEach((btn) => {
      btn.removeAttribute('active');
    });
    this._root.querySelector<HTMLElement>('.feed-popup__other zoo-amount-btn')?.removeAttribute('active');

    const dropdownHeader = this._root.querySelector<HTMLElement>('.feed-popup__dropdown-header span');
    if (dropdownHeader) {
      dropdownHeader.textContent = 'Choose your favourite';
      dropdownHeader.style.opacity = '0.6';
    }

    this._root.querySelectorAll<HTMLElement>('.feed-popup__dropdown-item').forEach((item) => {
      item.classList.remove('feed-popup__dropdown-item--selected');
    });

    this._root.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      select.selectedIndex = 0;
      select.classList.remove('feed-popup__select--error');
    });

    const monthly = this._root.querySelector<HTMLInputElement>('#feed-monthly-gift');
    if (monthly) monthly.checked = false;

    const saveCard = this._root.querySelector<HTMLInputElement>('#feed-save-card');
    if (saveCard) saveCard.checked = false;

    this._syncButtons();
  }

  open(step: number = 1): void {
    if (!this._root) return;

    const normalized: Step = step === 2 || step === 3 ? step : 1;

    this._clearStepError(1);
    this._clearStepError(2);
    this._clearStepError(3);
    this._clearSuccess();

    if (this._isOpen) {
      this._goTo(normalized);
      this._syncButtons();
      return;
    }

    this._isOpen = true;
    this._root.classList.add('feed-popup--open');
    lockBodyScroll();
    document.addEventListener('keydown', this._onKeydown);

    void this._loadPets();
    this._readProfileAndCards();
    this._goTo(normalized);
    this._syncButtons();
  }

  close(): void {
    if (!this._root || !this._isOpen) return;

    this._isOpen = false;
    this._root.classList.remove('feed-popup--open');
    unlockBodyScroll();
    document.removeEventListener('keydown', this._onKeydown);

    this._state = this._initialState();
    this._resetUi();
    this._goTo(1);
    this._syncButtons();
  }

  setAmount(value: string): void {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('.feed-popup__other input');
    const otherBtn = this.shadowRoot?.querySelector<HTMLElement>('.feed-popup__other zoo-amount-btn');

    if (!input || !otherBtn) return;

    const digits = value.replace(/[^\d]/g, '');
    input.value = digits;

    this.shadowRoot?.querySelectorAll<HTMLElement>('.feed-popup__amounts zoo-amount-btn').forEach((btn) => {
      btn.removeAttribute('active');
    });

    otherBtn.setAttribute('active', '');
    this._state.amount = digits ? Number(digits) : null;
    this._syncButtons();
  }
}

customElements.define('feed-popup', FeedPopup);
export default FeedPopup;
