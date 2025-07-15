import { videoManager } from './videoManager.js';

export async function loader(timeoutMs = 8000) {
    if (document.readyState !== 'complete') {
        await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
        });
    }

    const videoSelector = '.hero__splide-slide-inner video';
    
    // Get unique video elements by src
    const videoElements = document.querySelectorAll(videoSelector);
    const uniqueVideos = Array.from(videoElements).reduce((acc, video) => {
        const src = video.getAttribute('src');
        if (!acc.has(src)) {
            acc.set(src, video);
        }
        return acc;
    }, new Map());

    const videoPromises = Array.from(uniqueVideos.values()).map(video => {
        // Set required attributes
        video.muted = true;
        video.playsInline = true;
        
        // Используем videoManager для загрузки
        return videoManager.loadVideo(video);
    });

    await Promise.all(videoPromises);
}
