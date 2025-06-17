import '../styles/main.scss';

import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import { initCasesSlider } from './casesSwiper.js';
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

document.addEventListener('DOMContentLoaded', () => {
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
    initHeroSlider();
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
                    const orderItems = document.querySelectorAll('.cases__splide-slide');
                    orderItems.forEach(item => {
                        const itemScope = item.dataset.scope;
                        if (value === '' || itemScope === value) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Error parsing dropdown config:', e);
        }
    });

});

