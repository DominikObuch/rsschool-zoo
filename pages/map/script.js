import '../../src/styles/main.scss';
import './map.scss';
import '../../components/donate-popup/donate-popup.js';

document.addEventListener('DOMContentLoaded', () => {
  const donatePopup = document.getElementById('donate-popup');
  document.addEventListener('donate-click', () => {
    donatePopup?.open();
  });
});
