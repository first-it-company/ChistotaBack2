export async function loader(timeoutMs = 8000) {
    if (document.readyState !== 'complete') {
        await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
        });
    }

    const isSmallScreen = window.innerWidth < 1023;

    let videos = [];

    if (isSmallScreen) {
        videos = Array.from(document.querySelectorAll('.hero__main-slide video'));
    } else {
        videos = Array.from(document.querySelectorAll('.hero__splide-slide-inner video'));
    }

    const uniqueVideos = Array.from(new Set(videos));

    const videoPromises = uniqueVideos.map(video => {
        return new Promise(resolve => {
            if (video.readyState >= 4) {
                resolve();
            } else {
                const onLoad = () => {
                    cleanup();
                    resolve();
                };
                const onError = () => {
                    cleanup();
                    resolve();
                };
                const cleanup = () => {
                    video.removeEventListener('loadeddata', onLoad);
                    video.removeEventListener('error', onError);
                };

                video.addEventListener('loadeddata', onLoad, { once: true });
                video.addEventListener('error', onError, { once: true });
                
                setTimeout(() => {
                    cleanup();
                    resolve();
                }, timeoutMs);
            }
        });
    });

    await Promise.all(videoPromises);
}
