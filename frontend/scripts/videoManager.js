// Глобальный менеджер видео для предотвращения множественных загрузок
class VideoManager {
    constructor() {
        this.loadingVideos = new Map(); // Используем Map для хранения промисов
        this.loadedVideos = new Set();
    }

    async loadVideo(video, aggressive = false) {
        const src = video.src || video.getAttribute('src');

        if (!src) {
            console.error('❌ No video src attribute!');
            return Promise.reject(new Error('No src'));
        }

        const videoName = src.split('/').pop();

        // Если уже загружен - возвращаем сразу
        if (this.loadedVideos.has(src)) {
            console.log(`✅ [${videoName}] Already loaded`);
            return Promise.resolve();
        }

        // Если уже идет загрузка - возвращаем существующий промис
        if (this.loadingVideos.has(src)) {
            console.log(`⏳ [${videoName}] Already loading, waiting...`);
            return this.loadingVideos.get(src);
        }

        // Проверяем readyState
        if (video.readyState >= 2) {
            this.loadedVideos.add(src);
            console.log(`✅ [${videoName}] Already ready (readyState: ${video.readyState})`);
            return Promise.resolve();
        }

        console.log(`📹 [${videoName}] Starting load (aggressive: ${aggressive}), readyState: ${video.readyState}`);
        console.time(`📹 Video load: ${videoName}`);

        // Создаем промис загрузки
        const loadPromise = new Promise((resolve, reject) => {
            const startTime = performance.now();
            let progressCheckInterval = null;

            const onLoadedData = () => {
                cleanup();
                const duration = (performance.now() - startTime).toFixed(2);
                console.timeEnd(`📹 Video load: ${videoName}`);
                console.log(`✅ [${videoName}] Loaded! Duration: ${duration}ms, readyState: ${video.readyState}`);
                this.loadingVideos.delete(src);
                this.loadedVideos.add(src);
                resolve();
            };

            const onCanPlay = () => {
                // Дополнительная проверка на canplay
                if (video.readyState >= 3) {
                    onLoadedData();
                }
            };

            const onError = (error) => {
                cleanup();
                console.timeEnd(`📹 Video load: ${videoName}`);
                console.error(`❌ [${videoName}] Error:`, error);
                this.loadingVideos.delete(src);
                reject(error);
            };

            const cleanup = () => {
                video.removeEventListener('loadeddata', onLoadedData);
                video.removeEventListener('canplay', onCanPlay);
                video.removeEventListener('canplaythrough', onLoadedData);
                video.removeEventListener('error', onError);
                if (progressCheckInterval) {
                    clearInterval(progressCheckInterval);
                }
            };

            // Слушаем несколько событий для надежности
            video.addEventListener('loadeddata', onLoadedData, { once: true });
            video.addEventListener('canplay', onCanPlay, { once: true });
            video.addEventListener('canplaythrough', onLoadedData, { once: true });
            video.addEventListener('error', onError, { once: true });

            // Периодически проверяем прогресс загрузки
            progressCheckInterval = setInterval(() => {
                if (video.buffered.length > 0) {
                    const buffered = video.buffered.end(0);
                    const duration = video.duration;
                    if (duration > 0) {
                        const percent = ((buffered / duration) * 100).toFixed(1);
                        console.log(`📊 [${videoName}] Progress: ${percent}%, buffered: ${buffered.toFixed(1)}s/${duration.toFixed(1)}s`);
                    }
                }
            }, 1000);

            // Увеличиваем timeout до 15 секунд для медленных соединений
            const timeout = setTimeout(() => {
                if (this.loadingVideos.has(src)) {
                    console.warn(`⏱️ [${videoName}] Timeout after 15s, readyState: ${video.readyState}, networkState: ${video.networkState}`);

                    // Если видео частично загружено (readyState >= 1), считаем успехом
                    if (video.readyState >= 1) {
                        console.log(`⚠️ [${videoName}] Partially loaded, continuing...`);
                        onLoadedData();
                    } else {
                        onError(new Error('Timeout'));
                    }
                }
            }, 15000);

            // Проверяем, что src установлен
            if (!video.hasAttribute('src') && video.children.length === 0) {
                cleanup();
                clearTimeout(timeout);
                onError(new Error('No src attribute or source elements'));
                return;
            }

            console.log(`🔄 [${videoName}] Calling video.load()`);

            try {
                video.load();
            } catch (e) {
                cleanup();
                clearTimeout(timeout);
                onError(e);
                return;
            }

            // Проверка через 200ms
            setTimeout(() => {
                console.log(`🔍 [${videoName}] After 200ms, readyState: ${video.readyState}, networkState: ${video.networkState}`);

                // Если networkState = 3 (NETWORK_NO_SOURCE), это ошибка
                if (video.networkState === 3) {
                    console.error(`❌ [${videoName}] NETWORK_NO_SOURCE - проверьте путь к файлу!`);
                    onError(new Error('NETWORK_NO_SOURCE'));
                }
            }, 200);
        });

        // Сохраняем промис
        this.loadingVideos.set(src, loadPromise);

        return loadPromise;
    }

    isLoaded(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadedVideos.has(src) || video.readyState >= 2;
    }

    isLoading(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadingVideos.has(src);
    }

    // Метод для предварительной проверки доступности видео
    async checkVideoAccessibility(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'cors'
            });

            if (!response.ok) {
                console.error(`❌ Video not accessible: ${url}, status: ${response.status}`);
                return false;
            }

            const acceptRanges = response.headers.get('Accept-Ranges');
            if (acceptRanges !== 'bytes') {
                console.warn(`⚠️ Server doesn't support Range requests for ${url}`);
            }

            return true;
        } catch (error) {
            console.error(`❌ Error checking video accessibility: ${url}`, error);
            return false;
        }
    }
}

export const videoManager = new VideoManager();