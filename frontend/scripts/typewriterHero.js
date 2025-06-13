import Typewriter from 'typewriter-effect/dist/core';

export function initTypewriterHero() {
    const words = ['чисто', 'уютно', 'порядок', 'свежо'];

    const elements = document.querySelectorAll('.hero__header-print');
    if (!elements.length) return;

    elements.forEach(el => {
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
    });
}
