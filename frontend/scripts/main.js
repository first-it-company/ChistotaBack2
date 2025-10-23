import '../styles/main.scss';

import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import { initCasesSlider, updateSliderWithFilter } from './casesSwiper.js';
import { initBrandsCarousel } from './brandsCarousel.js';
import { initDropdown } from './dropdown.js'
import { initReviewsSlider } from './reviewsSlider.js';
import { initScrollWordAnimation } from'./splittingHeaders';
import { initHeader } from'./header.js';
import { initExpandableText } from "./serviceCardText";
import { initHeroSlider } from "./heroSplide";
import { initTeamSlider } from "./teamSlider";
import { initServiceSliders } from "./serviceSlider";
import { initServiceSlider } from "./serviceSplide";
import { initModal } from "./modal.js";
import { initFormFeedback } from "./form.js";
import { initModalSuccess } from "./modalSuccess.js";
// import { loader } from "./loader"
import { initVideoModal } from './videoModal.js';
import { initCustomSelect } from './customSelect.js';
import { initFooterReviewSlider } from './footerReviewSlider.js';

import './videoManager.js'; // Инициализируем менеджер видео

function earlyVideoPreload() {
    const videos = document.querySelectorAll('.hero__splide-slide video');
    if (videos.length === 0) return;

    [0, 1].forEach(index => {
        const video = videos[index];
        if (video) {
            video.preload = 'auto';
            video.load();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        earlyVideoPreload();
        initHeroSlider();
    });
} else {
    earlyVideoPreload();
    initHeroSlider();
}

document.addEventListener('DOMContentLoaded', async () => {
    initTypewriterHero();
    initTypewriterCta();
    initCasesSlider();
    initBrandsCarousel();
    initReviewsSlider();
    initScrollWordAnimation();
    initHeader();
    initExpandableText();
    initTeamSlider();
    initServiceSliders();
    initServiceSlider();
    initModal();
    initFormFeedback();
    initModalSuccess();
    initVideoModal();
    initCustomSelect();
    initFooterReviewSlider();

    if (document.querySelector('[data-service-splide-left]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselLeft }) => initServiceCarouselLeft());
    }

    if (document.querySelector('[data-service-splide-right]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselRight }) => initServiceCarouselRight());
    }

    document.querySelectorAll('[data-dropdown-config]').forEach(element => {
        try {
            const config = JSON.parse(element.dataset.dropdownConfig);
            initDropdown({
                containerSelector: `.${element.classList[1]}`,
                options: config.options || [],
                onSelect: function(value) {
                    updateSliderWithFilter(value);
                }
            });
        } catch (e) {
            console.error('Error parsing dropdown config:', e);
        }
    });

    // await loader();
    // document.getElementById('loader-overlay').style.display = 'none';
    // const content = document.getElementById('main');
    // content.classList.remove('blurred');
    // content.classList.add('loaded');
});

// FAQ Animation
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
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
    });
  });
});

