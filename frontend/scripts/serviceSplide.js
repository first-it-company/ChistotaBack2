import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initServiceSlider() {
    const sliderElement = document.getElementById('service-detail-splide');

    if (!sliderElement || !sliderElement.querySelector('.splide__slide')) {
        return;
    }

    const splide = new Splide(sliderElement, {
        type: 'slide',
        rewind: true,
        arrows: false,
        pagination: false,
        perPage: 1,
    });

    function addCustomArrowHandlers() {
        const btnPrev = document.getElementById('service-detail-prev');
        const btnNext = document.getElementById('service-detail-next');
        const counterEl = document.getElementById('service-detail-counter');

        const updateUI = () => {
            const index = splide.index;
            const endIndex = splide.Components.Controller.getEnd();
            const current = index + 1;
            const total = endIndex + 1;
            
            const formattedCurrent = String(current).padStart(2, '0');
            const formattedTotal = String(total).padStart(2, '0');
            
            if (counterEl) {
                counterEl.textContent = `${formattedCurrent}/${formattedTotal}`;
            }
            
            if (btnPrev) {
                btnPrev.classList.toggle('is-disabled', index === 0);
            }
            
            if (btnNext) {
                btnNext.classList.toggle('is-disabled', index === endIndex);
            }
        };

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                splide.go('<');
            });
        }
        
        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                splide.go('>');
            });
        }

        splide.on('moved updated', updateUI);
        
        updateUI();
    }

    splide.on('mounted', addCustomArrowHandlers);

    splide.mount();

    return splide;
}