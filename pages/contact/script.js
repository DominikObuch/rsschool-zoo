import '../../src/styles/main.scss';
import './contact.scss';
import '../../components/donate-popup/donate-popup.js';

// ─── Donate popup (footer button) ──────────────────────────────────────────
document.addEventListener('donate-click', () => {
  document.getElementById('donate-popup')?.open();
});

// Form validation
const form = document.querySelector('.get-in-touch__form');

if (form) {
  const inputs = Array.from(form.querySelectorAll('zoo-input[required]'));

  // Clear error state as soon as the user types
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.removeAttribute('error');
    });
  });

  // Validate on SEND MESSAGE click
  const btn = form.querySelector('zoo-btn');
  if (btn) {
    btn.addEventListener('zoo-click', () => {
      let allValid = true;

      inputs.forEach((input) => {
        const value = (input.value || '').trim();
        if (!value) {
          input.setAttribute('error', 'This field is required');
          allValid = false;
        } else {
          input.removeAttribute('error');
        }
      });

      if (allValid) {
        // Reset form
        inputs.forEach((input) => {
          input.value = '';
        });
        alert('Your message has been sent — thank you!');
      }
    });
  }
}
