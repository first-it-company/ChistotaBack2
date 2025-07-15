import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initFooterReviewSlider() {
  const footerReviewSlider = document.getElementById('footer-review-slider');
  
  if (footerReviewSlider) {
    new Splide(footerReviewSlider, {
      type: 'slide',
      perPage: 'auto',
      gap: 10,
      arrows: false,
      pagination: false,
      drag: true,
      snap: true,
      autoplay: false,
      interval: 3000,
      speed: 800,
      pauseOnHover: true,
      breakpoints: {
        590: {
          perPage: 1,
          gap: 10,
        }
      }
    }).mount();
  }
} 