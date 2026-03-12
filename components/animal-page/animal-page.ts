import styles from './animal-page.scss?inline';
import '../live-cam-nav/live-cam-nav.ts';
import '../zoo-input/zoo-input.ts';
import '../amount-btn/amount-btn.ts';
import type { AnimalData, AnimalThumb, AnimalInfo } from '../../src/types.ts';
import { AnimalSlug } from '../../src/types.ts';

// ─── Animal data ──────────────────────────────────────────────────────────────
const ANIMALS: Record<AnimalSlug, AnimalData> = {
  [AnimalSlug.Panda]: {
    pageTitle:   'live panda cams',
    camLabel:    'Lucas, the Giant Panda cam 1',
    mainImage:   '../../images/youtubePlayer/pandaBig.png',
    mainAlt:     'Giant panda — Lucas, cam 1',
    thumbs: [
      { src: '../../images/youtubePlayer/Panda additional cam card.png',   alt: 'Panda cam 1', label: 'CAM 1', active: true },
      { src: '../../images/youtubePlayer/Panda additional cam card-1.png', alt: 'Panda cam 2', label: 'CAM 2' },
      { src: '../../images/youtubePlayer/Panda additional cam card-2.png', alt: 'Panda cam 3', label: 'CAM 3' },
    ],
    feedTitle: 'make the bamboo donation!',
    feedBody:  'Our process for bamboo donations first starts with a site evaluation. It is important that our team sees where the bamboo is growing, then determining if the bamboo is a species that our animals are currently eating. Thank you for your interest in donating bamboo for our pandas.',
    didFact:   'Pandas are often seen eating in a relaxed sitting posture, with their hind legs stretched out before them. They may appear sedentary, but they are skilled tree-climbers and efficient swimmers.',
    info: [
      { dt: 'Common name:',     dd: 'Giant Panda' },
      { dt: 'Scientific name:', dd: 'Ailuropoda melanoleuca' },
      { dt: 'Type:',            dd: 'Herbivore' },
      { dt: 'Size:',            dd: '4 to 5 feet' },
      { dt: 'Diet:',            dd: 'Omnivore' },
      { dt: 'Habitat:',         dd: 'Forests' },
      { dt: 'Range:',           dd: 'Eastern Asia' },
    ],
    photo:       '../../images/youtubePlayer/pandaBig.png',
    photoAlt:    'Giant Panda',
    description: 'Giant pandas are very unusual animals that eat almost exclusively bamboo, which is very low in nutrients. Because of this, they have many unique adaptations for their low-energy lifestyle. Giant pandas are solitary. They have a highly developed sense of smell that males use to avoid each other and to find females for mating in the spring. After a five-month pregnancy, females give birth to a cub or two, though they cannot care for both twins. The blind infants weigh only 5 ounces at birth and cannot crawl until they reach three months of age. They are born white, and develop their much loved coloring later. Habitat loss is the primary threat to this species. Its popularity around the world has helped the giant panda become the focus of successful conservation programs.',
  },

  [AnimalSlug.Eagle]: {
    pageTitle:   'bald eagle cams',
    camLabel:    'Bald Eagle cam',
    mainImage:   '../../images/youtubePlayer/baldEagleBIg.png',
    mainAlt:     'Bald Eagle cam',
    thumbs: [
      { src: '../../images/youtubePlayer/Eagles additional cam card.png',   alt: 'Eagle cam 1', label: 'CAM 1', active: true },
      { src: '../../images/youtubePlayer/Eagles additional cam card-1.png', alt: 'Eagle cam 2', label: 'CAM 2' },
      { src: '../../images/youtubePlayer/Eagles additional cam card-2.png', alt: 'Eagle cam 3', label: 'CAM 3' },
    ],
    feedTitle: 'keep the bald eagle cams streaming!',
    feedBody:  'Watch as this lifelong pair of eagle parents lay and protect eggs, feed their chicks and teach them to hunt and fly. Sam & Lora — 100% of the donations from this page will be utilized directly for the streaming and operational costs of this project.',
    didFact:   'Because of its role as a symbol of the US, but also because of its being a large predator, the bald eagle has many representations in popular culture. Not all of these representations are accurate. In particular, the movie or television bald eagle typically has a bold, powerful cry. The actual eagle has a much softer chirpy voice, not in keeping with its popular image.',
    info: [
      { dt: 'Common name:',     dd: 'Bald Eagle' },
      { dt: 'Scientific name:', dd: 'Haliaeetus leucocephalus' },
      { dt: 'Type:',            dd: 'Birds' },
      { dt: 'Size:',            dd: 'Body: 34–43 in; wingspan: 6–8 ft' },
      { dt: 'Diet:',            dd: 'Carnivore' },
      { dt: 'Habitat:',         dd: 'Seacoasts, rivers, large lakes or marshes' },
      { dt: 'Range:',           dd: 'Continental United States' },
    ],
    photo:       '../../images/youtubePlayer/baldEagleBIg.png',
    photoAlt:    'Bald Eagle',
    description: 'The bald eagle is a bird of prey found in North America. A sea eagle, it has two known subspecies and forms a species pair with the white-tailed eagle. Its range includes most of Canada and Alaska, all of the contiguous United States, and northern Mexico. It is found near large bodies of open water with an abundant food supply and old-growth trees for nesting. The bald eagle is an opportunistic feeder which subsists mainly on fish, which it swoops down and snatches from the water with its talons. It builds the largest nest of any North American bird and the largest tree nests ever recorded for any animal species, up to 4 m deep, 2.5 m wide, and 1 metric ton in weight. Sexual maturity is attained at the age of four to five years. Bald eagles can live up to 28 years in the wild and 36 years in captivity.',
  },

  [AnimalSlug.Gorilla]: {
    pageTitle:   'gorillas cams',
    camLabel:    'Gorilla cam',
    mainImage:   '../../images/youtubePlayer/gorillaBig.png',
    mainAlt:     'Gorilla cam',
    thumbs: [
      { src: '../../images/youtubePlayer/Gorilla additional cam card.png',   alt: 'Gorilla cam 1', label: 'CAM 1', active: true },
      { src: '../../images/youtubePlayer/Gorilla additional cam card-1.png', alt: 'Gorilla cam 2', label: 'CAM 2' },
      { src: '../../images/youtubePlayer/Gorilla additional cam card-2.png', alt: 'Gorilla cam 3', label: 'CAM 3' },
    ],
    feedTitle: 'make a difference for the gorillas!',
    feedBody:  'It is our goal to ensure the conservation and restoration of the gorilla population and their habitat in Central Africa. To do this, we need your help! Bring your food charity straight to Glen and his family.',
    didFact:   'In addition to having distinctive fingerprints like humans do, gorillas also have unique nose prints. Gorillas are the largest of the great apes, but the western lowland gorilla is the smallest of the subspecies.',
    info: [
      { dt: 'Common name:',     dd: 'Western Lowland Gorilla' },
      { dt: 'Scientific name:', dd: 'Gorilla gorilla gorilla' },
      { dt: 'Type:',            dd: 'Mammals' },
      { dt: 'Size:',            dd: 'Standing height: 4–6 feet' },
      { dt: 'Diet:',            dd: 'Omnivore' },
      { dt: 'Habitat:',         dd: 'Rainforests' },
      { dt: 'Range:',           dd: 'Western Africa' },
    ],
    photo:       '../../images/youtubePlayer/gorillaBig.png',
    photoAlt:    'Western Lowland Gorilla',
    description: "The western lowland gorilla is the most numerous and widespread of all gorilla subspecies. Populations can be found in Cameroon, the Central African Republic, the Democratic Republic of Congo and Equatorial Guinea as well as in large areas in Gabon and the Republic of Congo. The large, powerful bodies of gorillas are covered in coarse, dark fur, except on the face, ears, hands, and feet. Older male gorillas are called silverbacks because of the distinctive patch of silver hair on their backs. A gorilla's arms are longer than its legs, and it tends to walk on all fours by curling its fingers inward and walking on the knuckles. Gorillas are primarily herbivorous, feeding on plants, fruits and seeds. They live in groups of 2 to 30 individuals led by a dominant silverback male.",
  },

  [AnimalSlug.Lemur]: {
    pageTitle:   'lemur cams',
    camLabel:    'Ring-Tailed Lemur cam',
    mainImage:   '../../images/youtubePlayer/lemursBig.png',
    mainAlt:     'Ring-tailed lemur cam',
    thumbs: [
      { src: '../../images/youtubePlayer/Lemur additional cam card.png',   alt: 'Lemur cam 1', label: 'CAM 1', active: true },
      { src: '../../images/youtubePlayer/Lemur additional cam card-1.png', alt: 'Lemur cam 2', label: 'CAM 2' },
      { src: '../../images/youtubePlayer/Lemur additional cam card-2.png', alt: 'Lemur cam 3', label: 'CAM 3' },
    ],
    feedTitle: 'provide andy the lemur with fruits!',
    feedBody:  'More than 90% of lemur species are endangered and might face extinction in the nearest future. Watch the ring-tailed lemurs play and climb in this soothing setting and support them by donating for the fruits they adore.',
    didFact:   'A ring-tailed lemur mob will gather in open areas of the forest to sunbathe. They sit in what some call a "yoga position" with their bellies toward the sun and their arms and legs stretched out to the sides.',
    info: [
      { dt: 'Common name:',     dd: 'Ring-Tailed Lemur' },
      { dt: 'Scientific name:', dd: 'Lemur catta' },
      { dt: 'Type:',            dd: 'Mammals' },
      { dt: 'Size:',            dd: 'Head and body: 17.75 in; tail: 21.75 in' },
      { dt: 'Diet:',            dd: 'Herbivore' },
      { dt: 'Habitat:',         dd: 'Arid, open areas and forests' },
      { dt: 'Range:',           dd: 'Madagascar' },
    ],
    photo:       '../../images/youtubePlayer/lemursBig.png',
    photoAlt:    'Ring-Tailed Lemur',
    description: 'Ring-tailed lemurs are named for the 13 alternating black and white bands that adorn their tails. Unlike most other lemurs, ringtails spend 40 percent of their time on the ground, moving quadrupedally along the forest floor. Ring-tailed lemurs live in southwestern Madagascar, in arid, open spaces and forests in territories that range from 15 to 57 acres. As with all lemurs, olfactory communication relies on scent glands on their wrists and chests that they use to mark their foraging routes. They can also eat fruit, herbs and small vertebrates. Females usually give birth to their first baby when they are three years old, and usually once a year every year after that. All adult females participate in raising the offspring of the group. The median life expectancy for a ring-tailed lemur is about 16 years.',
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildLiveCams(data: AnimalData, slug: string): HTMLElement {
  const section = el('section', 'live-cams');

  const nav = document.createElement('live-cam-nav');
  nav.setAttribute('active', slug);
  section.appendChild(nav);

  const content = el('div', 'live-cams__content');

  const header = el('div', 'live-cams__header');
  const title = el('h1', 'live-cams__title');
  title.textContent = data.pageTitle;
  const donateBtn = el('button', 'live-cams__donate');
  donateBtn.type = 'button';
  donateBtn.textContent = 'donate now';
  donateBtn.addEventListener('click', () => {
    donateBtn.dispatchEvent(new CustomEvent('donate-click', { bubbles: true, composed: true }));
  });
  header.append(title, donateBtn);

  const main = el('div', 'live-cams__main');
  const camLabel = el('span', 'live-cams__cam-label');
  camLabel.textContent = data.camLabel;
  const bigImg = el('img', 'live-cams__big') as HTMLImageElement;
  bigImg.src = data.mainImage;
  bigImg.alt = data.mainAlt;
  main.append(camLabel, bigImg);

  const moreLabel = el('p', 'live-cams__more-label');
  moreLabel.textContent = 'more live views';

  const carousel = el('div', 'live-cams__carousel');
  const prevBtn = el('button', 'live-cams__prev');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous cam');
  prevBtn.textContent = '\u2039';

  const thumbsContainer = el('div', 'live-cams__thumbs');
  for (const thumb of data.thumbs) {
    const thumbDiv = el('div', 'live-cams__thumb' + (thumb.active ? ' live-cams__thumb--active' : ''));
    const thumbLabel = el('span', 'live-cams__thumb-label');
    thumbLabel.textContent = thumb.label + ' \uD83D\uDD12';
    const thumbImg = el('img') as HTMLImageElement;
    thumbImg.src = thumb.src;
    thumbImg.alt = thumb.alt;
    thumbDiv.append(thumbLabel, thumbImg);
    thumbsContainer.appendChild(thumbDiv);
  }

  const nextBtn = el('button', 'live-cams__next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next cam');
  nextBtn.textContent = '\u203A';

  carousel.append(prevBtn, thumbsContainer, nextBtn);

  let activeThumbIndex = 0;
  const thumbEls = Array.from(thumbsContainer.children) as HTMLElement[];

  const updateCarousel = (newIndex: number): void => {
    thumbEls[activeThumbIndex].classList.remove('live-cams__thumb--active');
    activeThumbIndex = newIndex;
    thumbEls[activeThumbIndex].classList.add('live-cams__thumb--active');
    prevBtn.disabled = activeThumbIndex === 0;
    nextBtn.disabled = activeThumbIndex === thumbEls.length - 1;
  };

  prevBtn.disabled = true;
  prevBtn.addEventListener('click', () => {
    if (activeThumbIndex > 0) updateCarousel(activeThumbIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (activeThumbIndex < thumbEls.length - 1) updateCarousel(activeThumbIndex + 1);
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

function buildPayFeed(data: AnimalData): HTMLElement {
  const section = el('section', 'pay-feed');

  const text = el('div', 'pay-feed__text');
  const feedTitle = el('h2', 'pay-feed__title');
  feedTitle.textContent = data.feedTitle;
  const feedBody = el('p', 'pay-feed__body');
  feedBody.textContent = data.feedBody;
  text.append(feedTitle, feedBody);

  const quickDonate = el('div', 'pay-feed__quick-donate');
  const quickLabel = el('p', 'pay-feed__quick-label');
  quickLabel.textContent = 'Quick Donate';
  const inputRow = el('div', 'pay-feed__input-row');
  const input = document.createElement('zoo-input');
  input.setAttribute('placeholder', '$ donation amount');
  const btn = document.createElement('amount-btn');
  btn.setAttribute('label', '\u2192');
  inputRow.append(input, btn);
  quickDonate.append(quickLabel, inputRow);

  section.append(text, quickDonate);
  return section;
}

function buildDidYouKnow(data: AnimalData): HTMLElement {
  const section = el('section', 'did-you-know');

  const card = el('div', 'did-you-know__card');
  const cardTitle = el('h2', 'did-you-know__title');
  cardTitle.textContent = 'did you know?';
  const fact = el('p', 'did-you-know__fact');
  fact.textContent = data.didFact;
  card.append(cardTitle, fact);

  const profile = el('div', 'did-you-know__profile');
  const dl = el('dl', 'did-you-know__info');
  for (const row of data.info) {
    const dt = el('dt');
    dt.textContent = row.dt;
    const dd = el('dd');
    if (row.dt === 'Range:') {
      dd.textContent = row.dd + '\u00A0';
      const mapLink = el('a', 'did-you-know__map-link') as HTMLAnchorElement;
      mapLink.href = '../map/index.html';
      mapLink.textContent = 'view map';
      dd.appendChild(mapLink);
    } else {
      dd.textContent = row.dd;
    }
    dl.append(dt, dd);
  }

  const photo = el('img', 'did-you-know__photo') as HTMLImageElement;
  photo.src = data.photo;
  photo.alt = data.photoAlt;
  profile.append(dl, photo);

  const desc = el('p', 'did-you-know__description');
  desc.textContent = data.description;

  section.append(card, profile, desc);
  return section;
}

// ─── Component ────────────────────────────────────────────────────────────────

export class AnimalPage extends HTMLElement {
  static get observedAttributes(): string[] { return ['slug']; }

  connectedCallback(): void {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' });
    const style = el('style');
    style.textContent = styles;
    this.shadowRoot!.appendChild(style);
    this._render(this.getAttribute('slug') ?? AnimalSlug.Panda);
  }

  attributeChangedCallback(name: string, _old: string | null, newVal: string | null): void {
    if (name === 'slug' && this.shadowRoot) {
      const style = this.shadowRoot.querySelector('style');
      this.shadowRoot.replaceChildren(style!);
      this._render(newVal ?? AnimalSlug.Panda);
    }
  }

  private _render(slug: string): void {
    const data = ANIMALS[slug as AnimalSlug] ?? ANIMALS[AnimalSlug.Panda];
    this.shadowRoot!.appendChild(buildLiveCams(data, slug));
    this.shadowRoot!.appendChild(buildPayFeed(data));
    this.shadowRoot!.appendChild(buildDidYouKnow(data));
  }
}

customElements.define('animal-page', AnimalPage);
export default AnimalPage;

// Satisfy compiler — imported but inferred types used
export type { AnimalThumb, AnimalInfo };
