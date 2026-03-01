import styles from './live-badge.scss?inline';

const template = document.createElement('template');

function buildTemplate() {
  const button = document.createElement('button');
  button.className = 'live-badge';

  // Camera icon — inline SVG built with createElementNS (no camera file in /public/icons)
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'live-badge__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');

  // Camera body rect
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('x', '1');
  rect.setAttribute('y', '6');
  rect.setAttribute('width', '15');
  rect.setAttribute('height', '12');
  rect.setAttribute('rx', '2');

  // Camera lens circle
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '8.5');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '3');
  circle.setAttribute('fill', '#F58021');

  // Video triangle
  const poly = document.createElementNS(svgNS, 'polygon');
  poly.setAttribute('points', '16,9 23,6 23,18 16,15');

  svg.appendChild(rect);
  svg.appendChild(circle);
  svg.appendChild(poly);

  const text = document.createElement('span');
  text.className = 'live-badge__text';
  text.textContent = 'live';

  button.appendChild(text);
  button.appendChild(svg);

  template.content.appendChild(button);
}

buildTemplate();

export class ZooLiveBadge extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    shadow.appendChild(template.content.cloneNode(true));

    shadow.querySelector('.live-badge').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('live-badge-click', {
        bubbles:  true,
        composed: true,
      }));
    });
  }
}

customElements.define('zoo-live-badge', ZooLiveBadge);
export default ZooLiveBadge;
