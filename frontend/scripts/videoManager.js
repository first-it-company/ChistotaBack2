// Глобальный менеджер видео для предотвращения множественных загрузок
class VideoManager {
    constructor() {
        this.loadingVideos = new Set();
        this.loadedVideos = new Set();
    }

    async loadVideo(video) {
        const src = video.src || video.getAttribute('src');
        const videoName = src.split('/').pop();

        console.log(`📹 [${videoName}] Starting load, readyState: ${video.readyState}`);
        console.time(`📹 Video load: ${videoName}`);

        if (this.loadedVideos.has(src) || this.loadingVideos.has(src)) {
            console.log(`✅ [${videoName}] Already loaded/loading`);
            return Promise.resolve();
        }

        if (video.readyState >= 2) {
            this.loadedVideos.add(src);
            console.log(`✅ [${videoName}] Already ready (readyState: ${video.readyState})`);
            return Promise.resolve();
        }

        this.loadingVideos.add(src);

        return new Promise((resolve, reject) => {
            const startTime = performance.now();

            const onLoadedData = () => {
                cleanup();
                const duration = (performance.now() - startTime).toFixed(2);
                console.timeEnd(`📹 Video load: ${videoName}`);
                console.log(`✅ [${videoName}] Loaded! Duration: ${duration}ms, readyState: ${video.readyState}`);
                this.loadingVideos.delete(src);
                this.loadedVideos.add(src);
                resolve();
            };

            const onError = (error) => {
                cleanup();
                console.timeEnd(`📹 Video load: ${videoName}`);
                console.warn(`❌ [${videoName}] Error:`, error);
                this.loadingVideos.delete(src);
                resolve();
            };

            const onProgress = (e) => {
                if (video.buffered.length > 0) {
                    const buffered = video.buffered.end(0);
                    const duration = video.duration;
                    const percent = duration ? ((buffered / duration) * 100).toFixed(1) : 0;
                    console.log(`📊 [${videoName}] Progress: ${percent}%, buffered: ${buffered.toFixed(1)}s`);
                }
            };

            const cleanup = () => {
                video.removeEventListener('loadeddata', onLoadedData);
                video.removeEventListener('error', onError);
                video.removeEventListener('progress', onProgress);
            };

            video.addEventListener('loadeddata', onLoadedData, { once: true });
            video.addEventListener('error', onError, { once: true });
            video.addEventListener('progress', onProgress); // Отслеживаем прогресс

            setTimeout(() => {
                if (this.loadingVideos.has(src)) {
                    console.warn(`⏱️ [${videoName}] Timeout after 8s, readyState: ${video.readyState}`);
                    onError(new Error('Timeout'));
                }
            }, 8000);

            console.log(`🔄 [${videoName}] Calling video.load(), current src: ${video.src || 'EMPTY'}`);

            // КРИТИЧНО: Проверьте что src установлен
            if (!video.src && !video.getAttribute('src')) {
                console.error(`❌ [${videoName}] No src attribute!`);
                onError(new Error('No src'));
                return;
            }

            video.load();

            // Дополнительная проверка через 100ms
            setTimeout(() => {
                console.log(`🔍 [${videoName}] After 100ms, readyState: ${video.readyState}, networkState: ${video.networkState}`);
            }, 100);
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