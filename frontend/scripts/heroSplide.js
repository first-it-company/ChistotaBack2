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

  // Устанавливаем высоту при загрузке
  setHeight();

  // Обновляем высоту при изменении размера окна
  window.addEventListener('resize', setHeight);

  // Обновляем высоту при изменении содержимого (например, когда загружаются шрифты)
  const observer = new ResizeObserver(() => {
    setHeight();
  });
  
  observer.observe(heroBody);
}

export function initHeroSlider() {
    const sliderElement = document.querySelector('.hero__splide');

    // Проверяем, существует ли слайдер и есть ли в нем слайды
    if (!sliderElement || !sliderElement.querySelector('.splide__slide')) {
        // console.warn('[Splide] Slider element or slides not found. Initialization aborted.');
        return;
    }
    // Check if slider already exists and destroy it
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
        // gap: '20px',
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



    // Improved video handling
    let currentVideo = null;

    function stopAllVideos() {
        const allVideos = document.querySelectorAll('.hero__splide-slide video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    async function playActiveVideo() {
        stopAllVideos();

        const activeSlide = splide.Components.Slides.getAt(splide.index)?.slide;
        if (!activeSlide) return;

        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
            if (currentVideo && currentVideo !== activeVideo) {
                currentVideo.pause();
                currentVideo.currentTime = 0;
            }
            
            // Загружаем видео через менеджер (предотвращает дублирование)
            await videoManager.loadVideo(activeVideo);
            
            activeVideo.play().catch(err => console.warn('Video autoplay failed:', err));
            currentVideo = activeVideo;
        }
    }



    // Initialize videos without loading them
    const videos = document.querySelectorAll('.hero__splide-slide video');
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
    });

    // Add custom arrow handlers and counter
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

        // Update UI on slide change
        splide.on('move.end', updateUI);
        splide.on('updated', updateUI);

        // Set initial state
        updateUI();
    }

    splide.on('mounted move', () => {
        playActiveVideo();
    });

    splide.on('mounted', () => {
        addCustomArrowHandlers();
        // Принудительно запускаем первое видео при инициализации
        setTimeout(() => {
            playActiveVideo();
        }, 100);
    });

    // Cleanup on destroy
    splide.on('destroy', () => {
        stopAllVideos();
        currentVideo = null;
    });

    splide.mount();
    
    // Синхронизируем высоту после монтирования слайдера
    syncHeroHeight();
    
    return splide;
}