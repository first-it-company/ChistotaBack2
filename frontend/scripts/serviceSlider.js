import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initServiceSliders() {
    const splides = document.querySelectorAll('.service__splide');

    splides.forEach((el) => {
        const splide = new Splide(el, {
            type: 'slide',
            perPage: 1,
            gap: 5,
            arrows: false,
            pagination: false,
            cover : true,
            height: 390,
            lazyLoad: 'nearby',
            autoWidth: false,
            autoHeight: true,
            breakpoints: {
                1023:{
                    height: 340,
                },
                800:{
                    height: 220,
                }
            }
        });

        const bar = el.closest('.service__splide-wrap')?.querySelector('.service__progress-bar');

        splide.on('mounted move', function () {
            const end  = splide.Components.Controller.getEnd() + 1;
            const rate = Math.min((splide.index + 1) / end, 1);
            if (bar) {
                bar.style.width = `${100 * rate}%`;
            }
        });

        splide.mount();
    });
}

