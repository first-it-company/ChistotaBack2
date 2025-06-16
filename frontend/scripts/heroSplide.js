import { Splide } from '@splidejs/splide';

export function initHeroSlider() {
    const splide = new Splide('.hero__splide', {
        type: 'slide',
        rewind: false,
        fixedWidth: 473,
        fixedHeight: 689,
        perMove: 1,
        arrows: false,
        pagination: false,
        trimSpace: false,
        gap: '-240px',
        classes: {
            slide: 'hero__splide-slide splide__slide',
            active: 'is-active',
            visible: 'is-visible',
        },


        breakpoints: {
            1300: {
                fixedWidth: 447,
                fixedHeight: 650,
                gap: '-230px',
            },
        }
    });

    function updateSlidePositions() {
        const slides = document.querySelectorAll('.hero__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            slide.classList.remove('slide-offset', 'slide-previous');

            if (index < activeIndex) {
                slide.classList.add('slide-previous');
            } else if (index > activeIndex) {
                slide.classList.add('slide-offset');
            }
        });
    }

    function playActiveVideo() {
        const allVideos = document.querySelectorAll('.hero__splide-slide video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        const activeSlide = splide.Components.Slides.getAt(splide.index).slide;
        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
            activeVideo.play();
        }
    }

    function updateSlideTransforms() {
        const slides = document.querySelectorAll('.hero__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            const offset = index - activeIndex;

            const scale = Math.max(0.6, 1 - Math.abs(offset) * 0.2);
            const translate = offset * 300;

            const inner = slide.querySelector('.hero__splide-slide-inner');
            if (inner) {
                inner.style.transform = `translateX(${translate}px) scale(${scale})`;
                inner.style.zIndex = 100 - Math.abs(offset);
            }
        });
    }


    splide.on('mounted move', () => {

        updateSlidePositions();
        playActiveVideo();
        updateSlideTransforms();
    });

    splide.mount();
    return splide;
}