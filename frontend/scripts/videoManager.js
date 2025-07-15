// Глобальный менеджер видео для предотвращения множественных загрузок
class VideoManager {
    constructor() {
        this.loadingVideos = new Set();
        this.loadedVideos = new Set();
    }

    async loadVideo(video) {
        const src = video.src || video.getAttribute('src');
        
        // Если видео уже загружено или загружается, не загружаем снова
        if (this.loadedVideos.has(src) || this.loadingVideos.has(src)) {
            return Promise.resolve();
        }

        // Если видео уже имеет данные, считаем его загруженным
        if (video.readyState >= 2) {
            this.loadedVideos.add(src);
            return Promise.resolve();
        }

        // Добавляем в список загружающихся
        this.loadingVideos.add(src);

        return new Promise((resolve, reject) => {
            const onLoadedData = () => {
                cleanup();
                this.loadingVideos.delete(src);
                this.loadedVideos.add(src);
                resolve();
            };

            const onError = (error) => {
                cleanup();
                this.loadingVideos.delete(src);
                console.warn('Video load error:', src, error);
                resolve(); // Разрешаем промис даже при ошибке
            };

            const cleanup = () => {
                video.removeEventListener('loadeddata', onLoadedData);
                video.removeEventListener('error', onError);
            };

            video.addEventListener('loadeddata', onLoadedData, { once: true });
            video.addEventListener('error', onError, { once: true });

            // Timeout для предотвращения зависания
            setTimeout(() => {
                if (this.loadingVideos.has(src)) {
                    console.warn('Video load timeout:', src);
                    onError(new Error('Timeout'));
                }
            }, 8000);

            // Загружаем видео только если оно еще не начало загружаться
            if (video.readyState === 0) {
                video.load();
            }
        });
    }

    isLoaded(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadedVideos.has(src) || video.readyState >= 2;
    }

    isLoading(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadingVideos.has(src);
    }
}

// Создаем единственный экземпляр менеджера
export const videoManager = new VideoManager(); 