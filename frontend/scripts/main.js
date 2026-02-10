import '../styles/main.scss';
import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import { initBrandsCarousel } from './brandsCarousel.js';
import { initScrollWordAnimation } from'./splittingHeaders';
import { initHeader } from'./header.js';
import { initExpandableText } from "./serviceCardText";
import { initTeamSlider } from "./teamSlider";
import { initModal } from "./modal.js";
import { initFormFeedback } from "./form.js";
import { initModalSuccess } from "./modalSuccess.js";
import { initFooterReviewSlider } from './footerReviewSlider.js';
import { initReviewsScroll } from './reviewsScroll.js';
import { initCasesToggle  } from './casesToggle.js';
import { initCaseFancybox } from './caseLightBox.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTypewriterHero();
    initTypewriterCta();
    initBrandsCarousel();
    initScrollWordAnimation();
    initHeader();
    initExpandableText();
    initTeamSlider();
    initModal();
    initFormFeedback();
    initModalSuccess();
    initFooterReviewSlider();
    initReviewsScroll();
    initCasesToggle();
    initCaseFancybox();

    if (document.querySelector('[data-service-splide-left]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselLeft }) => initServiceCarouselLeft());
    }

    if (document.querySelector('[data-service-splide-right]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselRight }) => initServiceCarouselRight());
    }
});


document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq__item');
  
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.faq__content');
    
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (item.hasAttribute('open')) {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        setTimeout(() => {
          item.removeAttribute('open');
        }, 300);
      } else {
        item.setAttribute('open', '');
        content.style.maxHeight = content.scrollHeight + 'rem';
        content.style.opacity = '1';
      }
    });
  });
});