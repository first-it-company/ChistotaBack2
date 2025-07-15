import MomentumSlider from "momentum-slider";

// Функция для инициализации одного слайдера
function initSingleReviewsSlider(containerSelector, prevBtnSelector, nextBtnSelector, currentIndicatorSelector) {
    console.log(`Инициализация слайдера для ${containerSelector}`);
    
    const slidersContainer = document.querySelector(containerSelector);
    if (!slidersContainer) {
        console.warn(`Контейнер ${containerSelector} не найден`);
        return;
    }

    const sliderWrapper = slidersContainer.querySelector('.reviews__slider-wrapper');
    if (!sliderWrapper) {
        console.warn(`Обертка слайдера не найдена в ${containerSelector}`);
        return;
    }

    const slides = sliderWrapper.querySelectorAll('.reviews__swiper-slide');
    console.log(`Найдено ${slides.length} слайдов в ${containerSelector}`);

    if (slides.length === 0) {
        console.warn(`Нет слайдов в ${containerSelector}`);
        return;
    }

    const prevButton = document.querySelector(prevBtnSelector);
    const nextButton = document.querySelector(nextBtnSelector);
    const currentSlideIndicator = document.querySelector(currentIndicatorSelector);

    if (!prevButton || !nextButton || !currentSlideIndicator) {
        console.warn(`Не найдены элементы управления для ${containerSelector}:`, {
            prevButton: !!prevButton,
            nextButton: !!nextButton,
            indicator: !!currentSlideIndicator
        });
    }

    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    const getSliderConfig = (isMobile) => ({
        el: slidersContainer,
        cssClass: 'ms-slides',
        range: [0, slides.length - 1],
        rangeContent: (index) => slides[index].outerHTML,
        multiplier: 0.45,
        friction: 0.92,
        bounce: 0.2,
        change: (newIndex) => {
            const formatNumber = (num) => num.toString().padStart(2, '0');
            if (currentSlideIndicator) {
                currentSlideIndicator.innerHTML = `${formatNumber(newIndex + 1)}/<span>${formatNumber(slides.length)}</span>`;
            }
            
            if (prevButton) {
                prevButton.disabled = newIndex === 0;
                prevButton.classList.toggle('is-disabled', newIndex === 0);
            }
            
            if (nextButton) {
                nextButton.disabled = newIndex === slides.length - 1;
                nextButton.classList.toggle('is-disabled', newIndex === slides.length - 1);
            }
        },
        style: {
            '.reviews__swiper-slide': {
                transform: [{ scale: isMobile ? [0.95, 1] : [0.9, 1] }],
                opacity: [0.5, 1]
            },
        },
    });

    let msImages;
    try {
        // Очищаем контейнер от предыдущих слайдов
        while (slidersContainer.firstChild) {
            slidersContainer.removeChild(slidersContainer.firstChild);
        }
        
        msImages = new MomentumSlider(getSliderConfig(mobileMediaQuery.matches));
        console.log(`Слайдер ${containerSelector} успешно инициализирован`);
    } catch (error) {
        console.error(`Ошибка при инициализации слайдера ${containerSelector}:`, error);
        return;
    }

    const handleMediaChange = (e) => {
        try {
            msImages.destroy();
            msImages = new MomentumSlider(getSliderConfig(e.matches));
        } catch (error) {
            console.error(`Ошибка при пересоздании слайдера ${containerSelector}:`, error);
        }
    };

    mobileMediaQuery.addEventListener('change', handleMediaChange);

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const currentIndex = msImages.getCurrentIndex();
            if (currentIndex > 0) {
                msImages.select(currentIndex - 1);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const currentIndex = msImages.getCurrentIndex();
            if (currentIndex < slides.length - 1) {
                msImages.select(currentIndex + 1);
            }
        });
    }

    // Инициализация индикаторов
    const formatNumber = (num) => num.toString().padStart(2, '0');
    if (currentSlideIndicator && slides.length > 0) {
        currentSlideIndicator.innerHTML = `${formatNumber(1)}/<span>${formatNumber(slides.length)}</span>`;
    }
    
    if (prevButton) {
        prevButton.disabled = true;
        prevButton.classList.add('is-disabled');
    }

    return msImages;
}

export function initReviewsSlider() {
    console.log('Начало инициализации всех слайдеров');
    
    try {
        // VL.ru слайдер
        initSingleReviewsSlider(
            '.ms-slide__container',
            '.reviews__controls-prev',
            '.reviews__controls-next',
            '.reviews__controls-current'
        );
    } catch (error) {
        console.error('Ошибка при инициализации VL.ru слайдера:', error);
    }

    try {
        // 2GIS слайдер
        initSingleReviewsSlider(
            '.ms-slide__container-2',
            '.reviews__controls-prev-2',
            '.reviews__controls-next-2',
            '.reviews__controls-current-2'
        );
    } catch (error) {
        console.error('Ошибка при инициализации 2GIS слайдера:', error);
    }

    try {
        // Яндекс слайдер
        initSingleReviewsSlider(
            '.ms-slide__container-3',
            '.reviews__controls-prev-3',
            '.reviews__controls-next-3',
            '.reviews__controls-current-3'
        );
    } catch (error) {
        console.error('Ошибка при инициализации Яндекс слайдера:', error);
    }

    console.log('Завершение инициализации всех слайдеров');
}