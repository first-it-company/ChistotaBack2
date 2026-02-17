import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initStackingCards() {
    const wrapper = document.querySelector('[data-stacking-cards]');
    if (!wrapper) return;

    const cards = wrapper.querySelectorAll('[data-stacking-cards-item]');
    if (cards.length === 0) return;

    const getCardHeight = () => {
        return cards[0].offsetHeight;
    };

    const CARD_GAP = 30;
    const TOP_OFFSET = 30;
    const scaleStep = 0.025;
    const cardCount = cards.length;

    const setupAnimation = () => {
        const CARD_HEIGHT = getCardHeight();

        gsap.set(cards, {
            willChange: 'transform',
            force3D: true,
        });

        const totalHeight = (CARD_HEIGHT * cardCount) + (CARD_GAP * (cardCount - 1)) + CARD_HEIGHT;
        wrapper.style.minHeight = `${totalHeight}px`;

        const triggers = [];

        cards.forEach((card, i) => {
            const reverseIndex = cardCount - i;
            const targetScale = 1 - (reverseIndex * scaleStep);
            const startOffset = TOP_OFFSET + (i * CARD_GAP);
            const pinDuration = CARD_HEIGHT * reverseIndex

            const scaleTween = gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                    invalidateOnRefresh: true,
                },
                ease: "none",
                scale: targetScale,
                force3D: true,
                transformOrigin: "center center",
            });

            const pinTrigger = ScrollTrigger.create({
                trigger: card,
                start: `top top+=${startOffset}px`,
                end: `+=${pinDuration}px`,
                pin: true,
                pinSpacing: false,
                invalidateOnRefresh: true,
            });

            triggers.push(scaleTween.scrollTrigger, pinTrigger);
        });

        return triggers;
    };

    let triggers = setupAnimation();

    const resizeObserver = new ResizeObserver(() => {
        triggers.forEach(trigger => trigger?.kill());
        ScrollTrigger.refresh();
        triggers = setupAnimation();
    });

    resizeObserver.observe(cards[0]);

    return () => {
        triggers.forEach(trigger => trigger?.kill());
        resizeObserver.disconnect();
        gsap.set(cards, { clearProps: 'all' });
    };
}