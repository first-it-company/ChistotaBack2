import Typewriter from 'typewriter-effect/dist/core';

export function initTypewriterCta() {
    const words = ['уборки', 'хлопот'];

    const el = document.getElementById('typewriterCta');
    if (!el) return;

    const typewriter = new Typewriter(el, {
        loop: true,
        delay: 80,
        deleteSpeed: 50,
    });

    words.forEach(word => {
        typewriter
            .typeString(word)
            .pauseFor(1500)
            .deleteAll();
    });

    typewriter.start();
}
