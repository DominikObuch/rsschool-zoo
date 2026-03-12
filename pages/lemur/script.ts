import '../../src/styles/main.scss';
import '../../components/animal-page/animal-page.ts';
import type { DonatePopup } from '../../components/donate-popup/donate-popup.ts';

document.addEventListener('DOMContentLoaded', () => {
  const donatePopup = document.getElementById('donate-popup') as DonatePopup | null;
  document.addEventListener('donate-click', () => {
    donatePopup?.open();
  });
});
