class VideoManager {
    constructor() {
        this.loadingVideos = new Map();
        this.loadedVideos = new Set();
    }

    async loadVideo(video) {
        const src = video.src || video.getAttribute('src');
        if (!src) return Promise.reject(new Error('No src'));

        if (this.loadedVideos.has(src)) return Promise.resolve();
        if (this.loadingVideos.has(src)) return this.loadingVideos.get(src);
        if (video.readyState >= 3) {
            this.loadedVideos.add(src);
            return Promise.resolve();
        }

        const loadPromise = new Promise((resolve, reject) => {
            let timeoutId = null;
            let resolved = false;

            const cleanup = () => {
                video.removeEventListener('loadeddata', onLoadedData);
                video.removeEventListener('canplaythrough', onCanPlayThrough);
                video.removeEventListener('error', onError);
                if (timeoutId) clearTimeout(timeoutId);
                this.loadingVideos.delete(src);
            };

            const safeResolve = () => {
                if (resolved) return;
                resolved = true;
                cleanup();
                this.loadedVideos.add(src);
                resolve();
            };

            const safeReject = (error) => {
                if (resolved) return;
                resolved = true;
                cleanup();
                reject(error);
            };

            const onLoadedData = () => safeResolve();
            const onCanPlayThrough = () => safeResolve();
            const onError = () => safeReject(new Error('Video load error'));

            video.addEventListener('loadeddata', onLoadedData);
            video.addEventListener('canplaythrough', onCanPlayThrough);
            video.addEventListener('error', onError);

            timeoutId = setTimeout(() => {
                if (video.readyState >= 2) safeResolve();
                else safeReject(new Error('Video load timeout'));
            }, 30000);

            try {
                video.load();
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
