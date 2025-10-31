export function initVideoModal() {
    const modal = document.querySelector('.modal-video');
    const modalPlayer = modal.querySelector('.modal-video__player');
    const closeBtn = modal.querySelector('.modal-video__close');
    const overlay = modal.querySelector('.modal-video__overlay');
    
    // Функция открытия модального окна
    function openVideoModal(videoElement) {
        const videoSrc = videoElement.src || videoElement.querySelector('source')?.src;
        if (!videoSrc) return;
        
        // Создаем новый элемент video для модального окна
        const modalVideo = document.createElement('video');
        modalVideo.src = videoSrc;
        modalVideo.controls = true;
        modalVideo.autoplay = true;
        
        // Очищаем и добавляем новое видео
        modalPlayer.innerHTML = '';
        modalPlayer.appendChild(modalVideo);
        
        // Показываем модальное окно
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Функция закрытия модального окна
    function closeVideoModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalPlayer.innerHTML = '';
    }
    
    // Обработчики событий для видео в hero секции
    document.querySelectorAll('.hero__splide video, .hero__mobile-video').forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => openVideoModal(video));
    });

    document.querySelectorAll('.service-detail__video video').forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => openVideoModal(video));
    });
    
    // Обработчики закрытия
    closeBtn.addEventListener('click', closeVideoModal);
    overlay.addEventListener('click', closeVideoModal);
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
} 