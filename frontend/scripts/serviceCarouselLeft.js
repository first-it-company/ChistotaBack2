import { gsap } from "gsap";

export function initServiceCarouselL() {
    const track = document.querySelector('.other-carousel__track--bottom');
    let slides = Array.from(track.querySelectorAll('.other-carousel__slide'));

    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

    while (track.scrollWidth < window.innerWidth * 2) {
        slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
    }
    gsap.set(track, { x: -track.scrollWidth / 2 });
    gsap.to(track, {
        x: `+=${track.scrollWidth / 2}`,
        duration: 50,
        ease: "linear",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => {
                const pos = parseFloat(x);
                const halfWidth = track.scrollWidth / 2;

                if (pos >= 0) {
                    return (pos % halfWidth) - halfWidth;
                }
                return pos;
            })
        }
    });
}