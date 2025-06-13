import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initTeamSlider() {
    const splide = new Splide('.team__splide', {
        type: 'slide',
        rewind: true,
        perPage: 4,
        perMove: 1,
        gap: 24,
        arrows: false,
        pagination: false,
        breakpoints: {
            768:{
                perPage: 3,
            },
            520:{
                perPage: 2,
            }
        }
    });

    splide.mount();
    return splide;
}
