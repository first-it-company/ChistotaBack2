import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initCasesSlider() {
    const splide = new Splide('.cases__splide', {
        type: 'slide',
        rewind: true,

        perPage: 2,
        perMove: 1,
        gap: 28,
        autoplay: true,
        interval: 2000,
        pauseOnHover: true,

        speed: 800,
        arrows: false,
        pagination: false,

        breakpoints: {
            1023: {
                perMove: 1,
                gap: 16,
            },
            768: {
                perPage: 1,
                fixedWidth: 320,
                fixedHeight: 273,
                trimSpace: false,
            }
        }
    });



    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const counterEl = document.getElementById('casesCurrent');

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

    btnPrev.addEventListener('click', e => {
        splide.go('-1')
    })

    btnNext.addEventListener('click', e => {
        splide.go('+1')
    })

    splide.on('mounted move updated', updateUI);

    splide.mount();
    return splide;
}
