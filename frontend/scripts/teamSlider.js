import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initTeamSlider() {
  const splideElement = document.querySelector('.team__splide');
  if (!splideElement) return;

  const splide = new Splide(splideElement, {
    type: 'slide',
    rewind: false,
    perPage: 1,
    perMove: 1,
    gap: "24rem",
    padding: 0,
    arrows: false,
    pagination: false,
    trimSpace: false,
    fixedWidth: '430rem',

    breakpoints: {
      1440: {
          fixedWidth: '300rem',
          perPage: 1,
          padding: { right: '50%' },
      },
      768: {
          gap: "8rem",
          fixedWidth: '260rem',
          padding: { right: 'auto' },
      },
      520: {
      }
    }
  });

  const nameElement = document.querySelector('.team__info-name');
  const positionElement = document.querySelector('.team__info-post');
  const descriptionElement = document.querySelector('.team__info-description');
  const experienceElement = document.querySelector('.team__info-experience');
  const experienceValueElement = document.querySelector('.team__info-experience-value');
  const counterElement = document.querySelector('.team__controls-counter');

  const formatNumber = (num) => num.toString().padStart(2, '0');

  function updateInfo(slide) {
    if (!slide) return;
    if (nameElement) {
      nameElement.textContent = slide.dataset.name;
    }
    if (positionElement) {
      positionElement.textContent = slide.dataset.position;
    }
    if (descriptionElement) {
      descriptionElement.textContent = slide.dataset.description;
    }
    if (experienceElement && experienceValueElement) {
      const experience = slide.dataset.experience;
      if (experience) {
        experienceValueElement.textContent = experience;
        experienceElement.style.display = 'flex';
      } else {
        experienceElement.style.display = 'none';
      }
    }
  }

  function updateCounter() {
    if (counterElement) {
      counterElement.innerHTML = `${formatNumber(splide.index + 1)}<span>/${formatNumber(splide.length)}</span>`;
    }
  }
  const prevButton = document.querySelector('.team__controls-prev');
  const nextButton = document.querySelector('.team__controls-next');


  splide.on('mounted', () => {
    const slides = splide.Components.Slides.get();
    if (slides && slides.length > 0) {
      const currentSlide = slides[splide.index].slide;
      updateInfo(currentSlide);
      updateCounter();
    }

    if (prevButton) {
      prevButton.classList.add('is-disabled');
    }

    if (nextButton) {
      nextButton.classList.toggle('is-disabled', splide.isEnd());
    }
  });

  splide.on('active', (activeSlide) => {
    updateInfo(activeSlide.slide);
    updateCounter();
  });

  splide.on('moved', () => {
    if (prevButton) {
      prevButton.classList.toggle('is-disabled', splide.index === 0);
    }
    if (nextButton) {
      nextButton.classList.toggle('is-disabled', splide.isEnd());
    }
  });

  splide.mount();


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

  return splide;
}
