class VideoManager {
    constructor() {
        this.loadingVideos = new Map();
        this.loadedVideos = new Set();
    }

    async loadVideo(video, aggressive = false) {
        const src = video.src || video.getAttribute('src');

        if (!src) {
            return Promise.reject(new Error('No src'));
        }

        if (this.loadedVideos.has(src)) {
            return Promise.resolve();
        }

        if (this.loadingVideos.has(src)) {
            return this.loadingVideos.get(src);
        }

        if (video.readyState >= 3) {
            this.loadedVideos.add(src);
            return Promise.resolve();
        }

        const loadPromise = new Promise((resolve, reject) => {
            let timeoutId = null;
            let progressCheckInterval = null;
            let resolved = false;

            const safeResolve = () => {
                if (resolved) return;
                resolved = true;
                cleanup();
                this.loadingVideos.delete(src);
                this.loadedVideos.add(src);
                resolve();
            };

            const safeReject = (error) => {
                if (resolved) return;
                resolved = true;
                cleanup();
                this.loadingVideos.delete(src);
                reject(error);
            };

            const onLoadedData = () => {
                if (video.readyState >= 1) {
                    safeResolve();
                }
            };

            const onCanPlayThrough = () => {
                safeResolve();
            };

            const onError = (error) => {
                safeReject(error instanceof Event ? new Error('Video load error') : error);
            };

            const cleanup = () => {
                video.removeEventListener('loadeddata', onLoadedData);
                video.removeEventListener('canplaythrough', onCanPlayThrough);
                video.removeEventListener('error', onError);

                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (progressCheckInterval) {
                    clearInterval(progressCheckInterval);
                    progressCheckInterval = null;
                }
            };

            video.addEventListener('loadeddata', onLoadedData);
            video.addEventListener('canplaythrough', onCanPlayThrough);
            video.addEventListener('error', onError);

            progressCheckInterval = setInterval(() => {
                if (video.buffered.length > 0 && video.duration > 0) {
                    const buffered = video.buffered.end(0);
                    const percent = (buffered / video.duration) * 100;
                    console.debug(`Video ${src.split('/').pop()}: ${percent.toFixed(1)}% loaded`);
                }
            }, 2000);

            timeoutId = setTimeout(() => {
                if (video.readyState >= 2) {
                    console.warn(`Video ${src.split('/').pop()} timeout, but has data`);
                    safeResolve();
                } else {
                    safeReject(new Error('Video load timeout'));
                }
            }, 30000);

            if (!video.hasAttribute('src') && video.children.length === 0) {
                safeReject(new Error('No src attribute or source elements'));
                return;
            }

            if (video.networkState === 2) {
                console.debug(`Video ${src.split('/').pop()} already loading`);
                return;
            }

            try {
                video.load();

                setTimeout(() => {
                    if (video.networkState === 3) {
                        safeReject(new Error('NETWORK_NO_SOURCE'));
                    }
                }, 500);
            } catch (e) {
                safeReject(e);
            }
        });

        this.loadingVideos.set(src, loadPromise);
        return loadPromise;
    }

    isLoaded(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadedVideos.has(src) || video.readyState >= 3;
    }

    isLoading(video) {
        const src = video.src || video.getAttribute('src');
        return this.loadingVideos.has(src);
    }

    async checkVideoAccessibility(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
            return response.ok;
        } catch {
            return false;
        }
    }
}

export const videoManager = new VideoManager();


document.addEventListener('DOMContentLoaded', () => {
    const words = ["Порядок", "Комфорт", "Свежесть", "Чистота"];
    let index = 0;
    let videosLoaded = false;

    const container = document.querySelector('.preloader');

    const text = document.createElement('p');
    const dot = document.createElement('span');
    text.appendChild(dot);
    text.append(words[0]);
    container.appendChild(text);

    function updateText() {
        if (index < words.length - 1) {
            setTimeout(() => {
                index++;
                text.innerHTML = `<span></span>${words[index]}`;
                updateText();
            }, 550);
        }
    }

    setTimeout(() => {
        updateText();
    }, 550);

    async function preloadInitialVideos() {
        const videos = document.querySelectorAll('.hero__splide-slide video');

        if (videos.length === 0) {
            console.warn('No videos found');
            return;
        }

        const videosToLoad = Array.from(videos).slice(0, 2);

        try {
            await Promise.all(
                videosToLoad.map(video =>
                    videoManager.loadVideo(video).catch(err => {
                        console.warn('Failed to preload video:', err);
                        return Promise.resolve();
                    })
                )
            );
            console.log('Initial videos loaded');
        } catch (err) {
            console.error('Error preloading videos:', err);
        } finally {
            videosLoaded = true;
        }
    }

    preloadInitialVideos();
    function hidePreloader() {
        container.classList.add('exit');
        setTimeout(() => {
            container.style.display = 'none';
        }, 800);
    }
    const minDisplayTime = 2200;
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        if (elapsed >= minDisplayTime && videosLoaded) {
            clearInterval(checkInterval);
            hidePreloader();
        }
    }, 100);

    setTimeout(() => {
        if (!container.classList.contains('exit')) {
            clearInterval(checkInterval);
            console.warn('Preloader timeout - hiding anyway');
            hidePreloader();
        }
    }, 8000);
});