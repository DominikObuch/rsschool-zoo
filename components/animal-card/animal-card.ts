import styles from './animal-card.scss?inline';

const PLACEHOLDER_IMAGE = '/images/Placeholder.png';

const template = document.createElement('template');

function buildTemplate(): void {
  const link = document.createElement('a');
  link.className = 'animal-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'animal-card__image-wrap';

  const img = document.createElement('img');
  img.className = 'animal-card__image';
  img.alt = '';

  const badge = document.createElement('span');
  badge.className = 'animal-card__badge';

  imageWrap.append(img, badge);

  const body = document.createElement('div');
  body.className = 'animal-card__body';

  const species = document.createElement('h3');
  species.className = 'animal-card__species';

  const description = document.createElement('p');
  description.className = 'animal-card__description';

  const cta = document.createElement('span');
  cta.className = 'animal-card__cta';
  cta.textContent = 'view live cam';

  body.append(species, description, cta);
  link.append(imageWrap, body);
  template.content.appendChild(link);
}

buildTemplate();

export class AnimalCard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['nickname', 'species', 'description', 'image', 'href'];
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));
    this._applyAttrs();
  }

  attributeChangedCallback(): void {
    this._applyAttrs();
  }

  private _applyAttrs(): void {
    if (!this.shadowRoot) return;
    const root = this.shadowRoot;

    const link = root.querySelector<HTMLAnchorElement>('.animal-card');
    const img = root.querySelector<HTMLImageElement>('.animal-card__image');
    const badge = root.querySelector('.animal-card__badge');
    const speciesEl = root.querySelector('.animal-card__species');
    const descEl = root.querySelector('.animal-card__description');

    const href = this.getAttribute('href') || '../zoo/index.html';
    const nickname = this.getAttribute('nickname') || '';
    const species = this.getAttribute('species') || '';
    const description = this.getAttribute('description') || '';
    const image = this.getAttribute('image') || '';

    if (link) link.href = href;
    if (img) {
      img.onerror = () => {
        if (img.src.endsWith(PLACEHOLDER_IMAGE)) return;
        img.src = PLACEHOLDER_IMAGE;
      };
      img.src = image || PLACEHOLDER_IMAGE;
      img.alt = species;
    }
    if (badge) badge.textContent = nickname;
    if (speciesEl) speciesEl.textContent = species;
    if (descEl) descEl.textContent = description;
  }
}

customElements.define('animal-card', AnimalCard);
export default AnimalCard;
