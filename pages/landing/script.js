import '../../src/styles/main.scss';
import './landing.scss';

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
    // TODO: open <feed-popup> with pre-filled amount once the component is built
    console.log('Donate:', amount);
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
});
