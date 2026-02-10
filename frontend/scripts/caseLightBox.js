import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox.css';

export function initCaseFancybox() {
    const container = document.querySelector("[data-case-fancybox]");
    const item = container.querySelector('[data-case-item]');

    if (!item) {
        return null;
    }

    const handleClick = (e) => {
        e.preventDefault();

        const items = container.querySelectorAll('[data-case-item]');
        const currentIndex = Array.from(items).indexOf(item);

        const fancyboxItems = Array.from(items).map(el => {
            const video = el.querySelector('video');
            const img = el.querySelector('img');

            if (video) {
                return {
                    src: video.src,
                    type: 'html5video',
                };
            } else if (img) {
                return {
                    src: img.src,
                    type: 'image',
                };
            }
        }).filter(Boolean);

        Fancybox.show(fancyboxItems, {
            startIndex: currentIndex,
            Thumbs: {
                autoStart: true,
            },
            Toolbar: {
                display: ["zoom", "close", "download"]
            },
            Images: {
                zoom: true,
            },
            hideClass: false,
        });
    };

    item.addEventListener('click', handleClick);

    return () => {
        item.removeEventListener('click', handleClick);
        Fancybox.close();
    };
}