import '../../src/styles/main.scss';
import './landing.scss';
import type { DonatePopup } from '../../components/donate-popup/donate-popup.ts';
import type { FeedPopup } from '../../components/feed-popup/feed-popup.ts';
import { petsService } from '../../src/api/services/pets.service.ts';
import { feedbackService } from '../../src/api/services/feedback.service.ts';
import { mapPetDtoToViewModel } from '../../src/api/mappers/pet.mapper.ts';
import type { FeedbackItemDto } from '../../src/api/models/feedback.dto.ts';

const FEEDBACK_ERROR_TEXT = 'Something went wrong. Please, refresh the page';

function createLoader(label: string): HTMLDivElement {
  const loader = document.createElement('div');
  loader.className = 'landing-loader';
  loader.textContent = label;
  return loader;
}

function createError(message: string): HTMLParagraphElement {
  const error = document.createElement('p');
  error.className = 'landing-error';
  error.textContent = message;
  return error;
}

function buildReviewCard(item: FeedbackItemDto): HTMLElement {
  const card = document.createElement('article');
  card.className = 'review-card';

  const quote = document.createElement('span');
  quote.className = 'review-card__quote';
  quote.setAttribute('aria-hidden', 'true');

  const location = document.createElement('h3');
  location.className = 'review-card__location';
  location.textContent = `${item.city}, ${item.month} ${item.year}`;

  const body = document.createElement('p');
  body.className = 'review-card__body';
  body.textContent = item.text;

  const author = document.createElement('p');
  author.className = 'review-card__author';
  author.textContent = item.name;

  card.append(quote, location, body, author);
  return card;
}

async function initLandingData(): Promise<void> {
  const petsSlider = document.querySelector<HTMLElement>('zoo-slider.pets__slider');
  const reviewsSlider = document.querySelector<HTMLElement>('zoo-slider.reviews__slider');

  if (!petsSlider || !reviewsSlider) return;

  const petsLoader = createLoader('Loading pets...');
  const reviewsLoader = createLoader('Loading reviews...');
  petsSlider.replaceChildren(petsLoader);
  reviewsSlider.replaceChildren(reviewsLoader);

  const [petsResult, feedbackResult] = await Promise.allSettled([
    petsService.getPets(),
    feedbackService.getFeedback(),
  ]);

  if (petsResult.status === 'fulfilled') {
    const cards = petsResult.value.data.map((dto) => {
      const pet = mapPetDtoToViewModel(dto);
      const card = document.createElement('animal-card');
      card.setAttribute('nickname', pet.name);
      card.setAttribute('species', pet.commonName);
      card.setAttribute('description', pet.description);
      card.setAttribute('image', pet.images.profile);
      card.setAttribute('href', '../zoo/index.html');
      return card;
    });
    petsSlider.replaceChildren(...cards);
  } else {
    petsSlider.replaceChildren(createError(FEEDBACK_ERROR_TEXT));
  }

  if (feedbackResult.status === 'fulfilled') {
    const cards = feedbackResult.value.data.map((item) => buildReviewCard(item));
    reviewsSlider.replaceChildren(...cards);
  } else {
    reviewsSlider.replaceChildren(createError(FEEDBACK_ERROR_TEXT));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void initLandingData();

  const submitBtn = document.querySelector<HTMLButtonElement>('.donation__submit');
  const amountInput = document.querySelector<HTMLInputElement>('.donation__amount');

  submitBtn?.addEventListener('click', () => {
    const amount = amountInput?.value.trim();
    if (!amount) {
      amountInput?.focus();
      return;
    }
    const feedPopup = document.getElementById('feed-popup') as FeedPopup | null;
    if (feedPopup) {
      feedPopup.setAmount(amount);
      feedPopup.open(1);
    }
  });

  // ─── Care section — "feed" buttons open feed-popup ──────────────────────
  const feedPopupEl = document.getElementById('feed-popup') as FeedPopup | null;
  document.querySelectorAll<HTMLElement>('.care__card-feed').forEach((feedBtn) => {
    feedBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      feedPopupEl?.open(1);
    });
  });

  // ─── Care section mobile slider ──────────────────────────────────────────
  const careCards = Array.from(document.querySelectorAll<HTMLElement>('.care__card'));
  const careDots = Array.from(document.querySelectorAll<HTMLElement>('.care__dot'));
  let careIndex = 0;

  const isMobileCare = (): boolean => window.innerWidth <= 639;

  const updateCareSlider = (): void => {
    if (!isMobileCare()) {
      careCards.forEach((c) => {
        c.classList.remove('care__card--active');
        c.style.display = '';
      });
      careDots.forEach((d) => d.classList.remove('care__dot--active'));
      return;
    }

    careCards.forEach((card, i) => {
      card.classList.toggle('care__card--active', i === careIndex);
    });
    careDots.forEach((dot, i) => {
      dot.classList.toggle('care__dot--active', i === careIndex);
    });
  };

  careDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      careIndex = i;
      updateCareSlider();
    });
  });

  const careResizeObserver = new ResizeObserver(() => updateCareSlider());
  careResizeObserver.observe(document.documentElement);

  updateCareSlider();

  // ─── Donate Now button (pay-feed section) ───────────────────────────────
  const donatePopup = document.getElementById('donate-popup') as DonatePopup | null;
  document.querySelector('.pay-feed__cta')?.addEventListener('click', () => {
    donatePopup?.open();
  });

  // ─── Footer "Donate for volunteers" ─────────────────────────────────────
  document.addEventListener('donate-click', () => {
    donatePopup?.open();
  });
});
