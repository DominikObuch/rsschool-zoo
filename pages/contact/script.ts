import '../../src/styles/main.scss';
import './contact.scss';
import '../../components/donate-popup/donate-popup.ts';
import type { DonatePopup } from '../../components/donate-popup/donate-popup.ts';
import type { ZooInput } from '../../components/zoo-input/zoo-input.ts';

document.addEventListener('donate-click', () => {
  (document.getElementById('donate-popup') as DonatePopup | null)?.open();
});

const form = document.querySelector<HTMLFormElement>('.get-in-touch__form');

if (form) {
  const inputs = Array.from(form.querySelectorAll<ZooInput>('zoo-input[required]'));

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.removeAttribute('error');
    });
  });

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
        inputs.forEach((input) => {
          input.value = '';
        });
        alert('Your message has been sent — thank you!');
      }
    });
  }
}
