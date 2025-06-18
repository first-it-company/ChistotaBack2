import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

let currentSplide = null;
let allSlides = [];

export function initCasesSlider() {
    if (allSlides.length === 0) {
        const slideElements = document.querySelectorAll('.cases__splide-slide');
        allSlides = Array.from(slideElements).map(slide => ({
            element: slide.cloneNode(true),
            scope: slide.dataset.scope
        }));
    }
    
    const splide = new Splide('.cases__splide', {
        type: 'slide',
        rewind: true,
        perPage: 2,
        perMove: 1,
        gap: 28,
        autoplay: true,
        interval: 2000,
        pauseOnHover: true,
        speed: 800,
        arrows: false,
        pagination: false,
        breakpoints: {
            1023: {
                perMove: 1,
                gap: 16,
            },
            768: {
                perPage: 1,
                fixedWidth: 320,
                fixedHeight: 273,
                trimSpace: false,
            }
        }
    });

    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const counterEl = document.getElementById('casesCurrent');

    const updateUI = () => {
        const index = splide.index;
        const endIndex = splide.Components.Controller.getEnd();
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

    btnPrev.addEventListener('click', e => {
        splide.go('-1')
    })

    btnNext.addEventListener('click', e => {
        splide.go('+1')
    })

    const syncOpacity = () => {
        const slides = document.querySelectorAll('.cases__splide-slide');
        const activeIndex = splide.index;
        const perPage = splide.options.perPage;
        
        slides.forEach((slide, index) => {
            const isActive = index >= activeIndex && index < activeIndex + perPage;
            slide.classList.toggle('is-active', isActive);
        });
    };

    splide.on('move', syncOpacity);
    splide.on('move.end', updateUI);
    splide.on('mounted updated', () => {
        updateUI();
        syncOpacity();
    });
    
    splide.mount();
    
    currentSplide = splide;
    return splide;
}

export function updateSliderWithFilter(filterValue) {
    if (!currentSplide) return;
    currentSplide.destroy();

    const filteredSlides = filterValue === '' 
        ? allSlides 
        : allSlides.filter(slide => slide.scope === filterValue);

    const splideList = document.querySelector('.cases__splide-wrapper');
    if (splideList) {
        splideList.innerHTML = '';
        filteredSlides.forEach(slide => {
            splideList.appendChild(slide.element.cloneNode(true));
        });
    }

    initCasesSlider();
}