import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

let topSplide = null;
let bottomSplide = null;
let allTopSlides = [];
let allBottomSlides = [];
let allSlides = []; // Добавляем массив для всех слайдов

export function initCasesSlider() {
    // Проверяем ширину экрана для определения планшетной и мобильной версии
    const isTabletOrMobile = window.innerWidth <= 768;

    
    // Сохраняем оригинальные слайды
    if (allTopSlides.length === 0) {
        const topSlideElements = document.querySelectorAll('.cases__splide--top .cases__splide-slide');

        allTopSlides = Array.from(topSlideElements).map(slide => ({
            element: slide.cloneNode(true),
            scope: slide.dataset.scope
        }));
    }
    
    if (allBottomSlides.length === 0) {
        const bottomSlideElements = document.querySelectorAll('.cases__splide--bottom .cases__splide-slide');

        allBottomSlides = Array.from(bottomSlideElements).map(slide => ({
            element: slide.cloneNode(true),
            scope: slide.dataset.scope
        }));
    }

    // Объединяем все слайды для планшетов и мобильных
    if (allSlides.length === 0) {
        allSlides = [...allTopSlides, ...allBottomSlides];

    }
    
    // На планшетах и мобильных объединяем все слайды в верхний ряд
    if (isTabletOrMobile) {
        const topSplideList = document.querySelector('.cases__splide-wrapper--top');
        if (topSplideList) {

            topSplideList.innerHTML = '';
            // Добавляем ВСЕ слайды в верхний ряд
            allSlides.forEach((slide, index) => {

                topSplideList.appendChild(slide.element.cloneNode(true));
            });
        }
    }
    
    // Общие настройки для обоих слайдеров
    const splideOptions = {
        type: 'slide',
        rewind: true,
        perPage: 2, // Показываем по 2 слайда на экране
        perMove: 1, // Перелистываем по 1 слайду
        gap: 28,
        autoplay: false, // Отключаем автоплей чтобы они не рассинхронизировались
        speed: 800,
        arrows: false,
        pagination: false,
        breakpoints: {
            // 2100: {
            //     perPage: 2, // Показываем по 2 слайда на экране
            // },
            1023: {
                perPage: 2,
                perMove: 1,
                gap: 16,
            },
            768: {
                perPage: 2,
                perMove: 1,
                padding: { right: '30%' },
                trimSpace: false,
            },
            680: {
                perPage: 1,
                padding: { right: '30%' },
                gap: 16,
            }
        }
    };

    // Инициализируем верхний слайдер
    topSplide = new Splide('.cases__splide--top', splideOptions);
    
    // Инициализируем нижний слайдер только если не планшет и не мобильная
    if (!isTabletOrMobile) {
        bottomSplide = new Splide('.cases__splide--bottom', splideOptions);
    } else {
        console.log('Нижний слайдер не инициализируется (планшет/мобильная)');
    }

    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const counterEl = document.getElementById('casesCurrent');

    const updateUI = () => {
        const index = topSplide.index;
        const endIndex = topSplide.Components.Controller.getEnd();
        const current = index + 1;
        const total = endIndex + 1;

        
        const formattedCurrent = String(current).padStart(2, '0');
        const formattedTotal = String(total).padStart(2, '0');
        
        if (counterEl) {
            counterEl.textContent = `${formattedCurrent}/${formattedTotal}`;
        }
        
        if (btnPrev) {
            btnPrev.classList.toggle('is-disabled', index === 0);
        }
        
        if (btnNext) {
            btnNext.classList.toggle('is-disabled', index === endIndex);
        }
    };

    // Синхронизация слайдеров (только если оба существуют)
    const syncSliders = (activeIndex) => {
        if (topSplide) {
            topSplide.go(activeIndex);
        }
        if (bottomSplide) {
            bottomSplide.go(activeIndex);
        }
    };

    // Обработчики кнопок навигации
    if (btnPrev) {
        btnPrev.addEventListener('click', e => {
            e.preventDefault();
            const currentIndex = topSplide.index;
            const newIndex = currentIndex - 1;
            syncSliders(newIndex);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', e => {
            e.preventDefault();
            const currentIndex = topSplide.index;
            const newIndex = currentIndex + 1;
            syncSliders(newIndex);
        });
    }

    const syncOpacity = () => {
        const topSlides = document.querySelectorAll('.cases__splide--top .cases__splide-slide');
        const bottomSlides = document.querySelectorAll('.cases__splide--bottom .cases__splide-slide');
        const activeIndex = topSplide.index;
        
        // Синхронизируем активные состояния
        [...topSlides, ...bottomSlides].forEach((slide, index) => {
            const slideIndex = index < topSlides.length ? index : index - topSlides.length;
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
        });
    };

    // События для синхронизации
    topSplide.on('move', () => {
        const index = topSplide.index;
        if (bottomSplide && bottomSplide.index !== index) {
            bottomSplide.go(index);
        }
        syncOpacity();
    });

    if (bottomSplide) {
        bottomSplide.on('move', () => {
            const index = bottomSplide.index;
            if (topSplide.index !== index) {
                topSplide.go(index);
            }
            syncOpacity();
        });
    }

    topSplide.on('move.end', updateUI);
    topSplide.on('mounted updated', () => {
        updateUI();
        syncOpacity();
    });
    
    // Монтируем слайдеры
    topSplide.mount();
    if (bottomSplide) {
        bottomSplide.mount();
    }
    
    return { topSplide, bottomSplide };
}

export function updateSliderWithFilter(filterValue) {
    // Проверяем ширину экрана для определения планшетной и мобильной версии
    const isTabletOrMobile = window.innerWidth <= 1023.98;

    if (!topSplide) return;
    
    // Сохраняем текущий индекс
    const currentIndex = topSplide.index;
    
    // Уничтожаем существующие слайдеры
    topSplide.destroy();
    if (bottomSplide) {
        bottomSplide.destroy();
    }

    // Фильтруем слайды ПЕРЕД очисткой массивов
    const filteredTopSlides = filterValue === '' 
        ? allTopSlides 
        : allTopSlides.filter(slide => slide.scope === filterValue);
        
    const filteredBottomSlides = filterValue === '' 
        ? allBottomSlides 
        : allBottomSlides.filter(slide => slide.scope === filterValue);

    // Для планшетов используем все слайды
    const filteredAllSlides = filterValue === '' 
        ? allSlides 
        : allSlides.filter(slide => slide.scope === filterValue);

    // Обновляем контент верхнего слайдера
    const topSplideList = document.querySelector('.cases__splide-wrapper--top');
    if (topSplideList) {
        topSplideList.innerHTML = '';
        
        if (isTabletOrMobile) {
            // На планшетах и мобильных используем все отфильтрованные слайды
            filteredAllSlides.forEach(slide => {
                topSplideList.appendChild(slide.element.cloneNode(true));
            });
        } else {
            // На десктопе только слайды верхнего ряда
            filteredTopSlides.forEach(slide => {
                topSplideList.appendChild(slide.element.cloneNode(true));
            });
        }
    }

    // Обновляем контент нижнего слайдера (только для десктопа)
    if (!isTabletOrMobile) {
        const bottomSplideList = document.querySelector('.cases__splide-wrapper--bottom');
        if (bottomSplideList) {
            bottomSplideList.innerHTML = '';
            filteredBottomSlides.forEach(slide => {
                bottomSplideList.appendChild(slide.element.cloneNode(true));
            });
        }
    }

    // Реинициализируем слайдеры
    const { topSplide: newTopSplide, bottomSplide: newBottomSplide } = initCasesSlider();
    
    // Восстанавливаем индекс, если есть слайды
    if (newTopSplide) {
        const maxIndex = newTopSplide.Components.Controller.getEnd();
        const newIndex = Math.min(currentIndex, maxIndex);
        if (newIndex >= 0) {
            newTopSplide.go(newIndex);
        }
    }

    // Обновляем глобальные переменные
    topSplide = newTopSplide;
    bottomSplide = newBottomSplide;
}