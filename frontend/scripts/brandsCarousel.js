import { gsap } from "gsap";

export function initBrandsCarousel() {
    const track = document.querySelector('.carousel__track');
    if (!track) return;

    const logos = Array.from(track.querySelectorAll('.carousel__slide'));
    
    if (logos.length === 0) {
        console.warn('no slides found');
        return;
    }

    logos.forEach(logo => track.appendChild(logo.cloneNode(true)));

    while (track.scrollWidth < window.innerWidth * 2) {
        logos.forEach(logo => track.appendChild(logo.cloneNode(true)));
    }

    gsap.to(track, {
        x: `-=${track.scrollWidth / 2}`,
        duration: 100,
        ease: "linear",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (track.scrollWidth / 2))
        }
    });
}
