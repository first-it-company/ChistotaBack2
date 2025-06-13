import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initMobileHeroSlider() {
    const splide = new Splide('.hero__main-mobile', {
        type: 'slide',
        rewind: false,
        perMove: 1,
        pagination: true,
        arrows: false,
    });

    splide.mount();
    return splide;
}