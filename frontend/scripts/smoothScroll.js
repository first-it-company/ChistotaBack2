import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export default function initSmoothScroll() {
    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");

    if (content) {
        const initialHeight = content.offsetHeight;
        wrapper.style.minHeight = `${initialHeight}px`;
    }

    const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        effects: true,
        smoothTouch: false,
        normalizeScroll: false
    });

    // в конце initSmoothScroll или в initReviewsScroll
    const reviewsMain = document.querySelector('.reviews__main');
    if (reviewsMain) {
        reviewsMain.style.touchAction = 'pan-x';
    }

    return smoother;
}