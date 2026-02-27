import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

const BREAKPOINT = 991;

export function initReviewsSliderMobile() {
    if (window.innerWidth >= BREAKPOINT) return;
    const reviewsBody = document.querySelector('.reviews__body');
    const reviewsMain = reviewsBody?.querySelector('.reviews__main');
    if (!reviewsBody || !reviewsMain) return;

    if (reviewsBody.querySelector('[data-reviews-splide]')) return;
    const cards = reviewsMain.querySelectorAll('.reviews__card');
    if (!cards.length) return;

    const splideRoot = document.createElement('div');
    splideRoot.className = 'splide reviews__splide';
    splideRoot.setAttribute('data-reviews-splide', '');

    const track = document.createElement('div');
    track.className = 'splide__track';

    const list = document.createElement('div');
    list.className = 'splide__list';

    cards.forEach((card) => {
        const slide = document.createElement('div');
        slide.className = 'splide__slide';
        slide.appendChild(card);
        list.appendChild(slide);
    });

    track.appendChild(list);
    splideRoot.appendChild(track);

    const imageBlock = reviewsBody.querySelector('.reviews__image');
    if (imageBlock) {
        reviewsBody.insertBefore(splideRoot, imageBlock);
    } else {
        reviewsBody.appendChild(splideRoot);
    }

    reviewsMain.style.display = 'none';

    const splide = new Splide(splideRoot, {
        type: 'slide',
        rewind: true,
        perMove: 1,
        gap: '24rem',
        pagination: false,
        arrows: false,
        autoWidth: true,
        trimSpace: false,
        breakpoints: {
            768: {
                gap: '8rem',
            },
        },
    });

    splide.mount();
}