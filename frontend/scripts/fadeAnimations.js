import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initScrollReveal() {
    const revealConfig = {
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        opacity: 1,
    };

    gsap.set(".scroll-reveal-top", { opacity: 0, y: '-30rem' });
    ScrollTrigger.batch(".scroll-reveal-top", {
        start: "top 75%",
        onEnter: batch => gsap.to(batch, { y: 0, ...revealConfig }),
    });

    gsap.set(".scroll-reveal-left", { opacity: 0, x: '-50rem' });
    ScrollTrigger.batch(".scroll-reveal-left", {
        start: "top 75%",
        onEnter: batch => gsap.to(batch, { x: 0, ...revealConfig }),
    });

    gsap.set(".scroll-reveal-right", { opacity: 0, x: '50rem' });
    ScrollTrigger.batch(".scroll-reveal-right", {
        start: "top 75%",
        onEnter: batch => gsap.to(batch, { x: 0, ...revealConfig }),
    });
}