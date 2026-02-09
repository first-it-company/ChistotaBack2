import '../styles/main.scss';
import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import { initCasesSlider, updateSliderWithFilter } from './casesSwiper.js';
import { initBrandsCarousel } from './brandsCarousel.js';
import { initDropdown } from './dropdown.js'
import { initScrollWordAnimation } from'./splittingHeaders';
import { initHeader } from'./header.js';
import { initExpandableText } from "./serviceCardText";
import { initTeamSlider } from "./teamSlider";
import { initServiceSliders } from "./serviceSlider";
import { initServiceSlider } from "./serviceSplide";
import { initModal } from "./modal.js";
import { initFormFeedback } from "./form.js";
import { initModalSuccess } from "./modalSuccess.js";
import { initCustomSelect } from './customSelect.js';
import { initFooterReviewSlider } from './footerReviewSlider.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTypewriterHero();
    initTypewriterCta();
    initCasesSlider();
    initBrandsCarousel();
    initScrollWordAnimation();
    initHeader();
    initExpandableText();
    initTeamSlider();
    initServiceSliders();
    initServiceSlider();
    initModal();
    initFormFeedback();
    initModalSuccess();
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

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-cases-button]');
    const rows = document.querySelectorAll('.cases__row');

    const getVisibleCount = () => {
        const width = window.innerWidth;
        if (width <= 590) return 1;
        if (width <= 990) return 2;
        return 3;
    };

    const hide = () => {
        const visibleCount = getVisibleCount();
        rows.forEach((row, i) => {
            row.style.display = i < visibleCount ? '' : 'none';
        });
    };

    const show = () => {
        rows.forEach((row) => {
            row.style.display = '';
        });
    };

    const updateButton = () => {
        const visibleCount = getVisibleCount();
        if (rows.length > visibleCount) {
            button.style.display = '';
        } else {
            button.style.display = 'none';
        }
    };

    let isExpanded = false;

    const init = () => {
        updateButton();
        if (!isExpanded && rows.length > getVisibleCount()) {
            hide();
        }
    };

    init();

    button.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            show();
            button.textContent = 'Скрыть все';
        } else {
            hide();
            button.textContent = 'Показать ещё';
        }
    });

    window.addEventListener('resize', () => {
        if (!isExpanded) {
            hide();
        }
        updateButton();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const main       = document.querySelector('.reviews__main');
    const columns    = main.querySelectorAll('.reviews__column');
    const [upBtn, downBtn] = main.querySelectorAll('.reviews__control-button');

    if (!main || !columns.length || !upBtn || !downBtn) return;

    const VISIBLE_H  = 700;
    let offset       = 0;
    let maxOffset    = 0;

    function calcMax() {
        const tallest = Math.max(...[...columns].map(c => c.scrollHeight));
        maxOffset = Math.max(0, tallest - VISIBLE_H);
    }

    function getStep() {
        const card = columns[0]?.querySelector('.reviews__card');
        if (!card) return 200;
        return card.offsetHeight + parseInt(getComputedStyle(card).marginBottom || 0);
    }

    function applyOffset() {
        columns.forEach(col => {
            col.style.transform = `translateY(-${offset}rem)`;
        });
        updateButtons();
    }

    function updateButtons() {
        upBtn.classList.toggle('is-disabled',   offset <= 0);
        downBtn.classList.toggle('is-disabled', offset >= maxOffset);
    }

    upBtn.addEventListener('click', () => {
        offset = Math.max(0, offset - getStep());
        applyOffset();
    });

    downBtn.addEventListener('click', () => {
        offset = Math.min(maxOffset, offset + getStep());
        applyOffset();
    });

    Promise.all(
        [...main.querySelectorAll('img')].map(img =>
            img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
        )
    ).then(() => { calcMax(); applyOffset(); });

    window.addEventListener('resize', () => {
        calcMax();
        offset = Math.min(offset, maxOffset);
        applyOffset();
    });
});