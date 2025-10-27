import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';
import { videoManager } from './videoManager.js';

function syncHeroHeight() {
    const heroBody = document.querySelector('.hero__body');
    const heroSplide = document.querySelector('.hero__splide');

    if (!heroBody || !heroSplide) return;

    const setHeight = () => {
        heroSplide.style.height = `${heroBody.offsetHeight}px`;
    };

    setHeight();
    window.addEventListener('resize', setHeight);
    new ResizeObserver(setHeight).observe(heroBody);
}

export function initHeroSlider() {
    const sliderElement = document.querySelector('.hero__splide');
    const videos = document.querySelectorAll('.hero__splide-slide video');

    if (!sliderElement || !sliderElement.querySelector('.splide__slide')) {
        return;
    }

    const splide = new Splide('.hero__splide', {
        type: 'slide',
        rewind: true,
        width: '100%',
        fixedWidth: '47%',
        perMove: 1,
        arrows: false,
        pagination: false,
        trimSpace: false,
        classes: {
            slide: 'hero__splide-slide splide__slide',
            active: 'is-active',
            visible: 'is-visible',
        },
        breakpoints: {
            768: {
                fixedWidth: '60%',
                gap: '10px',
            },
        }
    });

    let currentVideo = null;
    let playTimeout = null;

    function stopAllVideos() {
        document.querySelectorAll('.hero__splide-slide video').forEach(video => {
            video.pause();
            video.classList.remove('playing');
        });
    }

    async function playActiveVideo() {
        const activeSlide = splide.Components.Slides.getAt(splide.index)?.slide;
        if (!activeSlide) return;

        const activeVideo = activeSlide.querySelector('video');
        if (!activeVideo) return;

        if (currentVideo && currentVideo !== activeVideo) {
            currentVideo.pause();
            currentVideo.classList.remove('playing');
        }

        try {
            await videoManager.loadVideo(activeVideo);
            await activeVideo.play();
            activeVideo.classList.add('playing');
            currentVideo = activeVideo;
        } catch (err) {}
    }

    function playActiveVideoDebounced() {
        clearTimeout(playTimeout);
        stopAllVideos();
        playTimeout = setTimeout(playActiveVideo, 150);
    }

    function preloadNearbyVideos() {
        const currentIndex = splide.index;
        const totalSlides = splide.length;
        [currentIndex, (currentIndex + 1) % totalSlides, (currentIndex - 1 + totalSlides) % totalSlides]
            .forEach(index => {
                const video = videos[index];
                if (video && !videoManager.isLoading(video)) {
                    videoManager.loadVideo(video).catch(() => {});
                }
            });
    }

    videos.forEach((video, index) => {
        video.muted = true;
        video.playsInline = true;
        video.preload = index === 0 ? 'auto' : 'metadata';
    });

    function setupCustomArrows() {
        const btnPrev = document.getElementById('heroBtnPrev');
        const btnNext = document.getElementById('heroBtnNext');
        const counterEl = document.getElementById('heroCurrent');

        const updateUI = () => {
            const index = splide.index;
            const endIndex = splide.Components.Controller.getEnd();

            if (counterEl) {
                counterEl.innerHTML = `${String(index + 1).padStart(2, '0')}<span>/${String(endIndex + 1).padStart(2, '0')}</span>`;
            }

            btnPrev?.classList.toggle('is-disabled', index === 0);
            btnNext?.classList.toggle('is-disabled', index === endIndex);
        };

        btnPrev?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            splide.go('<');
        });

        btnNext?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            splide.go('>');
        });

        splide.on('move.end', updateUI);
        splide.on('updated', updateUI);
        updateUI();
    }

    splide.on('move', playActiveVideoDebounced);
    splide.on('move.end', preloadNearbyVideos);
    splide.on('mounted', async () => {
        setupCustomArrows();

        const firstSlide = splide.Components.Slides.getAt(0)?.slide;
        const firstVideo = firstSlide?.querySelector('video');

        if (firstVideo) {
            try {
                await videoManager.loadVideo(firstVideo);
                await firstVideo.play();
                firstVideo.classList.add('playing');
                currentVideo = firstVideo;
            } catch {}
        }

        preloadNearbyVideos();
    });

    splide.on('destroy', () => {
        stopAllVideos();
        currentVideo = null;
        clearTimeout(playTimeout);
    });

    splide.mount();
    syncHeroHeight();

    return splide;
}