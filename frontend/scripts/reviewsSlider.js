import MomentumSlider from "momentum-slider";


const defaultReviewsData = [
    {
        author_name: "Анна",
        service: "Послеремонтная уборка",
        review_text: "Заказывали уборку после переезда — квартира засияла!",
        photo: 'static/pages/images/reviews/avatar.png',
        rating: 5,
        link: {
            url: "https://go.2gis.com/Q5sPN",
            text: "Читать на 2GIS",
            icon: 'static/pages/icons/2gis.png',
            image: 'static/pages/images/reviews/image1.png'
        }
    }
];

function createReviewSlide(review) {
    const starsCount = review.rating || review.score || 5;
    const starsHtml = Array(5).fill(0).map((_, i) => {
        return `<img src="static/pages/icons/star.svg" class="reviews__stars_img" width="20" height="20" style="opacity:${i < starsCount ? 1 : 0.3}">`;
    }).join('');

    const reviewImageBlock = review.link?.image
        ? `
          <div class="reviews__photo-wrapper">
              <img src="${review.link.image}" alt="" class="reviews__photo" width="288" height="152">
          </div>
        `
        : '';

    const userName = review.author_name || 'Аноним';
    const userText = review.review_text || '';
    const userPhoto = review.photo || 'static/pages/images/reviews/avatar.png';
    const userService = review.service || 'Уборка';
    const userScore = review.rating || 5;

    return `
      <div class="reviews__swiper-slide">
        <div class="reviews__swiper-slide-inner">
          <div class="reviews__user-wrapper">
            <div class="reviews__user-info">
              <div class="reviews__img-wrapper">
                <img src="${userPhoto}" alt="" class="reviews__img" width="64" height="64">
              </div>
              <div class="reviews__user">
                <div class="reviews__user-top">
                  <p class="reviews__score">${userScore}.0</p>
                  <div class="reviews__stars">${starsHtml}</div>
                </div>
                <div class="reviews__user-bottom">
                  <p class="reviews__user-name">${userName}</p>
                  <p class="reviews__user-service">${userService}</p>
                </div>
              </div>
            </div>
            <div class="reviews__user-commas hidden-tablet">
              <img src="static/pages/icons/commas.svg" alt="" class="reviews__commas" width="48" height="48">
            </div>
          </div>
          <div class="reviews__content">
            <div class="reviews__body-wrapper">
              <div class="reviews__body">
                <span>${userText}</span>
              </div>
              ${review.link ? `
                <button class="reviews__button" onclick="window.open('${review.link.url}', '_blank')">
                  <img src="${review.link.icon}" alt="" class="reviews__commas" width="40" height="40">
                  <span class="reviews__button-title">${review.link.text}</span>
                </button>
              ` : ''}
            </div>
            ${reviewImageBlock}
          </div>
        </div>
      </div>
    `;
}

export function initReviewsSlider(externalData = null) {
    // Получаем данные из разных источников
    let reviewsData = externalData;
    
    if (!reviewsData) {
        // Пытаемся получить данные из DOM
        const dataElement = document.getElementById('gis-reviews-data');
        if (dataElement) {
            try {
                reviewsData = JSON.parse(dataElement.textContent);
            } catch (e) {
                console.warn('Ошибка парсинга данных отзывов:', e);
            }
        }
    }
    
    if (!reviewsData) {
        // Пытаемся получить из data-атрибута
        const reviewsContainer = document.querySelector('[data-reviews]');
        if (reviewsContainer) {
            try {
                reviewsData = JSON.parse(reviewsContainer.dataset.reviews);
            } catch (e) {
                console.warn('Ошибка парсинга data-reviews:', e);
            }
        }
    }
    
    if (!reviewsData) {
        // Пытаемся получить из глобальной переменной
        if (typeof window.gisReviewsData !== 'undefined') {
            reviewsData = window.gisReviewsData;
        }
    }
    
    // Fallback к дефолтным данным
    if (!reviewsData || !Array.isArray(reviewsData) || reviewsData.length === 0) {
        console.warn('Данные отзывов не найдены, используются дефолтные');
        reviewsData = defaultReviewsData;
    }

    const slidersContainer = document.querySelector('.ms-slide__container');
    const prevButton = document.querySelector('.reviews__controls-prev');
    const nextButton = document.querySelector('.reviews__controls-next');
    const currentSlideIndicator = document.querySelector('.reviews__controls-current');

    if (!slidersContainer) {
        console.error('Контейнер слайдера не найден');
        return;
    }

    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    const getSliderConfig = (isMobile) => ({
        el: slidersContainer,
        cssClass: 'ms-slides',
        range: [0, reviewsData.length - 1],
        rangeContent: (index) => createReviewSlide(reviewsData[index]),
        change: (newIndex) => {
            const formatNumber = (num) => num.toString().padStart(2, '0');
            if (currentSlideIndicator) {
                currentSlideIndicator.innerHTML = `${formatNumber(newIndex + 1)}/<span>${formatNumber(reviewsData.length)}</span>`;
            }
            
            if (prevButton) {
                prevButton.disabled = newIndex === 0;
                prevButton.classList.toggle('is-disabled', newIndex === 0);
            }
            
            if (nextButton) {
                nextButton.disabled = newIndex === reviewsData.length - 1;
                nextButton.classList.toggle('is-disabled', newIndex === reviewsData.length - 1);
            }
        },
        style: {
            '.reviews__swiper-slide': {
                transform: [{ scale: isMobile ? [0.95, 1] : [0.85, 1] }],
                opacity: [0.5, 1]
            },
        },
    });

    let msImages = new MomentumSlider(getSliderConfig(mobileMediaQuery.matches));

    const handleMediaChange = (e) => {
        msImages.destroy();
        msImages = new MomentumSlider(getSliderConfig(e.matches));
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
            if (currentIndex < reviewsData.length - 1) {
                msImages.select(currentIndex + 1);
            }
        });
    }

    // Инициализация индикаторов
    const formatNumber = (num) => num.toString().padStart(2, '0');
    if (currentSlideIndicator) {
        currentSlideIndicator.innerHTML = `${formatNumber(1)}/<span>${formatNumber(reviewsData.length)}</span>`;
    }
    
    if (prevButton) {
        prevButton.disabled = true;
        prevButton.classList.add('is-disabled');
    }
    
    if (nextButton && reviewsData.length <= 1) {
        nextButton.disabled = true;
        nextButton.classList.add('is-disabled');
    }

    return msImages; // Возвращаем инстанс для возможного внешнего управления
}