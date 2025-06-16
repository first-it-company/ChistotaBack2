import { gsap } from "gsap";

export function initServiceCarouselR() {
    const track = document.querySelector('.other-carousel__track--top');
    let slides = Array.from(track.querySelectorAll('.other-carousel__slide'));

    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

    while (track.scrollWidth < window.innerWidth * 2) {
        slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
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
