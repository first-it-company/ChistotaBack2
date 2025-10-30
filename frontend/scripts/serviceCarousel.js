import { Splide } from '@splidejs/splide';
import { AutoScroll } from 'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll/dist/js/splide-extension-auto-scroll.esm.js';

export function initServiceCarouselLeft() {
    const splide = new Splide('[data-service-splide-left]', {
        type: 'loop',
        drag: 'free',
        focus: 'center',
        pagination: false,
        arrows: false,
        autoWidth: true,
        autoScroll: {
            speed: 0.8,
            pauseOnHover: false,
            pauseOnFocus: false,
        },
    });

    splide.mount({ AutoScroll });
    return splide;
}

export function initServiceCarouselRight() {
    const splide = new Splide('[data-service-splide-right]', {
        type: 'loop',
        drag: 'free',
        focus: 'center',
        pagination: false,
        arrows: false,
        autoWidth: true,
        autoScroll: {
            speed: -0.8,
            pauseOnHover: false,
            pauseOnFocus: false,
        },
    });

    splide.mount({ AutoScroll });
    return splide;
}



// export function initAboutCarousel() {
//     const splide = new Splide('[data-about-splide]', {
//         type: 'loop',
//         drag: 'free',
//         focus: 'center',
//         pagination: false,
//         arrows: false,
//         autoWidth: true,
//         autoScroll: {
//             speed: 0.8,
//             pauseOnHover: false,
//             pauseOnFocus: false,
//         },
//     });
//
//     splide.mount({ AutoScroll });
//     return splide;
// }