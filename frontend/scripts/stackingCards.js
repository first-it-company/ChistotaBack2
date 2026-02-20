import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initStackingCards() {
    const wrapper = document.querySelector('[data-stacking-cards]');
    if (!wrapper) return;

    const cards = wrapper.querySelectorAll('[data-stacking-cards-item]');
    if (cards.length === 0) return;

    const CARD_GAP = 30;
    const TOP_OFFSET = 80;
    const scaleStep = 0.025;
    const cardCount = cards.length;

    let triggers = [];
    let resizeTimer;

    const killAll = () => {
        triggers.forEach(t => t?.kill());
        triggers = [];
        gsap.set(cards, { clearProps: 'transform' });
        wrapper.style.minHeight = '';
    };

    const setupAnimation = () => {
        const CARD_HEIGHT = cards[0].offsetHeight;

        const totalHeight =
            CARD_HEIGHT * cardCount +
            CARD_GAP * (cardCount - 1) +
            CARD_HEIGHT;

        wrapper.style.minHeight = `${totalHeight}px`;

        cards.forEach((card, i) => {
            const reverseIndex = cardCount - i;
            const targetScale = 1 - reverseIndex * scaleStep;
            const startOffset = TOP_OFFSET + i * CARD_GAP;
            const pinDuration = CARD_HEIGHT * reverseIndex;

            const pinTrigger = ScrollTrigger.create({
                trigger: card,
                start: `top top+=${startOffset}px`,
                end: `+=${pinDuration}px`,
                pin: true,
                pinSpacing: false,
                invalidateOnRefresh: true,
            });

            const scaleTween = gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: `top top+=${startOffset}px`,
                    end: `+=${pinDuration}px`,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                },
                ease: "none",
                scale: targetScale,
                force3D: true,
                transformOrigin: "top center",
            });

            triggers.push(pinTrigger, scaleTween.scrollTrigger);
        });

        ScrollTrigger.refresh();
    };

    setupAnimation();

    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            killAll();
            setupAnimation();
        }, 100);
    });

    resizeObserver.observe(wrapper);

    return () => {
        clearTimeout(resizeTimer);
        killAll();
        resizeObserver.disconnect();
        gsap.set(cards, { clearProps: 'all' });
    };
}