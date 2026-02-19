import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initTeamSlider() {
  const splideElement = document.querySelector('.team__splide');
  if (!splideElement) return;

  const splide = new Splide(splideElement, {
    type: 'slide',
    rewind: false,
    perMove: 1,
    gap: "24rem",
    arrows: false,
    pagination: false,
    trimSpace:false,
    autoWidth: true,
    dragMinThreshold: '70rem',
      breakpoints: {
      1440: {
          perPage: 1,
          padding: { right: '50%' },
      },
        990:{

        },
      768: {
          gap: "8rem",
          padding: { right: 'auto' },
      },
      520: {
      }
    }
  });

  const prevButton = document.querySelector('.team__controls-prev');
  const nextButton = document.querySelector('.team__controls-next');
  const currentSlideEl = document.querySelector('[data-team-current]');
  const totalSlidesEl = document.querySelector('[data-team-total]');

  function updateCounter(splide) {
        const current = splide.index + 1;
        const total = splide.length;

        if (currentSlideEl) {
            currentSlideEl.textContent = current;
        }
        if (totalSlidesEl) {
            totalSlidesEl.textContent = total;
        }
  }

  splide.on('mounted', () => {
        updateCounter(splide);
  });

  splide.on('move', () => {
        updateCounter(splide);
  });

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      splide.go('<');
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      splide.go('>');
    });
  }

  splide.mount();
  return splide;
}
