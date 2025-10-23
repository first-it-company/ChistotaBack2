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

        const videoName = src.split('/').pop();

        if (this.loadedVideos.has(src)) {
            return Promise.resolve();
        }

        if (this.loadingVideos.has(src)) {
            return this.loadingVideos.get(src);
        }

        if (video.readyState >= 2) {
            this.loadedVideos.add(src);
            return Promise.resolve();
        }

        const loadPromise = new Promise((resolve, reject) => {
            const startTime = performance.now();
            let progressCheckInterval = null;

            const onLoadedData = () => {
                cleanup();
                this.loadingVideos.delete(src);
                this.loadedVideos.add(src);
                resolve();
            };

            const onCanPlay = () => {
                if (video.readyState >= 3) {
                    onLoadedData();
                }
            };

            const onError = (error) => {
                cleanup();
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

            video.addEventListener('loadeddata', onLoadedData, { once: true });
            video.addEventListener('canplay', onCanPlay, { once: true });
            video.addEventListener('canplaythrough', onLoadedData, { once: true });
            video.addEventListener('error', onError, { once: true });

            progressCheckInterval = setInterval(() => {
                if (video.buffered.length > 0) {
                    const buffered = video.buffered.end(0);
                    const duration = video.duration;
                    if (duration > 0) {
                        const percent = (buffered / duration) * 100;
                    }
                }
            }, 1000);

            const timeout = setTimeout(() => {
                if (this.loadingVideos.has(src)) {
                    if (video.readyState >= 1) {
                        onLoadedData();
                    } else {
                        onError(new Error('Timeout'));
                    }
                }
            }, 15000);

            if (!video.hasAttribute('src') && video.children.length === 0) {
                cleanup();
                clearTimeout(timeout);
                onError(new Error('No src attribute or source elements'));
                return;
            }

            try {
                video.load();
            } catch (e) {
                cleanup();
                clearTimeout(timeout);
                onError(e);
                return;
            }

            setTimeout(() => {
                if (video.networkState === 3) {
                    onError(new Error('NETWORK_NO_SOURCE'));
                }
            }, 200);
        });

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

    async checkVideoAccessibility(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
            if (!response.ok) {
                return false;
            }

            const acceptRanges = response.headers.get('Accept-Ranges');
            return true;
        } catch {
            return false;
        }
    }
}

export const videoManager = new VideoManager();
