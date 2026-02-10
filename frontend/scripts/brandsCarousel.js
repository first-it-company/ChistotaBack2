import { Splide } from '@splidejs/splide';
import { AutoScroll } from 'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll/dist/js/splide-extension-auto-scroll.esm.js';
import '@splidejs/splide/css';

export default function initBrandsCarousel() {
    const carouselElement = document.querySelector('[data-brands-carousel]');

    if (!carouselElement) {
        return null;
    }

    const splide = new Splide('[data-brands-carousel]', {
        type: 'loop',
        drag: 'free',
        focus: 'center',
        pagination: false,
        arrows: false,
        gap: 40,
        autoWidth: true,
        autoScroll: {
            speed: 0.8,
            pauseOnHover: false,
            pauseOnFocus: false,
        },
        breakpoints: {

        }
    });

    splide.mount({ AutoScroll });
    return splide;
}