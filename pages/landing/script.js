import '../../src/styles/main.scss';
import './landing.scss';
import '../../components/donate-popup/donate-popup.js';
import '../../components/feed-popup/feed-popup.js';

// ─── Donation quick-donate ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('.donation__submit');
  const amountInput = document.querySelector('.donation__amount');

  submitBtn?.addEventListener('click', () => {
    const amount = amountInput?.value.trim();
    if (!amount) {
      amountInput?.focus();
      return;
    }
    const feedPopup = document.getElementById('feed-popup');
    if (feedPopup) {
      feedPopup.setAmount(amount);
      feedPopup.open(1);
    }
  });

  // ─── Care section — "feed" buttons open feed-popup ──────────────────────
  const feedPopupEl = document.getElementById('feed-popup');
  document.querySelectorAll('.care__card-feed').forEach(feedBtn => {
    feedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      feedPopupEl?.open(1);
    });
  });

  // ─── Care section mobile slider ──────────────────────────────────────────
  const careCards = Array.from(document.querySelectorAll('.care__card'));
  const careDots  = Array.from(document.querySelectorAll('.care__dot'));
  let careIndex   = 0;

  function isMobileCare() {
    return window.innerWidth <= 639;
  }

  function updateCareSlider() {
    if (!isMobileCare()) {
      // desktop / tablet — remove mobile classes, show all cards
      careCards.forEach(c => {
        c.classList.remove('care__card--active');
        c.style.display = '';
      });
      careDots.forEach(d => d.classList.remove('care__dot--active'));
      return;
    }

    careCards.forEach((card, i) => {
      card.classList.toggle('care__card--active', i === careIndex);
    });
    careDots.forEach((dot, i) => {
      dot.classList.toggle('care__dot--active', i === careIndex);
    });
  }

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
  const donatePopup = document.getElementById('donate-popup');
  document.querySelector('.pay-feed__cta')?.addEventListener('click', () => {
    donatePopup?.open();
  });

  // ─── Footer "Donate for volunteers" ─────────────────────────────────────
  document.addEventListener('donate-click', () => {
    donatePopup?.open();
  });
});
