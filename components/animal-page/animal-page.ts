import styles from './animal-page.scss?inline';
import '../live-cam-nav/live-cam-nav.ts';
import '../zoo-input/zoo-input.ts';
import '../amount-btn/amount-btn.ts';
import { AnimalSlug } from '../../src/types.ts';
import { getProductImagesBySlug } from '../../src/assets/product-images.ts';
import { camerasService } from '../../src/api/services/cameras.service.ts';
import { petsService } from '../../src/api/services/pets.service.ts';
import { mapPetDetailedDtoToViewModel } from '../../src/api/mappers/pet.mapper.ts';
import type { CameraDto } from '../../src/api/models/cameras.dto.ts';
import type { PetDetailedViewModel } from '../../src/api/mappers/pet.mapper.ts';

const ERROR_TEXT = 'Something went wrong. Please, refresh the page';

interface CameraNavItem {
  id: number;
  petId: number;
  label: string;
  slug: string;
  icon: string;
}

interface HeroData {
  pageTitle: string;
  camLabel: string;
  mainImage: string;
  mainAlt: string;
  thumbs: string[];
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function parseCoord(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function toPercentPosition(latitude: string, longitude: string): { x: string; y: string } {
  const lat = parseCoord(latitude);
  const lon = parseCoord(longitude);

  if (lat === null || lon === null) {
    return { x: '50%', y: '50%' };
  }

  const x = Math.min(100, Math.max(0, ((lon + 180) / 360) * 100));
  const y = Math.min(100, Math.max(0, ((90 - lat) / 180) * 100));

  return {
    x: `${x.toFixed(2)}%`,
    y: `${y.toFixed(2)}%`,
  };
}

function resolveSlug(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes('panda')) return AnimalSlug.Panda;
  if (normalized.includes('eagle')) return AnimalSlug.Eagle;
  if (normalized.includes('gorilla')) return AnimalSlug.Gorilla;
  if (normalized.includes('lemur')) return AnimalSlug.Lemur;
  return AnimalSlug.Panda;
}

function resolveIcon(slug: string): string {
  if (slug === AnimalSlug.Eagle) return '../../icons/Eagle.svg';
  if (slug === AnimalSlug.Gorilla) return '../../icons/Gorilla.svg';
  if (slug === AnimalSlug.Lemur) return '../../icons/Lemur.svg';
  return '../../icons/Panda.svg';
}

function toCameraNavItem(camera: CameraDto): CameraNavItem {
  const slug = resolveSlug(camera.text);
  return {
    id: camera.id,
    petId: camera.petId,
    label: camera.text,
    slug,
    icon: resolveIcon(slug),
  };
}

function buildHeroData(pet: PetDetailedViewModel, cameraLabel: string): HeroData {
  const title = `live ${pet.commonName} cams`;
  return {
    pageTitle: title,
    camLabel: cameraLabel,
    mainImage: pet.images.main,
    mainAlt: `${pet.commonName} main cam`,
    thumbs: [...pet.images.thumbs],
  };
}

function buildFallbackHeroData(slug: string): HeroData {
  const resolvedSlug = resolveSlug(slug);
  const images = getProductImagesBySlug(resolvedSlug as AnimalSlug);
  return {
    pageTitle: `live ${resolvedSlug} cams`,
    camLabel: 'Main live cam',
    mainImage: images.main,
    mainAlt: 'Main live cam image',
    thumbs: [...images.thumbs],
  };
}

function buildLiveCams(hero: HeroData, navItems: CameraNavItem[], activePetId: number | null): HTMLElement {
  const section = el('section', 'live-cams');

  const nav = document.createElement('live-cam-nav');
  if (navItems.length > 0) {
    nav.setAttribute('items', JSON.stringify(navItems));
  }
  if (activePetId !== null) {
    nav.setAttribute('active-pet-id', String(activePetId));
  }
  section.appendChild(nav);

  const content = el('div', 'live-cams__content');

  const header = el('div', 'live-cams__header');
  const title = el('h1', 'live-cams__title');
  title.textContent = hero.pageTitle;

  const donateBtn = el('button', 'live-cams__donate');
  donateBtn.type = 'button';
  donateBtn.textContent = 'donate now';
  donateBtn.addEventListener('click', () => {
    donateBtn.dispatchEvent(new CustomEvent('donate-click', { bubbles: true, composed: true }));
  });

  header.append(title, donateBtn);

  const main = el('div', 'live-cams__main');
  const camLabel = el('span', 'live-cams__cam-label');
  camLabel.textContent = hero.camLabel;

  const bigImg = el('img', 'live-cams__big') as HTMLImageElement;
  bigImg.src = hero.mainImage;
  bigImg.alt = hero.mainAlt;

  main.append(camLabel, bigImg);

  const moreLabel = el('p', 'live-cams__more-label');
  moreLabel.textContent = 'more live views';

  const carousel = el('div', 'live-cams__carousel');
  const prevBtn = el('button', 'live-cams__prev');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous cam');
  prevBtn.textContent = '<';

  const thumbsContainer = el('div', 'live-cams__thumbs');
  const thumbEls: HTMLElement[] = [];

  hero.thumbs.forEach((thumbSrc, index) => {
    const thumb = el('div', 'live-cams__thumb' + (index === 0 ? ' live-cams__thumb--active' : ''));
    const thumbLabel = el('span', 'live-cams__thumb-label');
    thumbLabel.textContent = `cam ${index + 1} locked`;

    const thumbImg = el('img') as HTMLImageElement;
    thumbImg.src = thumbSrc;
    thumbImg.alt = `${hero.mainAlt} preview ${index + 1}`;

    thumb.append(thumbLabel, thumbImg);
    thumbEls.push(thumb);
    thumbsContainer.appendChild(thumb);
  });

  const nextBtn = el('button', 'live-cams__next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next cam');
  nextBtn.textContent = '>';

  carousel.append(prevBtn, thumbsContainer, nextBtn);

  let activeThumbIndex = 0;
  const updateThumbState = (nextIndex: number): void => {
    thumbEls[activeThumbIndex]?.classList.remove('live-cams__thumb--active');
    activeThumbIndex = nextIndex;
    thumbEls[activeThumbIndex]?.classList.add('live-cams__thumb--active');
    prevBtn.disabled = activeThumbIndex === 0;
    nextBtn.disabled = activeThumbIndex >= thumbEls.length - 1;
    const selectedThumb = hero.thumbs[activeThumbIndex];
    if (selectedThumb) bigImg.src = selectedThumb;
  };

  prevBtn.disabled = true;
  nextBtn.disabled = thumbEls.length <= 1;

  prevBtn.addEventListener('click', () => {
    if (activeThumbIndex > 0) updateThumbState(activeThumbIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (activeThumbIndex < thumbEls.length - 1) updateThumbState(activeThumbIndex + 1);
  });

  thumbEls.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateThumbState(index));
  });

  const donateCta = el('button', 'live-cams__donate-cta');
  donateCta.type = 'button';
  donateCta.textContent = 'donate now';
  donateCta.addEventListener('click', () => {
    donateCta.dispatchEvent(new CustomEvent('donate-click', { bubbles: true, composed: true }));
  });

  content.append(header, main, moreLabel, carousel, donateCta);
  section.appendChild(content);
  return section;
}

function buildPayFeed(pet: PetDetailedViewModel): HTMLElement {
  const section = el('section', 'pay-feed');

  const text = el('div', 'pay-feed__text');
  const feedTitle = el('h2', 'pay-feed__title');
  feedTitle.textContent = `support ${pet.commonName}`;

  const feedBody = el('p', 'pay-feed__body');
  feedBody.textContent = pet.detailedDescription || pet.description;

  text.append(feedTitle, feedBody);

  const quickDonate = el('div', 'pay-feed__quick-donate');
  const quickLabel = el('p', 'pay-feed__quick-label');
  quickLabel.textContent = 'Quick Donate';

  const inputRow = el('div', 'pay-feed__input-row');
  const input = document.createElement('zoo-input');
  input.setAttribute('placeholder', '$ donation amount');

  const btn = document.createElement('amount-btn');
  btn.setAttribute('label', '->');

  inputRow.append(input, btn);
  quickDonate.append(quickLabel, inputRow);

  section.append(text, quickDonate);
  return section;
}

function buildDidYouKnow(pet: PetDetailedViewModel): HTMLElement {
  const section = el('section', 'did-you-know');

  const card = el('div', 'did-you-know__card');
  const cardTitle = el('h2', 'did-you-know__title');
  cardTitle.textContent = 'did you know?';

  const fact = el('p', 'did-you-know__fact');
  fact.textContent = pet.description;
  card.append(cardTitle, fact);

  const profile = el('div', 'did-you-know__profile');
  const dl = el('dl', 'did-you-know__info');

  const rows: Array<{ dt: string; dd: string; mapLink?: boolean }> = [
    { dt: 'Common name:', dd: pet.commonName },
    { dt: 'Scientific name:', dd: pet.scientificName },
    { dt: 'Type:', dd: pet.type },
    { dt: 'Size:', dd: pet.size },
    { dt: 'Diet:', dd: pet.diet },
    { dt: 'Habitat:', dd: pet.habitat },
    { dt: 'Range:', dd: pet.range, mapLink: true },
  ];

  rows.forEach((row) => {
    const dt = el('dt');
    dt.textContent = row.dt;

    const dd = el('dd');
    dd.textContent = row.dd;

    if (row.mapLink) {
      const mapBtn = el('button', 'did-you-know__map-link');
      mapBtn.type = 'button';
      mapBtn.textContent = 'view map';
      mapBtn.setAttribute('data-action', 'open-map');
      dd.appendChild(mapBtn);
    }

    dl.append(dt, dd);
  });

  const photo = el('img', 'did-you-know__photo') as HTMLImageElement;
  photo.src = pet.images.profile;
  photo.alt = pet.commonName;

  profile.append(dl, photo);

  const desc = el('p', 'did-you-know__description');
  desc.textContent = pet.detailedDescription || pet.description;

  section.append(card, profile, desc);
  return section;
}

function buildDetailsLoader(): HTMLDivElement {
  const loader = el('div', 'animal-page__loader');
  loader.textContent = 'Loading...';
  return loader;
}

function buildErrorBox(message: string): HTMLDivElement {
  const box = el('div', 'animal-page__error');
  box.textContent = message;
  return box;
}

function buildMapModal(): HTMLElement {
  const modal = el('div', 'map-modal');

  const panel = el('div', 'map-modal__panel');
  const closeBtn = el('button', 'map-modal__close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close map');
  closeBtn.setAttribute('data-action', 'close-map');
  closeBtn.textContent = 'x';

  const title = el('h3', 'map-modal__title');
  title.textContent = 'animal habitat map';

  const mapWrap = el('div', 'map-modal__map');
  const image = el('img', 'map-modal__image') as HTMLImageElement;
  image.src = '../../icons/map.svg';
  image.alt = 'World map';

  const pin = el('button', 'map-modal__pin');
  pin.type = 'button';
  pin.setAttribute('aria-label', 'Animal location');

  mapWrap.append(image, pin);

  const coords = el('p', 'map-modal__coords');
  coords.textContent = 'Location: 0, 0';

  panel.append(closeBtn, title, mapWrap, coords);
  modal.appendChild(panel);
  return modal;
}

export class AnimalPage extends HTMLElement {
  static get observedAttributes(): string[] { return ['slug']; }

  private _root: HTMLElement | null = null;
  private _cameras: CameraNavItem[] = [];
  private _activePetId: number | null = null;
  private _pet: PetDetailedViewModel | null = null;
  private readonly _onEsc: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._closeMapModal();
  };

  connectedCallback(): void {
    if (this.shadowRoot) return;

    const shadow = this.attachShadow({ mode: 'open' });
    const style = el('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const root = el('div', 'animal-page');
    shadow.appendChild(root);
    this._root = root;

    const fallbackHero = buildFallbackHeroData(this.getAttribute('slug') ?? AnimalSlug.Panda);
    this._renderHeroWithLoader(fallbackHero);
    void this._bootstrap();
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this._onEsc);
  }

  attributeChangedCallback(name: string): void {
    if (name === 'slug' && this.shadowRoot) {
      const fallbackHero = buildFallbackHeroData(this.getAttribute('slug') ?? AnimalSlug.Panda);
      this._renderHeroWithLoader(fallbackHero);
      void this._bootstrap();
    }
  }

  private _renderHeroWithLoader(hero: HeroData): void {
    if (!this._root) return;
    const live = buildLiveCams(hero, this._cameras, this._activePetId);
    this._root.replaceChildren(live, buildDetailsLoader());
    this._bindRootActions();
  }

  private _renderError(hero: HeroData): void {
    if (!this._root) return;
    const live = buildLiveCams(hero, this._cameras, this._activePetId);
    this._root.replaceChildren(live, buildErrorBox(ERROR_TEXT));
    this._bindRootActions();
  }

  private _renderLoaded(hero: HeroData, pet: PetDetailedViewModel): void {
    if (!this._root) return;
    const live = buildLiveCams(hero, this._cameras, this._activePetId);
    const payFeed = buildPayFeed(pet);
    const didYouKnow = buildDidYouKnow(pet);
    const mapModal = buildMapModal();

    this._root.replaceChildren(live, payFeed, didYouKnow, mapModal);
    this._bindRootActions();
  }

  private _bindRootActions(): void {
    if (!this._root) return;

    this._root.querySelector('live-cam-nav')?.addEventListener('camera-select', (e: Event) => {
      const custom = e as CustomEvent<{ petId?: number }>;
      const petId = custom.detail?.petId;
      if (!petId || petId === this._activePetId) return;
      void this._selectPet(petId);
    });

    this._root.querySelector('[data-action="open-map"]')?.addEventListener('click', () => {
      if (!this._pet) return;
      this._openMapModal(this._pet);
    });

    this._root.querySelector('[data-action="close-map"]')?.addEventListener('click', () => {
      this._closeMapModal();
    });

    this._root.querySelector('.map-modal')?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.classList.contains('map-modal')) this._closeMapModal();
    });
  }

  private async _bootstrap(): Promise<void> {
    const fallbackHero = buildFallbackHeroData(this.getAttribute('slug') ?? AnimalSlug.Panda);

    try {
      const camerasResponse = await camerasService.getCameras();
      this._cameras = camerasResponse.data.map((camera) => toCameraNavItem(camera));

      const slug = this.getAttribute('slug') ?? AnimalSlug.Panda;
      const initialCamera = this._cameras.find((cam) => cam.slug === slug) ?? this._cameras[0];
      if (!initialCamera) {
        this._renderError(fallbackHero);
        return;
      }

      await this._selectPet(initialCamera.petId);
    } catch {
      this._renderError(fallbackHero);
    }
  }

  private async _selectPet(petId: number): Promise<void> {
    if (!this._root) return;

    const currentHero = this._pet
      ? buildHeroData(this._pet, this._cameraLabelByPetId(this._activePetId))
      : buildFallbackHeroData(this.getAttribute('slug') ?? AnimalSlug.Panda);

    this._activePetId = petId;
    this._renderHeroWithLoader(currentHero);

    try {
      const response = await petsService.getPetById(petId);
      const pet = mapPetDetailedDtoToViewModel(response.data);
      this._pet = pet;
      const hero = buildHeroData(pet, this._cameraLabelByPetId(petId));
      this._renderLoaded(hero, pet);
    } catch {
      this._renderError(currentHero);
    }
  }

  private _cameraLabelByPetId(petId: number | null): string {
    if (petId === null) return 'Main live cam';
    const camera = this._cameras.find((item) => item.petId === petId);
    return camera?.label ?? 'Main live cam';
  }

  private _openMapModal(pet: PetDetailedViewModel): void {
    if (!this._root) return;
    const modal = this._root.querySelector<HTMLElement>('.map-modal');
    if (!modal) return;

    const coords = this._root.querySelector<HTMLElement>('.map-modal__coords');
    if (coords) {
      coords.textContent = `Location: ${pet.latitude}, ${pet.longitude}`;
    }

    const mapWrap = this._root.querySelector<HTMLElement>('.map-modal__map');
    if (mapWrap) {
      const pos = toPercentPosition(pet.latitude, pet.longitude);
      mapWrap.style.setProperty('--pin-x', pos.x);
      mapWrap.style.setProperty('--pin-y', pos.y);
    }

    modal.classList.add('map-modal--open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._onEsc);
  }

  private _closeMapModal(): void {
    if (!this._root) return;
    const modal = this._root.querySelector<HTMLElement>('.map-modal');
    if (!modal) return;

    modal.classList.remove('map-modal--open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onEsc);
  }
}

customElements.define('animal-page', AnimalPage);
export default AnimalPage;
