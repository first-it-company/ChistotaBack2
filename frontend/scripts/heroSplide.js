import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';
import { videoManager } from './videoManager.js';

function syncHeroHeight() {
    const heroBody = document.querySelector('.hero__body');
    const heroSplide = document.querySelector('.hero__splide');

    if (!heroBody || !heroSplide) return;

    const setHeight = () => {
        const bodyHeight = heroBody.offsetHeight;
        heroSplide.style.height = `${bodyHeight}px`;
    };

    setHeight();
    window.addEventListener('resize', setHeight);

    const observer = new ResizeObserver(() => {
        setHeight();
    });

    observer.observe(heroBody);
}

export function initHeroSlider() {
    const sliderElement = document.querySelector('.hero__splide');

    if (!sliderElement || !sliderElement.querySelector('.splide__slide')) {
        return;
    }

    const existingSlider = document.querySelector('.hero__splide');
    if (existingSlider && existingSlider.splide) {
        existingSlider.splide.destroy(true);
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
    let debounceTimer = null;
    let abortController = null;

    function stopAllVideos() {
        const allVideos = document.querySelectorAll('.hero__splide-slide video');
        allVideos.forEach(video => {
            video.pause();
            video.classList.remove('playing');
        });
    }

    async function playActiveVideo() {
        const currentSlideIndex = splide.index;

        const activeSlide = splide.Components.Slides.getAt(currentSlideIndex)?.slide;
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
        } catch (err) {
            console.warn('Video playback failed:', err);
        }
    }

    function playActiveVideoDebounced() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        stopAllVideos();

        debounceTimer = setTimeout(() => {
            playActiveVideo();
        }, 150);
    }

    function preloadNearbyVideos() {
        const currentIndex = splide.index;
        const totalSlides = splide.length;

        const indicesToLoad = [
            currentIndex,
            (currentIndex + 1) % totalSlides,
            (currentIndex - 1 + totalSlides) % totalSlides
        ];

        const videos = document.querySelectorAll('.hero__splide-slide video');
        indicesToLoad.forEach(index => {
            const video = videos[index];
            if (video && !videoManager.isLoading(video)) {
                videoManager.loadVideo(video).catch(err => {
                    console.warn('Preload failed for video', index, err);
                });
            }
        });
    }

    const videos = document.querySelectorAll('.hero__splide-slide video');
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
    });

    function addCustomArrowHandlers() {
        const btnPrev = document.getElementById('heroBtnPrev');
        const btnNext = document.getElementById('heroBtnNext');
        const counterEl = document.getElementById('heroCurrent');

        const updateUI = () => {
            const index = splide.index;
            const endIndex = splide.Components.Controller.getEnd();
            const current = index + 1;
            const total = endIndex + 1;

            const formattedCurrent = String(current).padStart(2, '0');
            const formattedTotal = String(total).padStart(2, '0');

            if (counterEl) {
                counterEl.innerHTML = `${formattedCurrent}<span>/${formattedTotal}</span>`;
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

        splide.on('move.end', updateUI);
        splide.on('updated', updateUI);
        updateUI();
    }

    splide.on('move', () => {
        playActiveVideoDebounced();
    });

    splide.on('move.end', () => {
        preloadNearbyVideos();
    });

    splide.on('mounted', () => {
        addCustomArrowHandlers();
        preloadNearbyVideos();
        setTimeout(() => {
            playActiveVideo();
        }, 100);
    });

    splide.on('destroy', () => {
        stopAllVideos();
        currentVideo = null;
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        if (abortController) {
            abortController.abort();
        }
    });

    splide.mount();
    syncHeroHeight();

    return splide;
}