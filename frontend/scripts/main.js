import '../styles/main.scss';

import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import { initCasesSlider, updateSliderWithFilter } from './casesSwiper.js';
import { initBrandsCarousel } from './brandsCarousel.js';
import { initDropdown } from './dropdown.js'
import { initReviewsSlider } from './reviewsSlider.js';
import { initServiceCarouselR } from './serviceCarouselRight.js';
import { initServiceCarouselL } from './serviceCarouselLeft.js';
import { initScrollWordAnimation } from'./splittingHeaders';
import { initHeader } from'./header.js';
import { initExpandableText } from "./serviceCardText";
import { initHeroSlider } from "./heroSplide";
import { initMobileHeroSlider } from "./mobileHeroSlider";
import { initTeamSlider } from "./teamSlider";
import { initServiceSliders } from "./serviceSlider";
import { initModal } from "./modal.js";
import { initFormFeedback } from "./form.js";
import { initModalSuccess } from "./modalSuccess.js";
import { loader } from "./loader"

document.addEventListener('DOMContentLoaded', async () => {
    initHeroSlider();
    initTypewriterHero();
    initTypewriterCta();
    initCasesSlider();
    initBrandsCarousel();
    initReviewsSlider();
    initServiceCarouselR();
    initServiceCarouselL();
    initScrollWordAnimation();
    initHeader();
    initExpandableText();
    initMobileHeroSlider();
    initTeamSlider();
    initServiceSliders();
    initModal();
    initFormFeedback();
    initModalSuccess();

    
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

    await loader();
    document.getElementById('loader-overlay').style.display = 'none';
    const content = document.getElementById('main');
    content.classList.remove('blurred');
    content.classList.add('loaded');
});

