import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

export function initScrollWordAnimation(selector = '.splitting-text') {
    Splitting({ by: 'words' });

    const headers = document.querySelectorAll(selector);
    if (!headers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const words = entry.target.querySelectorAll('.word');
            if (entry.isIntersecting) {
                words.forEach(word => word.classList.add('animate'));
            } else {
                words.forEach(word => word.classList.remove('animate'));
            }
        });
    }, {
        threshold: 0.5
    });

    headers.forEach(header => observer.observe(header));
}


