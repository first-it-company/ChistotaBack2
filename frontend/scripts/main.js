import '../styles/main.scss';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

import initSmoothScroll from './smoothScroll.js';
import { initTypewriterHero } from './typewriterHero.js';
import { initTypewriterCta } from './typewritterCta.js';
import initBrandsCarousel from './brandsCarousel.js';
import { initScrollWordAnimation } from'./splittingHeaders';
import { initHeader } from'./header.js';
import { initExpandableText } from "./serviceCardText";
import { initTeamSlider } from "./teamSlider";
import { initModal } from "./modal.js";
import { initFormFeedback } from "./form.js";
import { initModalSuccess } from "./modalSuccess.js";
import { initFooterReviewSlider } from './footerReviewSlider.js';
import { initReviewsScroll } from './reviewsScroll.js';
import { initCasesToggle  } from './casesToggle.js';
import { initCaseFancybox } from './caseLightBox.js';
import { initStackingCards } from './stackingCards.js';
import initFaqAccordion from "@/scripts/accordion.js";
import {initScrollReveal} from "@/scripts/fadeAnimations.js";
import { initOdometer } from "./odometer.js";
import {initReviewsSliderMobile} from "@/scripts/reviewsSliderMobile.js";
import { initBrandsCarouselSecond } from "./brandsCarousel.js";

const BREAKPOINT = 990;
const isDesktop = () => window.innerWidth >= BREAKPOINT;

document.addEventListener('DOMContentLoaded', async () => {
    if (isDesktop()) {
        initSmoothScroll();
        initStackingCards();
        initScrollReveal();
        initReviewsScroll();
    }

    initTypewriterHero();
    initTypewriterCta();
    initBrandsCarousel();
    initScrollWordAnimation();
    initHeader();
    initExpandableText();
    initTeamSlider();
    initModal();
    initFormFeedback();
    initModalSuccess();
    initFooterReviewSlider();
    initCasesToggle();
    initCaseFancybox();
    initFaqAccordion();
    initOdometer();
    initReviewsSliderMobile();
    initBrandsCarouselSecond();

    if (document.querySelector('[data-service-splide-left]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselLeft }) => initServiceCarouselLeft());
    }

    if (document.querySelector('[data-service-splide-right]')) {
        import('./serviceCarousel.js').then(({ initServiceCarouselRight }) => initServiceCarouselRight());
    }
});