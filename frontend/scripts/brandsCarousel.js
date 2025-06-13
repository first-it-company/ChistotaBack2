import { gsap } from "gsap";

export function initBrandsCarousel() {
    const track = document.querySelector('.carousel__track');
    if (!track) return;

    let logos = Array.from(track.querySelectorAll('.carousel__slide'));

    logos.forEach(logo => track.appendChild(logo.cloneNode(true)));

    while (track.scrollWidth < window.innerWidth * 2) {
        logos.forEach(logo => track.appendChild(logo.cloneNode(true)));
    }

    gsap.to(track, {
        x: `-=${track.scrollWidth / 2}`,
        duration: 50,
        ease: "linear",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (track.scrollWidth / 2))
        }
    });
}
