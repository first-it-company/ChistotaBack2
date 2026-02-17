import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import initSmoothScroll from "@/scripts/smoothScroll.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

window.__smoother = initSmoothScroll();