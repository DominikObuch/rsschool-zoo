import styles from './slider.scss?inline';
import type { SliderLayout } from '../../src/types.ts';

const template = document.createElement('template');

function buildTemplate(): void {
  const root = document.createElement('div');
  root.className = 'slider';

  const controls = document.createElement('div');
  controls.className = 'slider__controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'slider__btn slider__btn--prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.type = 'button';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'slider__btn slider__btn--next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.type = 'button';

  controls.append(prevBtn, nextBtn);

  const grid = document.createElement('div');
  grid.className = 'slider__grid';

  const slot = document.createElement('slot');
  grid.appendChild(slot);

  root.append(controls, grid);
  template.content.appendChild(root);
}

buildTemplate();

export class ZooSlider extends HTMLElement {
  #page: number = 0;

  private _prevBtn: HTMLButtonElement | null = null;
  private _nextBtn: HTMLButtonElement | null = null;
  private _grid: HTMLDivElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    this._prevBtn = shadow.querySelector<HTMLButtonElement>('.slider__btn--prev');
    this._nextBtn = shadow.querySelector<HTMLButtonElement>('.slider__btn--next');
    this._grid = shadow.querySelector<HTMLDivElement>('.slider__grid');

    this._prevBtn?.addEventListener('click', () => this._go(-1));
    this._nextBtn?.addEventListener('click', () => this._go(1));

    shadow.querySelector('slot')?.addEventListener('slotchange', () => this._update());

    this._resizeObserver = new ResizeObserver(() => this._update());
    this._resizeObserver.observe(document.documentElement);

    this._update();
  }

  disconnectedCallback(): void {
    this._resizeObserver?.disconnect();
  }

  private _cards(): Element[] {
    return Array.from(this.children);
  }

  private _layout(): SliderLayout {
    const w = window.innerWidth;
    let cols: number;
    let rows: number;
    if (w <= 480) { cols = 1; rows = 1; }
    else if (w <= 640) { cols = 2; rows = 1; }
    else if (w <= 1200) { cols = 3; rows = 2; }
    else { cols = 4; rows = 2; }
    return { cols, rows, perPage: cols * rows };
  }

  private _go(dir: number): void {
    const { perPage } = this._layout();
    const pages = Math.ceil(this._cards().length / perPage);
    if (pages <= 0) {
      this.#page = 0;
      this._update();
      return;
    }
    this.#page = (this.#page + dir + pages) % pages;
    this._update();
  }

  private _update(): void {
    const { cols, perPage } = this._layout();
    const cards = this._cards();
    const pages = Math.ceil(cards.length / perPage);

    if (this.#page >= pages) this.#page = Math.max(0, pages - 1);

    const start = this.#page * perPage;
    const end = start + perPage;

    cards.forEach((card, i) => {
      (card as HTMLElement).hidden = i < start || i >= end;
    });

    if (this._grid) {
      this._grid.style.setProperty('--slider-cols', String(cols));
    }

    if (this._prevBtn) this._prevBtn.disabled = pages <= 1;
    if (this._nextBtn) this._nextBtn.disabled = pages <= 1;
  }
}

customElements.define('zoo-slider', ZooSlider);
export default ZooSlider;
